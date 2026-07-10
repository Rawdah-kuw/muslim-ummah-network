"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Sprout, MapPin, Video, MessageCircle, Instagram, Clock, Building2 } from "lucide-react";
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

const chip = (active) =>
  `px-4 py-2 rounded-full text-sm font-medium transition-all border ${
    active ? "bg-pinebtn text-cream border-pine-800" : "bg-white text-slate-500 border-pearl-300 hover:border-sage-300"
  }`;

export default function Rawdah({ t }) {
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
        const rows = (data || []).filter((l) => {
          if (l.is_paused) return false; // hide temporarily-paused recurring lessons
          const key = `${l.title}|${l.teacher}|${l.day}|${l.time}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setLessons(rows);
        // If today has no lessons, jump to the first day that does — so it never looks empty.
        const td = todayName();
        if (!rows.some((l) => l.day === td)) {
          const firstDay = DAYS.find((dn) => rows.some((l) => l.day === dn));
          if (firstDay) setDay(firstDay);
        }
      } catch {
        setErr(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const daysWithLessons = useMemo(() => DAYS.filter((dn) => lessons.some((l) => l.day === dn)), [lessons]);
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
    return out;
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

        {loading ? (
          <p className="text-center text-slate-500 py-16">جارٍ التحميل…</p>
        ) : err ? (
          <p className="text-center text-slate-500 py-16">تعذّر تحميل الدروس الآن.</p>
        ) : results.length === 0 ? (
          <p className="text-center text-slate-500 py-16">لا توجد دروس مطابقة.</p>
        ) : (
          <div className="grid gap-5">
            {results.map((l) => <Card key={l.id} l={l} showDay={searching} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ l, showDay }) {
  const women = genderOf(l) === "نساء";
  const maps = l.location ? `https://maps.google.com/?q=${encodeURIComponent((l.location || "") + " " + (l.area || ""))}` : null;
  const wa = l.phone ? `https://wa.me/965${String(l.phone).replace(/\D/g, "")}` : null;
  // A dated, non-recurring lesson whose date has passed is "ended" (greyed out).
  const ended = !!l.lesson_date && !l.is_recurring && new Date(`${l.lesson_date}T23:59:59`) < new Date();
  const tint = ended
    ? "bg-pearl-100 dark:bg-white opacity-70"
    : women ? "bg-[#fbf1f3] dark:bg-white" : "bg-[#eef4fa] dark:bg-white";
  const btn = "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors";
  return (
    <article className={`rounded-2xl p-5 border border-pearl-200 hover:shadow-pine transition-shadow ${tint}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-ink leading-snug">{l.title}</h3>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
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
      </div>
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
          {/* Join — dedicated link if present, otherwise the main WhatsApp group ("where's the lesson?"). */}
          {women && l.channel_link ? (
            <a className={`${btn} text-cream bg-sage-600 hover:bg-sage-700`} href={l.channel_link} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> انضمي للقناة
            </a>
          ) : !women && l.zoom_link ? (
            <a className={`${btn} text-cream`} style={{ background: "#5a7a8a" }} href={l.zoom_link} target="_blank" rel="noopener noreferrer">
              <Video size={15} /> انضم عبر زوم
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
        </div>
      )}
    </article>
  );
}
