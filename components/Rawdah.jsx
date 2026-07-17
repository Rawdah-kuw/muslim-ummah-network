"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Sprout, MapPin, Video, MessageCircle, Instagram, Clock, Building2, Share2 } from "lucide-react";
import SectionHead from "./SectionHead";

// Public (publishable) Supabase credentials — safe to expose; RLS allows reading published lessons only.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://buvsgjiqtaftyexjvyzw.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_kRtGr0a2Tun1CQweltlxjw_qfQRQGTr";
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
// Gender: explicit field wins; otherwise infer from the teacher's honorific.
// (Existing Rawdah data is women's lessons, so default to "نساء".)
const FEMALE_RE = /الشيخة|الدكتورة|الأستاذة|الواعظة|الباحثة|المعلمة|الداعية/;
const MALE_RE = /الشيخ\s|الأستاذ\s|الدكتور\s|الداعي\s/;
function genderOf(l) {
  if (l.gender === "رجال") return "رجال";
  if (l.gender === "نساء") return "نساء";
  const teach = l.teacher || "";
  if (MALE_RE.test(teach) && !FEMALE_RE.test(teach)) return "رجال";
  return "نساء";
}
const todayName = () => DAYS[new Date().getDay()];

// Main WhatsApp group — where zoom links / lesson details are posted, used as the
// fallback for any lesson that has no dedicated group/link.
const GROUP_LINK = "https://chat.whatsapp.com/J394CWBV7zw3aIexoulZAQ";

function fmtDate(d) {
  if (!d) return "";
  const p = String(d).split("-");
  return p.length === 3 ? `${+p[2]}/${+p[1]}/${p[0]}` : String(d);
}

// Convert a time string to minutes-from-midnight for correct chronological sorting.
function parseTime(t) {
  if (!t) return 9999;
  const n = String(t).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
  if (/بعد الفجر/.test(t)) return 330;
  if (/بعد الإشراق|بعد الشروق/.test(t)) return 420;
  if (/بعد الضحى/.test(t)) return 540;
  if (/قبل الظهر/.test(t)) return 690;
  if (/بعد الظهر/.test(t)) return 750;
  if (/قبل العصر/.test(t)) return 870;
  if (/بعد العصر/.test(t)) return 960;
  if (/قبل المغرب/.test(t)) return 1050;
  if (/بعد المغرب/.test(t)) return 1110;
  if (/قبل العشاء/.test(t)) return 1170;
  if (/بعد العشاء/.test(t)) return 1200;
  const m = n.match(/(\d{1,2}):(\d{2})/);
  if (!m) return 9999;
  let h = +m[1];
  const min = +m[2];
  const pm = /م|pm|مساء/i.test(n), am = /ص|am|صباح/i.test(n);
  if (pm && h < 12) h += 12;
  if (am && h === 12) h = 0;
  if (!pm && !am && h >= 1 && h <= 7) h += 12;
  return h * 60 + min;
}

const RAWDAH_URL = "https://muslimummah.app/ar/rawdah";

// Normalize Arabic text so near-duplicates collapse (spaces, honorifics, digits, punctuation).
const HONORIFICS = ["د", "ا", "الدكتور", "الدكتوره", "دكتور", "دكتوره", "الشيخ", "الشيخه",
  "شيخ", "شيخه", "الاستاذ", "الاستاذه", "استاذ", "استاذه", "الاخت", "الواعظه", "الداعيه",
  "المعلمه", "الباحثه"];
