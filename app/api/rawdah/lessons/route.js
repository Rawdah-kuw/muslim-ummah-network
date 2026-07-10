import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPA_URL = process.env.SUPABASE_URL || "https://buvsgjiqtaftyexjvyzw.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;

const COLS = ["title", "teacher", "gender", "day", "time", "area", "location", "types",
  "instagram", "phone", "channel_link", "zoom_link", "zoom_passcode", "lesson_date",
  "is_recurring", "is_published"];

function authed(req) {
  const pass = req.headers.get("x-admin-pass");
  return !!process.env.ADMIN_PASSWORD && pass === process.env.ADMIN_PASSWORD;
}
function db() {
  return createClient(SUPA_URL, SERVICE, { auth: { persistSession: false } });
}
function pick(obj) {
  const out = {};
  for (const k of COLS) if (obj[k] !== undefined) out[k] = obj[k];
  // Normalize empty date to null so the DB accepts it.
  if (out.lesson_date === "") out.lesson_date = null;
  return out;
}

export async function GET(req) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!SERVICE) return Response.json({ error: "no-service-key" }, { status: 500 });
  const { data, error } = await db().from("lessons").select("*").order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ lessons: data });
}

export async function POST(req) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!SERVICE) return Response.json({ error: "no-service-key" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const rows = (Array.isArray(body.lessons) ? body.lessons : [body]).map(pick).filter((r) => r.title && r.day);
  if (!rows.length) return Response.json({ error: "no-valid-rows" }, { status: 400 });
  const { data, error } = await db().from("lessons").insert(rows).select();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ lessons: data });
}

export async function PATCH(req) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!SERVICE) return Response.json({ error: "no-service-key" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  if (!body.id) return Response.json({ error: "no-id" }, { status: 400 });
  const fields = pick(body);
  fields.updated_at = new Date().toISOString();
  const { data, error } = await db().from("lessons").update(fields).eq("id", body.id).select();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ lesson: data?.[0] });
}

export async function DELETE(req) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!SERVICE) return Response.json({ error: "no-service-key" }, { status: 500 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "no-id" }, { status: 400 });
  const { error } = await db().from("lessons").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
