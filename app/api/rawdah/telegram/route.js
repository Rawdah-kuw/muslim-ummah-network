import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

const SUPA_URL = process.env.SUPABASE_URL || "https://buvsgjiqtaftyexjvyzw.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_KEY;
const TG = process.env.TELEGRAM_BOT_TOKEN;
const MODEL = "claude-sonnet-4-6";
const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const PROMPT = `أنتِ خبيرة متخصصة في تحليل بوسترات الدروس الدينية في الكويت. استخرجي معلومات الدروس بدقة عالية.

اقرئي كل النصوص (العناوين، الزوايا، الأسفل، بجانب الأيقونات، الوسوم الملوّنة).

حدّدي عدد الدروس: درس واحد → عنصر واحد؛ جدول أسبوعي → كل الدروس؛ درس متكرر عدة أيام → عنصر واحد باليوم الأول و is_recurring=true.

الحقول لكل درس:
▪ title: عنوان الدرس بدون اسم الداعية.
▪ teacher: اسم الداعية مع اللقب. عدة معلمين اربطيهم بـ«و».
▪ gender: "نساء" إن كانت الداعية امرأة أو الدرس للنساء؛ "رجال" إن كان الداعية رجلاً أو الدرس للجميع. (الشيخة/الدكتورة/الأستاذة/الواعظة/الباحثة/المعلمة → نساء) و(الشيخ/الدكتور/الأستاذ → رجال). إن لم يتّضح "نساء".
▪ day: واحد من: الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت.
▪ time: بأرقام إنجليزية مثل "4:30 م" أو "بعد صلاة المغرب".
▪ area: منطقة الكويت فقط أو "".
▪ location: اسم المسجد كاملاً مع رقم القطعة إن وُجد أو "".
▪ types: array من: "حضوري"، "اونلاين"، "مسجل".
▪ instagram: اسم الحساب بدون @ أو "".
▪ phone: أرقام فقط بالإنجليزية أو "".
▪ channel_link: رابط قناة/قروب واتساب أو تلغرام أو "".
▪ zoom_link: رابط زوم كامل يبدأ https:// أو "".
▪ zoom_passcode: رمز الزوم أو "".
▪ telegram_link: رابط تيليجرام كامل (t.me/…) إن وُجد أو "".
▪ lesson_date: تاريخ YYYY-MM-DD إن وُجد أو "".
▪ is_recurring: true إن كان أسبوعياً متكرراً وإلا false.
▪ days: مصفوفة الأيام إن ذكر البوستر عدة أيام لنفس الدرس («الأيام: الأحد • الإثنين • الأربعاء • الخميس») وإلا [].
▪ date_from / date_to: إن ذُكر نطاق («ابتداءً من 5 يوليو ولغاية 5 أغسطس 2026») بصيغة YYYY-MM-DD وإلا "".
مهم: البوستر بعدة أيام ونطاق تواريخ = **درس واحد** مع days وdate_from وdate_to (لا تكرّريه).

تكملة منشور سابق: قد يكون هذا المنشور تكملةً لبوستر أُرسل قبله (مثلاً نصّ فيه روابط الزوم/تيليجرام/واتساب أو الوقت فقط، لنفس الدرس). في هذه الحالة استخرجي كل ما هو موجود فعلاً ولو كان جزئياً (الداعية/اليوم/الوقت/الروابط/المكان) واتركي الباقي "". لا تخترعي معلومات غير موجودة. الروابط غالباً تكون في النصوص، والأوقات والأماكن غالباً في الصور — لذا كل منشور قد يحمل جزءاً من الدرس. لا تردّي {"error":"ليس بوستر درس"} إلا إذا لم يكن للمنشور علاقة بدرس ديني إطلاقاً؛ أما إذا كان فيه ولو داعية أو يوم أو رابط لدرس، فاستخرجيه.

أرجعي JSON فقط بلا شرح:
{"lessons":[{"title":"","teacher":"","gender":"","day":"","days":[],"time":"","area":"","location":"","types":[""],"instagram":"","phone":"","channel_link":"","zoom_link":"","zoom_passcode":"","telegram_link":"","lesson_date":"","date_from":"","date_to":"","is_recurring":false}]}

إن لم يكن للمنشور علاقة بدرس ديني إطلاقاً → أرجعي {"error":"ليس بوستر درس"}.`;