function normalizeText(s) {
  if (!s) return "";
  const t = String(s)
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
    .replace(/[ً-ْ]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[.،,؛:!؟"'()\-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return t.split(" ").filter((w) => w && !HONORIFICS.includes(w)).join(" ");
}

// Native share sheet (iPhone/Android) with WhatsApp fallback.
async function shareText(text) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try { await navigator.share({ text }); return; } catch { return; }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}
function lessonText(l) {
  const women = genderOf(l) === "نساء";
  const dt = l.day + (l.lesson_date ? ` ${fmtDate(l.lesson_date)}` : (l.is_recurring ? " (أسبوعي)" : ""));
  const loc = [l.area, l.location].filter(Boolean).join(" - ");
  return [
    `🌿 ${l.title || ""}`,
    l.teacher ? `👤 ${l.teacher}` : "",
    `📅 ${dt}`,
    l.time ? `🕐 ${l.time} (بتوقيت الكويت)` : "",
    loc ? `📍 ${loc}` : "",
    women ? "🌸 درس للنساء" : "👥 للجميع",
    "",
    "روضة — شبكة أمة الإسلام",
    RAWDAH_URL,
  ].filter(Boolean).join("\n");
}
function scheduleText(day, list) {
  const lines = [`🌿 دروس ${day} — روضة`, ""];
  for (const l of list) {
    const bits = [l.title, l.teacher, l.time].filter(Boolean);
    lines.push(`• ${bits.join(" — ")}`);
  }
  lines.push("", "الأوقات بتوقيت الكويت (GMT+3)", `التفاصيل: ${RAWDAH_URL}`);
  return lines.join("\n");
}

function roundRectPath(x, X, Y, W, H, r) {
  x.beginPath();
  x.moveTo(X + r, Y);
  x.arcTo(X + W, Y, X + W, Y + H, r);
  x.arcTo(X + W, Y + H, X, Y + H, r);
  x.arcTo(X, Y + H, X, Y, r);
  x.arcTo(X, Y, X + W, Y, r);
  x.closePath();
}
// Draw centered, word-wrapped text; returns the y after the last line.
function drawWrapped(x, text, cx, y, maxW, lineH) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  for (const ln of lines) { x.fillText(ln, cx, y); y += lineH; }
  return y;
}
// Render a lesson as a 1080×1080 shareable card (like the daily-wird image), then share/download it.
async function shareLessonImage(l) {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch { /* ignore */ }
  const S = 1080;
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const x = c.getContext("2d");
  const women = genderOf(l) === "نساء";
  const accent = women ? "#b58d88" : "#5a7a8a";
  x.fillStyle = women ? "#fbf1f3" : "#eef4fa";
  x.fillRect(0, 0, S, S);
  x.fillStyle = "#FDFBF7"; roundRectPath(x, 56, 56, S - 112, S - 112, 46); x.fill();
  x.strokeStyle = "#e7ddd8"; x.lineWidth = 3; roundRectPath(x, 56, 56, S - 112, S - 112, 46); x.stroke();
  x.direction = "rtl"; x.textAlign = "center";

  x.fillStyle = accent; x.font = "600 32px Tajawal, sans-serif";
  x.fillText("روضة · مجالس ودروس الذكر", S / 2, 158);

  // Badges row: gender + type(s), centered.
  const badges = [{ t: women ? "للنساء" : "للجميع", bg: accent, fg: "#ffffff" }];
  for (const tp of (Array.isArray(l.types) ? l.types : [])) {
    const online = tp === "اونلاين";
    badges.push({ t: tp, bg: online ? "#dbe7f0" : "#e2ece7", fg: online ? "#3f5f70" : "#3e5a4e" });
  }
  x.font = "700 28px Tajawal, sans-serif";
  const bw = badges.map((b) => x.measureText(b.t).width + 46);
  const btotal = bw.reduce((a, b) => a + b, 0) + 16 * (badges.length - 1);
  let bx = S / 2 - btotal / 2;
  for (let i = 0; i < badges.length; i++) {
    x.fillStyle = badges[i].bg; roundRectPath(x, bx, 196, bw[i], 54, 27); x.fill();
    x.fillStyle = badges[i].fg; x.fillText(badges[i].t, bx + bw[i] / 2, 232);
    bx += bw[i] + 16;
  }

  x.fillStyle = "#1B3B2B"; x.font = "700 58px Amiri, serif";
  let ty = drawWrapped(x, l.title || "", S / 2, 352, S - 260, 76);
  if (l.teacher) { x.fillStyle = "#4F7263"; x.font = "600 40px Tajawal, sans-serif"; x.fillText(`مع ${l.teacher}`, S / 2, ty + 26); ty += 92; }

  x.strokeStyle = "#e7ddd8"; x.lineWidth = 2; x.beginPath(); x.moveTo(220, ty); x.lineTo(S - 220, ty); x.stroke(); ty += 82;

  x.fillStyle = "#334155"; x.font = "500 40px Tajawal, sans-serif";
  const dt = l.day + (l.lesson_date ? ` — ${fmtDate(l.lesson_date)}` : (l.is_recurring ? " (أسبوعي)" : ""));
  x.fillText(dt, S / 2, ty); ty += 62;
  if (l.time) { x.fillText(`${l.time} · بتوقيت الكويت`, S / 2, ty); ty += 62; }
  const loc = [l.area, l.location].filter(Boolean).join(" · ");
  if (loc) { x.font = "500 36px Tajawal, sans-serif"; x.fillStyle = "#475569"; ty = drawWrapped(x, loc, S / 2, ty, S - 300, 52); ty += 8; }
  const contact = [l.instagram ? `@${l.instagram}` : "", l.phone ? String(l.phone) : ""].filter(Boolean).join("  ·  ");
  if (contact) { x.fillStyle = "#8792a3"; x.font = "400 32px Tajawal, sans-serif"; x.fillText(contact, S / 2, ty); }

  x.fillStyle = "#1B3B2B"; x.font = "700 42px Tajawal, sans-serif"; x.fillText("شبكة أمة الإسلام", S / 2, S - 152);
  x.fillStyle = "#94A3B8"; x.font = "400 28px Tajawal, sans-serif"; x.fillText("muslimummah.app", S / 2, S - 108);
  x.fillText("صدقة جارية عن علي عبد العزيز الصدّيقي رحمه الله", S / 2, S - 68);

  c.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], "rawdah-lesson.png", { type: "image/png" });
    const payload = { files: [file], text: lessonText(l) };
    if (navigator.canShare && navigator.canShare(payload)) {
      try { await navigator.share(payload); return; } catch { return; }
    }
    const url = URL.createObjectURL(blob);
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS) { window.open(url, "_blank"); }
    else {
      const a = document.createElement("a"); a.href = url; a.download = "rawdah-lesson.png";
      document.body.appendChild(a); a.click(); a.remove();
    }
    setTimeout(() => URL.revokeObjectURL(url), 8000);
  }, "image/png");
}

