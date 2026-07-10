import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPA_URL = process.env.SUPABASE_URL || "https://buvsgjiqtaftyexjvyzw.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;

const COLS = ["title", "teacher", "gender", "day", "time", "area", "location", "types",
  "instagram", "phone", "channel_link", "zoom_link", "zoom_passcode", "lesson_date",
  "is_recurring", "is_paused", "is_published"];

const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

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
  if (out.lesson_date === "") out.lesson_date = null;
  return out;
}

// Normalize Arabic text so duplicates are caught despite spelling variations.
function normalizeText(s) {
  if (!s) return "";
  return String(s)
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    .replace(/[ً-ْ]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .replace(/[.،,؛:!؟"'()\-_]/g, "")
    .trim()
    .toLowerCase();
}

// Nearest upcoming date matching a weekday name (Kuwait time, UTC+3).
function nextDateForDay(day) {
  const idx = DAYS_AR.indexOf(day);
  if (idx < 0) return null;
  const now = new Date(Date.now() + 3 * 3600 * 1000);
  const diff = (idx - now.getUTCDay() + 7) % 7;
  const t = new Date(now);
  t.setUTCDate(now.getUTCDate() + diff);
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
}

// Arabic weekday name for a YYYY-MM-DD string.
function weekdayOf(dateStr) {
  if (!dateStr) return null;
  const dt = new Date(dateStr + "T00:00:00Z");
  return DAYS_AR[dt.getUTCDay()];
}

// Enforce: recurring → no date; non-recurring → date must match its weekday,
// otherwise reset to the nearest upcoming date for that day.
function ensureDate(row) {
  if (row.is_recurring) { row.lesson_date = null; return; }
  if (!row.day) return;
  if (!row.lesson_date || weekdayOf(row.lesson_date) !== row.day) {
    row.lesson_date = nextDateForDay(row.day);
  }
}

// Delete non-recurring lessons that are past-dated OR have no date at all.
// (Recurring weekly lessons are always kept.)
async function cleanupOld(client) {
  // Delete once the lesson's day has passed: any date strictly before today (Kuwait).
  const cutoff = new Date(Date.now() + 3 * 3600 * 1000).toISOString().split("T")[0];
  const { data: rows } = await client.from("lessons").select("id, is_recurring, lesson_date");
  const ids = (rows || [])
    .filter((l) => !l.is_recurring && (!l.lesson_date || l.lesson_date < cutoff))
    .map((l) => l.id);
  if (ids.length) await client.from("lessons").delete().in("id", ids);
  return ids.length;
}

// Fix existing rows whose stored date doesn't match their weekday.
async function healDates(client) {
  const { data: rows } = await client.from("lessons").select("id, day, lesson_date, is_recurring");
  const fixes = (rows || []).filter((l) => !l.is_recurring && l.day && l.lesson_date && weekdayOf(l.lesson_date) !== l.day);
  for (const l of fixes) await client.from("lessons").update({ lesson_date: nextDateForDay(l.day) }).eq("id", l.id);
  return fixes.length;
}

export async function GET(req) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!SERVICE) return Response.json({ error: "no-service-key" }, { status: 500 });
  const client = db();
  let cleaned = 0;
  try { cleaned = await cleanupOld(client); await healDates(client); } catch { /* ignore */ }
  const { data, error } = await client.from("lessons").select("*").order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ lessons: data, cleaned });
}

export async function POST(req) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!SERVICE) return Response.json({ error: "no-service-key" }, { status: 500 });
  const client = db();
  const body = await req.json().catch(() => ({}));
  const incoming = (Array.isArray(body.lessons) ? body.lessons : [body]).map(pick).filter((r) => r.title && r.day);
  if (!incoming.length) return Response.json({ error: "no-valid-rows" }, { status: 400 });

  const insertedRows = [];
  let skipped = 0;
  for (const row of incoming) {
    ensureDate(row);
    // Smart duplicate check against existing lessons on the same day.
    const { data: existing } = await client.from("lessons")
      .select("id, title, teacher, lesson_date, is_recurring").eq("day", row.day);
    const nt = normalizeText(row.title);
    const nte = normalizeText(row.teacher);
    const dup = (existing || []).some((ex) => {
      if (normalizeText(ex.title) !== nt || normalizeText(ex.teacher) !== nte) return false;
      if (ex.is_recurring) return true;
      return (ex.lesson_date || null) === (row.lesson_date || null) || !row.lesson_date;
    });
    if (dup) { skipped++; continue; }
    const { data, error } = await client.from("lessons").insert([row]).select();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    insertedRows.push(data[0]);
  }
  return Response.json({ lessons: insertedRows, inserted: insertedRows.length, skipped });
}

export async function PATCH(req) {
  if (!authed(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!SERVICE) return Response.json({ error: "no-service-key" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  if (!body.id) return Response.json({ error: "no-id" }, { status: 400 });
  const fields = pick(body);
  // Keep date consistent with the weekday (only when day is part of this update).
  if (fields.day !== undefined) ensureDate(fields);
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