const HONORIFICS = ["د", "ا", "الدكتور", "الدكتوره", "دكتور", "دكتوره", "الشيخ", "الشيخه",
  "شيخ", "شيخه", "الاستاذ", "الاستاذه", "استاذ", "استاذه", "الاخت", "الواعظه", "الداعيه",
  "المعلمه", "الباحثه"];
function normalizeText(s) {
  if (!s) return "";
  const t = String(s)
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    .replace(/[ً-ْ]/g, "").replace(/[إأآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .replace(/[.،,؛:!؟"'()\-_]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  return t.split(" ").filter((w) => w && !HONORIFICS.includes(w)).join(" ");
}
function nextDateForDay(day) {
  const idx = DAYS_AR.indexOf(day);
  if (idx < 0) return null;
  const now = new Date(Date.now() + 3 * 3600 * 1000);
  const diff = (idx - now.getUTCDay() + 7) % 7;
  const t = new Date(now); t.setUTCDate(now.getUTCDate() + diff);
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
}
function weekdayOf(d) {
  if (!d) return null;
  return DAYS_AR[new Date(d + "T00:00:00Z").getUTCDay()];
}
function expandRange(row) {
  const from = row.date_from, to = row.date_to;
  const days = Array.isArray(row.days) && row.days.length
    ? row.days.filter((d) => DAYS_AR.includes(d))
    : (row.day ? [row.day] : []);
  if (!from || !to || !days.length) return [row];
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return [row];
  const out = [];
  const d = new Date(start);
  let guard = 0;
  while (d <= end && out.length < 60 && guard++ < 400) {
    const wd = DAYS_AR[d.getUTCDay()];
    if (days.includes(wd)) {
      const iso = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      out.push({ ...row, day: wd, lesson_date: iso, is_recurring: false });
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out.length ? out : [row];
}
function inferGender(teacher, title) {
  const s = `${teacher || ""} ${title || ""}`
    .replace(/[إأآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/\s+/g, " ");
  if (/(الشيخه|الدكتوره|الاستاذه|الواعظه|الباحثه|المعلمه|الداعيه|الاخت|المربيه|المدربه)/.test(s)) return "نساء";
  if (/(^|\s)ام\s/.test(s)) return "نساء";
  if (/للنساء|النساء فقط|نسائي/.test(s)) return "نساء";
  if (/(مريم|فاطمه|نوره|حصه|ساره|ابتسام|جميله|منيره|هيا|دلال|شيخه|موضي|بشاير|غريبه|امل|هدي|عائشه|خديجه|زينب|رقيه|اسماء|لطيفه|منال|صفاء|انفال|شيماء|وضحه|حنان|شهد|نجلاء|عبير)/.test(s)) return "نساء";
  if (/(الشيخ|الدكتور|الاستاذ|الداعي)(?!ه)/.test(s)) return "رجال";
  if (/(^|\s)(ابو|بن|ابن)\s/.test(s)) return "رجال";
  if (/(^|\s)عبد\s?ال/.test(s)) return "رجال";
  if (/(محمد|احمد|علي|عمر|خالد|يوسف|ابراهيم|صالح|سعد|فهد|ناصر|سلطان|بدر|طارق|زياد|حسن|حسين|عثمان|مشاري|عادل|وليد|ماجد|فيصل|عبدالله|سلمان)/.test(s)) return "رجال";
  return null;
}
function ensureDate(row) {
  if (row.is_recurring) { row.lesson_date = null; return; }
  if (!row.day) return;
  if (!row.lesson_date || weekdayOf(row.lesson_date) !== row.day) row.lesson_date = nextDateForDay(row.day);
}

async function tgApi(method, body) {
  return fetch(`https://api.telegram.org/bot${TG}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }).then((r) => r.json()).catch(() => ({}));
}
async function reply(chatId, text) { try { await tgApi("sendMessage", { chat_id: chatId, text }); } catch { /* ignore */ } }

async function downloadPhoto(fileId) {
  const info = await fetch(`https://api.telegram.org/bot${TG}/getFile?file_id=${fileId}`).then((r) => r.json());
  const path = info?.result?.file_path;
  if (!path) return null;
  const bin = await fetch(`https://api.telegram.org/file/bot${TG}/${path}`);
  const buf = Buffer.from(await bin.arrayBuffer());
  return { data: buf.toString("base64"), mediaType: path.endsWith(".png") ? "image/png" : "image/jpeg" };
}

async function callClaude(content) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 3000, messages: [{ role: "user", content }] }),
  });
  const data = await r.json();
  if (!r.ok) return { error: "claude-failed" };
  const text = data?.content?.[0]?.text || "";
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    if (parsed.error) return { error: parsed.error };
    if (Array.isArray(parsed.lessons)) return { lessons: parsed.lessons };
    if (parsed.title) return { lessons: [parsed] };
    return { error: "no-lessons" };
  } catch { return { error: "parse-failed" }; }
}

// Fields that a follow-up post can COMPLETE on an existing lesson (a poster image
// carries the time/place; a text message carries the links — they complete each other).
const FILL = ["time", "area", "location", "instagram", "phone",
  "channel_link", "zoom_link", "zoom_passcode", "telegram_link"];

async function insertLessons(client, lessons) {
  const COLS = ["title", "teacher", "gender", "day", "time", "area", "location", "types",
    "instagram", "phone", "channel_link", "zoom_link", "zoom_passcode", "telegram_link",
    "lesson_date", "is_recurring", "is_paused", "is_published"];
  let inserted = 0, updated = 0, skipped = 0;
  for (const raw of lessons.flatMap(expandRange)) {
    const row = {};
    for (const k of COLS) if (raw[k] !== undefined) row[k] = raw[k];
    if (!row.day) { skipped++; continue; } // need a day to place or merge the post
    if (!row.gender) row.gender = inferGender(row.teacher, row.title) || "نساء";
    // Recurrence is disabled everywhere now: every lesson is a dated one-time
    // entry (auto-removed after its date). Without this, Telegram uploads kept
    // creating dateless "recurring" rows that never expire.
    row.is_recurring = false;
    ensureDate(row);
    const { data: existing } = await client.from("lessons").select("*").eq("day", row.day);
    const nt = normalizeText(row.title), nte = normalizeText(row.teacher);
    const rl = normalizeText(row.location), rtime = normalizeText(row.time);
    // Same gathering as an existing one on this day? Match by:
    //  • same place + same time  (a place can't host two lessons at once), or
    //  • same teacher + same time (a teacher can't be in two places at once), or
    //  • same teacher (a poster image + its follow-up text; one side may lack a title), or
    //  • same title.
    const match = (existing || []).find((ex) => {
      const et = normalizeText(ex.title), ete = normalizeText(ex.teacher);
      const el = normalizeText(ex.location), etime = normalizeText(ex.time);
      if (rl && el && rl === el && rtime && etime && rtime === etime && ex.gender === row.gender) return true;
      if (nte && ete && nte === ete && rtime && etime && rtime === etime) return true;
      if (nte && ete && nte === ete) return (!nt || !et) ? true : nt === et;
      if (nt && et && nt === et) return true;
      return false;
    });
    if (match) {
      // Complete the existing card: fill only the fields it is still missing,
      // and give it a date if it was published without one (an error to fix).
      const upd = {};
      if (!match.title && row.title) upd.title = row.title;
      if (!match.teacher && row.teacher) upd.teacher = row.teacher;
      if (!match.lesson_date && row.lesson_date) upd.lesson_date = row.lesson_date;
      for (const k of FILL) if (row[k] && !match[k]) upd[k] = row[k];
      const title = upd.title || match.title, teacher = upd.teacher || match.teacher, time = upd.time || match.time;
      if (!match.is_published && title && teacher && time) upd.is_published = true;
      if (Object.keys(upd).length) {
        upd.updated_at = new Date().toISOString();
        await client.from("lessons").update(upd).eq("id", match.id);
        updated++;
      } else skipped++;
      continue;
    }
    if (!row.title) { skipped++; continue; } // a partial post with nothing to attach to
    row.is_published = !!(row.title && row.teacher && row.time); // auto-publish complete
    const { error } = await client.from("lessons").insert([row]);
    if (!error) inserted++;
  }
  return { inserted, updated, skipped };
}

export async function POST(req) {
  // Verify the request really comes from Telegram.
  if (process.env.TELEGRAM_WEBHOOK_SECRET &&
      req.headers.get("x-telegram-bot-api-secret-token") !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return Response.json({ ok: false }, { status: 401 });
  }
  if (!TG || !SERVICE) return Response.json({ ok: true }); // not configured yet — ack silently

  let update;
  try { update = await req.json(); } catch { return Response.json({ ok: true }); }
  const msg = update.message || update.channel_post;
  if (!msg) return Response.json({ ok: true });
  const chatId = msg.chat?.id;

  // Restrict to allowed chats. If none configured, reveal the chat id to help setup.
  const allowed = (process.env.TELEGRAM_ALLOWED_CHAT || "").split(",").map((s) => s.trim()).filter(Boolean);
  console.log("RAWDAH_TG start", JSON.stringify({
    chatId, allowed, hasPhoto: !!(msg.photo && msg.photo.length), hasText: !!(msg.caption || msg.text),
    hasTG: !!TG, hasSERVICE: !!SERVICE, hasKey: !!process.env.ANTHROPIC_API_KEY,
  }));
  if (allowed.length === 0) {
    await reply(chatId, `مرحبًا 👋 معرّف هذه المحادثة هو:\n${chatId}\n\nأضيفيه في المتغيّر TELEGRAM_ALLOWED_CHAT في Vercel لتفعيل الإضافة التلقائية.`);
    return Response.json({ ok: true });
  }
  if (!allowed.includes(String(chatId))) {
    console.log("RAWDAH_TG chat-not-allowed", chatId);
    return Response.json({ ok: true });
  }

  // Build the content for Claude (photo caption or plain text).
  const caption = (msg.caption || msg.text || "").trim();
  let content = null;
  if (msg.photo && msg.photo.length) {
    const img = await downloadPhoto(msg.photo[msg.photo.length - 1].file_id);
    console.log("RAWDAH_TG photo-download", !!img);
    if (img) {
      content = [{ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } },
        { type: "text", text: PROMPT + (caption ? `\n\nالتعليق المرفق: ${caption}` : "") }];
    }
  } else if (caption) {
    content = [{ type: "text", text: PROMPT + `\n\nالنص التالي من منشور تلغرام:\n${caption}` }];
  }
  if (!content) { console.log("RAWDAH_TG no-content"); return Response.json({ ok: true }); }

  const result = await callClaude(content);
  console.log("RAWDAH_TG analyze", JSON.stringify(result).slice(0, 400));
  if (result.error) {
    await reply(chatId, result.error === "ليس بوستر درس" ? "لم أتعرّف على درس في هذا المنشور." : "تعذّر تحليل المنشور، حاولي مرة أخرى.");
    return Response.json({ ok: true });
  }
  const client = createClient(SUPA_URL, SERVICE, { auth: { persistSession: false } });
  const { inserted, updated, skipped } = await insertLessons(client, result.lessons);
  console.log("RAWDAH_TG insert", inserted, updated, skipped);
  const parts = [];
  if (inserted) parts.push(`✅ أُضيف ${inserted} درس`);
  if (updated) parts.push(`🔗 أُكمل ${updated} درس`);
  if (skipped) parts.push(`↩️ تُجوهل ${skipped}`);
  await reply(chatId, parts.join(" · ") || "لم يُضف شيء جديد.");
  return Response.json({ ok: true, inserted, updated, skipped });
}