function wrapLines(x, text, maxW) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}
function rowHeight(x, l, S) {
  x.font = "700 40px Amiri, serif";
  const cardW = S - 140;
  const titleLines = Math.min(2, wrapLines(x, l.title || "", cardW - 90).length || 1);
  let h = 80 + titleLines * 50;
  if (l.teacher) h += 44;
  if ([l.time, l.area, l.location].filter(Boolean).length) h += 40;
  if (l.instagram || l.phone) h += 36;
  return h + 24 + 20;
}
function drawScheduleRow(x, l, top, S) {
  const women = genderOf(l) === "نساء";
  const accent = women ? "#b58d88" : "#5a7a8a";
  const tint = women ? "#fbf1f3" : "#eef4fa";
  const cardX = 70, cardW = S - 140;
  const slot = rowHeight(x, l, S) - 20;
  x.fillStyle = tint; roundRectPath(x, cardX, top, cardW, slot, 28); x.fill();
  x.fillStyle = accent; roundRectPath(x, cardX + cardW - 14, top + 20, 8, slot - 40, 4); x.fill();
  const xR = cardX + cardW - 42, xL = cardX + 42;
  x.direction = "rtl";
  // type badges (top-left)
  let px = xL;
  for (const tp of (Array.isArray(l.types) ? l.types : [])) {
    const online = tp === "اونلاين";
    x.font = "700 26px Tajawal, sans-serif";
    const w = x.measureText(tp).width + 40;
    x.fillStyle = online ? "#dbe7f0" : "#e2ece7"; roundRectPath(x, px, top + 24, w, 44, 22); x.fill();
    x.fillStyle = online ? "#3f5f70" : "#3e5a4e"; x.textAlign = "center"; x.fillText(tp, px + w / 2, top + 54);
    px += w + 14;
  }
  // title + teacher + info (right-aligned)
  x.textAlign = "right";
  x.fillStyle = "#1B3B2B"; x.font = "700 40px Amiri, serif";
  const lines = wrapLines(x, l.title || "", cardW - 90).slice(0, 2);
  let y = top + 80;
  for (const ln of lines) { x.fillText(ln, xR, y + 38); y += 50; }
  if (l.teacher) { x.fillStyle = "#4F7263"; x.font = "600 32px Tajawal, sans-serif"; x.fillText(`مع ${l.teacher}`, xR, y + 34); y += 44; }
  const info = [l.time, l.area, l.location].filter(Boolean).join("  ·  ");
  if (info) { x.fillStyle = "#475569"; x.font = "400 30px Tajawal, sans-serif"; x.fillText(info, xR, y + 30); y += 40; }
  const contact = [l.instagram ? `@${l.instagram}` : "", l.phone ? String(l.phone) : ""].filter(Boolean).join("  ·  ");
  if (contact) { x.fillStyle = "#94a3b8"; x.font = "400 27px Tajawal, sans-serif"; x.fillText(contact, xR, y + 26); }
}
function scheduleDate(day, list) {
  const dated = (list || []).find((l) => l.lesson_date && l.day === day && !l.is_recurring);
  if (dated) { try { return new Date(`${dated.lesson_date}T00:00:00`); } catch { /* ignore */ } }
  const idx = DAYS.indexOf(day); const now = new Date();
  if (idx < 0) return now;
  const d = new Date(now); d.setDate(now.getDate() + ((idx - now.getDay() + 7) % 7)); return d;
}
function drawScheduleHeader(x, day, dateObj, S) {
  x.fillStyle = "#FDFBF7"; x.fillRect(0, 0, S, 1920);
  x.fillStyle = "#1B3B2B"; x.fillRect(0, 0, S, 214);
  x.textAlign = "center"; x.direction = "rtl";
  x.fillStyle = "#a8c3b4"; x.font = "500 30px Tajawal, sans-serif"; x.fillText("روضة · مجالس ودروس الذكر", S / 2, 62);
  x.fillStyle = "#FDFBF7"; x.font = "700 54px Tajawal, sans-serif"; x.fillText(day, S / 2, 128);
  let sub = "";
  try {
    const g = new Intl.DateTimeFormat("ar", { day: "numeric", month: "long" }).format(dateObj);
    const h = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", { day: "numeric", month: "long" }).format(dateObj);
    sub = `${g} · ${h}`;
  } catch { /* ignore */ }
  if (sub) { x.fillStyle = "#c9dcd0"; x.font = "500 32px Tajawal, sans-serif"; x.fillText(sub, S / 2, 178); }
}
function drawScheduleFooter(x, S, page, total) {
  const H = 1920;
  x.textAlign = "center"; x.direction = "rtl";
  if (total > 1) { x.fillStyle = "#94A3B8"; x.font = "400 24px Tajawal, sans-serif"; x.fillText(`${page} / ${total}`, S / 2, H - 150); }
  x.fillStyle = "#94A3B8"; x.font = "400 26px Tajawal, sans-serif"; x.fillText("جميع الأوقات بتوقيت الكويت (GMT+3)", S / 2, H - 96);
  x.fillStyle = "#1B3B2B"; x.font = "700 32px Tajawal, sans-serif"; x.fillText("شبكة أمة الإسلام · muslimummah.app", S / 2, H - 50);
}
async function shareScheduleImage(day, list) {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch { /* ignore */ }
  const S = 1080, H = 1920, START = 252, MAXY = H - 180;
  const dateObj = scheduleDate(day, list);
  const m = document.createElement("canvas").getContext("2d");
  const pages = []; let cur = []; let y = START;
  for (const l of list) {
    const h = rowHeight(m, l, S);
    if (y + h > MAXY && cur.length) { pages.push(cur); cur = []; y = START; }
    cur.push(l); y += h;
  }
  if (cur.length) pages.push(cur);

  const files = [];
  for (let p = 0; p < pages.length; p++) {
    const c = document.createElement("canvas"); c.width = S; c.height = H;
    const x = c.getContext("2d");
    drawScheduleHeader(x, day, dateObj, S);
    let yy = START;
    for (const l of pages[p]) { drawScheduleRow(x, l, yy, S); yy += rowHeight(x, l, S); }
    drawScheduleFooter(x, S, p + 1, pages.length);
    const blob = await new Promise((res) => c.toBlob(res, "image/png"));
    if (blob) files.push(new File([blob], `rawdah-${day}-${p + 1}.png`, { type: "image/png" }));
  }
  if (!files.length) return;
  if (navigator.canShare && navigator.canShare({ files })) {
    try { await navigator.share({ files }); return; } catch { return; }
  }
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  for (const f of files) {
    const url = URL.createObjectURL(f);
    if (isIOS) { window.open(url, "_blank"); }
    else { const a = document.createElement("a"); a.href = url; a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); }
    setTimeout(() => URL.revokeObjectURL(url), 8000);
  }
}

const chip = (active) =>
  `px-4 py-2 rounded-full text-sm font-medium transition-all border ${
    active ? "bg-pinebtn text-cream border-pine-800" : "bg-white text-slate-500 border-pearl-300 hover:border-sage-300"
  }`;

export default function Rawdah({ lang = "ar" }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [q, setQ] = useState("");
  const [day, setDay] = useState(todayName());
  const [gender, setGender] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await db.from("lessons").select("*").eq("is_published", true).order("time", { ascending: true });
        if (error) throw error;
        // Remove duplicate rows (same lesson entered 2–3 times) — keep first.
        const seen = new Set();
        const horizon = new Date();
        horizon.setDate(horizon.getDate() + 7); // show only the coming week
        const rows = (data || []).filter((l) => {
          if (l.is_paused) return false; // hide temporarily-paused recurring lessons
          // Hide dated lessons more than a week away — they appear a week before.
          if (!l.is_recurring && l.lesson_date && new Date(`${l.lesson_date}T00:00:00`) > horizon) return false;
          // Normalized key (title+teacher+day) collapses spelling/format variants.
          const key = `${normalizeText(l.title)}|${normalizeText(l.teacher)}|${l.day}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setLessons(rows);
        // Default to today; if today has no lessons, jump to the next upcoming day that does.
        const td = todayName();
        if (!rows.some((l) => l.day === td)) {
          const ti = DAYS.indexOf(td);
          const ordered = ti >= 0 ? [...DAYS.slice(ti), ...DAYS.slice(0, ti)] : DAYS;
          const firstDay = ordered.find((dn) => rows.some((l) => l.day === dn));
          if (firstDay) setDay(firstDay);
        }
      } catch {
        setErr(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const daysWithLessons = useMemo(() => {
    const ti = DAYS.indexOf(todayName());
    const ordered = ti >= 0 ? [...DAYS.slice(ti), ...DAYS.slice(0, ti)] : DAYS;
    return ordered.filter((dn) => lessons.some((l) => l.day === dn));
  }, [lessons]);
  const searching = q.trim().length > 0;
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = lessons;
    if (gender !== "all") out = out.filter((l) => genderOf(l) === gender);
    if (searching) {
      out = out.filter((l) => [l.title, l.teacher, l.area, l.location].filter(Boolean).some((f) => f.toLowerCase().includes(term)));
    } else {
      out = out.filter((l) => l.day === day);
    }
    // Sort by real time-of-day (handles ٤:٣٠ م / 10:00 ص / بعد المغرب…).
    return [...out].sort((a, b) => parseTime(a.time) - parseTime(b.time));
  }, [lessons, q, day, gender, searching]);

  return (
    <section className="py-14 md:py-20 bg-pearl-50 scroll-mt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHead icon={Sprout} kicker="مجالس ودروس الذكر" title="روضة"
          desc="دليل أسبوعي لمجالس ودروس الذكر — بحث وتصفية حسب اليوم والفئة." />

        <div className="mb-7 text-center rounded-2xl border border-pearl-200 bg-white px-6 py-5">
          <p className="font-quran text-lg md:text-2xl text-sage-600 leading-loose">
            «إذا مَرَرْتُم برياضِ الجنةِ فارْتَعُوا». قيل: وما رياضُ الجنة؟ قال: «حِلَقُ الذِّكْر».
          </p>
          <p className="text-xs text-slate-400 mt-2">رواه الترمذي</p>
        </div>

        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="ابحثي باسم الداعية أو العنوان أو المنطقة أو المسجد…"
          className="w-full px-5 py-3.5 rounded-xl border border-pearl-300 bg-white text-ink outline-none focus:border-sage-300 transition-colors mb-6"
        />

        {/* Primary filter: audience */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[["all", "الكل"], ["نساء", "دروس النساء"]].map(([val, label]) => (
            <button key={val} onClick={() => setGender(val)} className={chip(gender === val)}>{label}</button>
          ))}
        </div>

        {gender === "نساء" && (
          <div className="mb-5 rounded-xl border px-4 py-3 text-sm leading-relaxed bg-[#fbf1f3] dark:bg-white border-[#eddada] dark:border-pearl-200 text-[#7a5252] dark:text-ink">
            🔒 مجالس الذكر التي تقدّمها الداعيات <strong>للنساء فقط</strong> — لا يُسمح للرجال بالدخول، ولا يُسمح بتسجيل المحاضرات؛ حفظًا للأصوات والخصوصية.
          </div>
        )}

        {!searching && (
          <div className="flex flex-wrap gap-2 mb-8">
            {daysWithLessons.map((dn) => (
              <button key={dn} onClick={() => setDay(dn)} className={chip(day === dn)}>{dn}</button>
            ))}
          </div>
        )}

        {searching && (
          <p className="text-sm text-slate-500 mb-6">
            {results.length ? `وجدنا ${results.length} نتيجة لـ «${q}»` : `لا توجد نتائج لـ «${q}»`}
          </p>
        )}

        <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
          <Clock size={13} /> جميع الأوقات بتوقيت الكويت (GMT+3) · All times shown in Kuwait time
        </p>

        {loading ? (
          <p className="text-center text-slate-500 py-16">جارٍ التحميل…</p>
        ) : err ? (
          <p className="text-center text-slate-500 py-16">تعذّر تحميل الدروس الآن.</p>
        ) : results.length === 0 ? (
          <p className="text-center text-slate-500 py-16">لا توجد دروس مطابقة.</p>
        ) : (
          <>
            {!searching && (
              <div className="mb-4">
                <button type="button" onClick={() => shareScheduleImage(day, results)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-cream bg-sage-600 hover:bg-sage-700 transition-colors">
                  <Share2 size={15} /> مشاركة جدول {day} كصورة
                </button>
              </div>
            )}
            <div className="grid gap-5">
              {results.map((l) => <Card key={l.id} l={l} showDay={searching} lang={lang} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Card({ l, showDay, lang = "ar" }) {
  const en = lang === "en";
  const women = genderOf(l) === "نساء";
  const maps = l.location ? `https://maps.google.com/?q=${encodeURIComponent((l.location || "") + " " + (l.area || ""))}` : null;
  const wa = l.phone ? `https://wa.me/965${String(l.phone).replace(/\D/g, "")}` : null;
  // A dated, non-recurring lesson whose date has passed is "ended" (greyed out).
  // Ended = a dated, non-recurring lesson whose day has already passed (Kuwait date).
  const todayKw = new Date(Date.now() + 3 * 3600 * 1000).toISOString().split("T")[0];
  const ended = !!l.lesson_date && !l.is_recurring && l.lesson_date < todayKw;
  const tint = ended
    ? "bg-pearl-100 dark:bg-white opacity-70"
    : women ? "bg-[#fbf1f3] dark:bg-white" : "bg-[#eef4fa] dark:bg-white";
  const btn = "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors";
  const [showWarn, setShowWarn] = useState(false);
  return (
    <article className={`rounded-2xl p-5 border border-pearl-200 hover:shadow-pine transition-shadow ${tint}`}>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        {ended ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pearl-300 text-slate-500">انتهى</span>
        ) : (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-cream ${women ? "bg-[#b58d88]" : "bg-[#5a7a8a]"}`}>
            {women ? "للنساء" : "للجميع"}
          </span>
        )}
        {Array.isArray(l.types) && l.types.map((tp) => (
          <span key={tp} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            tp === "اونلاين" ? "bg-[#e6eef5] text-[#5a7a8a]" : "bg-sage-100 text-sage-700"
          }`}>{tp === "اونلاين" ? "🖥️ اونلاين" : tp === "حضوري" ? "🕌 حضوري" : tp}</span>
        ))}
      </div>
      <h3 className="text-lg font-bold text-ink leading-snug">{l.title}</h3>
      {l.teacher && <p className="text-sage-600 font-semibold mt-1">{l.teacher}</p>}
      <div className="flex items-center gap-2 mt-1.5 text-sm">
        <span className="font-bold text-pine-800">{l.day}</span>
        {l.lesson_date && <span className="text-slate-400">— {fmtDate(l.lesson_date)}</span>}
        {l.is_recurring && <span className="text-xs text-sage-600 font-medium">(أسبوعي)</span>}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-500 mt-2.5">
        {l.time && <span className="flex items-center gap-1"><Clock size={14} /> {l.time}</span>}
        {l.area && <span className="flex items-center gap-1"><MapPin size={14} /> {l.area}</span>}
        {l.location && <span className="flex items-center gap-1"><Building2 size={14} /> {l.location}</span>}
      </div>
      {!ended && (
        <div className="flex flex-wrap gap-2 mt-4">
          {maps && (
            <a className={`${btn} border border-sage-300 text-sage-600 bg-white hover:bg-sage-100`} href={maps} target="_blank" rel="noopener noreferrer">
              <MapPin size={15} /> الموقع
            </a>
          )}
          {/* Zoom is the primary way to join for everyone. Women see a conditions warning first. */}
          {l.zoom_link ? (
            women ? (
              <button type="button" onClick={() => setShowWarn(true)} className={`${btn} text-cream bg-sage-600 hover:bg-sage-700`}>
                <Video size={15} /> انضمي عبر زوم
              </button>
            ) : (
              <a className={`${btn} text-cream`} style={{ background: "#5a7a8a" }} href={l.zoom_link} target="_blank" rel="noopener noreferrer">
                <Video size={15} /> انضم عبر زوم
              </a>
            )
          ) : women && l.channel_link ? (
            <a className={`${btn} text-cream bg-sage-600 hover:bg-sage-700`} href={l.channel_link} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> انضمي للقناة
            </a>
          ) : (
            <a className={`${btn} text-cream`} style={{ background: "#5a7a8a" }} href={GROUP_LINK} target="_blank" rel="noopener noreferrer">
              <Video size={15} /> لرابط الزوم
            </a>
          )}
          {l.instagram && (
            <a className={`${btn} border border-pearl-300 text-slate-500 bg-white hover:bg-pearl-100`} href={`https://instagram.com/${l.instagram}`} target="_blank" rel="noopener noreferrer">
              <Instagram size={15} /> @{l.instagram}
            </a>
          )}
          {wa && (
            <a className={`${btn} border border-pearl-300 text-slate-500 bg-white hover:bg-pearl-100`} href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> واتساب
            </a>
          )}
          <button type="button" onClick={() => shareLessonImage(l)}
            className={`${btn} border border-sage-300 text-sage-600 bg-white hover:bg-sage-100`}>
            <Share2 size={15} /> مشاركة كصورة
          </button>
        </div>
      )}

      {showWarn && (
        <div className="fixed inset-0 z-50 bg-pine-900/70 flex items-center justify-center p-4" onClick={() => setShowWarn(false)} dir={en ? "ltr" : "rtl"}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-pine-lg" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-bold text-[#b58d88] mb-1">🌸 {en ? "Women-only lesson" : "درس للنساء فقط"}</h4>
            <p className="text-sm text-slate-500 mb-3">{en ? "Before joining, please observe the following:" : "قبل الدخول، الرجاء الالتزام بالشروط التالية:"}</p>
            <ul className={`text-sm text-ink space-y-2 leading-relaxed list-disc ${en ? "pl-5" : "pr-5"}`}>
              {en ? (
                <>
                  <li>Men are not permitted to enter.</li>
                  <li>Join with your real (clear) name for attendance verification.</li>
                  <li>Recording the lesson or extracting the audio is not allowed.</li>
                  <li>Do not post any links in the chat.</li>
                </>
              ) : (
                <>
                  <li>لا يحلّ للرجال الدخول.</li>
                  <li>الدخول بالاسم الصريح؛ للتحقّق من الحضور.</li>
                  <li>لا يُسمح بتسجيل الدرس أو إخراج الصوتيات.</li>
                  <li>عدم إدراج أي روابط في الدردشة.</li>
                </>
              )}
            </ul>
            <p className="text-xs text-slate-400 mt-3 font-quran">{en ? "“Believers are bound by their conditions.”" : "«المؤمنون على شروطهم»"}</p>
            <div className="flex gap-2 mt-5">
              <a href={l.zoom_link} target="_blank" rel="noopener noreferrer" onClick={() => setShowWarn(false)}
                className={`${btn} text-cream bg-sage-600 hover:bg-sage-700`}>
                <Video size={15} /> {en ? "I agree — enter" : "أوافق وأدخل"}
              </a>
              <button type="button" onClick={() => setShowWarn(false)}
                className={`${btn} border border-pearl-300 text-slate-500 bg-white hover:bg-pearl-100`}>
                {en ? "Cancel" : "إلغاء"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
