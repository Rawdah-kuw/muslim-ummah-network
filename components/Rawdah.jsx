"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Public (publishable) Supabase credentials — safe to expose; RLS allows reading published lessons only.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://buvsgjiqtaftyexjvyzw.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_kRtGr0a2Tun1CQweltlxjw_qfQRQGTr";
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DAY_COLOR = {
  "الأحد": "#b58d88", "الاثنين": "#7a9a8f", "الثلاثاء": "#9a8aa8", "الأربعاء": "#c9a961",
  "الخميس": "#6b8caf", "الجمعة": "#8a7355", "السبت": "#a85a72",
};

// Existing Rawdah data is women's lessons — default to "نساء" when unset.
const genderOf = (l) => (l.gender === "رجال" ? "رجال" : "نساء");

function todayName() {
  return DAYS[new Date().getDay()];
}

export default function Rawdah() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [q, setQ] = useState("");
  const [day, setDay] = useState(todayName());
  const [gender, setGender] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await db
          .from("lessons")
          .select("*")
          .eq("is_published", true)
          .order("time", { ascending: true });
        if (error) throw error;
        setLessons(data || []);
      } catch {
        setErr(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const daysWithLessons = useMemo(
    () => DAYS.filter((dn) => lessons.some((l) => l.day === dn)),
    [lessons]
  );

  const searching = q.trim().length > 0;
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = lessons;
    if (gender !== "all") out = out.filter((l) => genderOf(l) === gender);
    if (searching) {
      out = out.filter((l) =>
        [l.title, l.teacher, l.area, l.location].filter(Boolean).some((f) => f.toLowerCase().includes(term))
      );
    } else {
      out = out.filter((l) => l.day === day);
    }
    return out;
  }, [lessons, q, day, gender, searching]);

  return (
    <div style={{ background: "#f0ebe0", minHeight: "100vh" }} dir="rtl">
      <style>{`
        .rw-wrap{max-width:920px;margin:0 auto;padding:28px 18px 60px;font-family:var(--font-ui)}
        .rw-title{font-family:var(--font-read);font-size:clamp(34px,6vw,48px);font-weight:700;color:#3d5a52;text-align:center}
        .rw-sub{text-align:center;color:#6b7570;font-size:15px;margin-top:4px}
        .rw-search{width:100%;padding:14px 18px;border-radius:14px;border:1px solid #d8d0c0;background:#fff;font-size:16px;color:#2d3835;outline:none;font-family:var(--font-ui)}
        .rw-chip{padding:8px 16px;border-radius:999px;border:1px solid #d8d0c0;background:#fff;color:#6b7570;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap}
        .rw-card{background:#fff;border:1px solid #e2dccf;border-radius:18px;padding:20px;box-shadow:0 2px 10px rgba(90,122,111,.06)}
        .rw-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;font-size:14px;font-weight:600;text-decoration:none;border:1px solid #d8d0c0;color:#3d5a52;background:#f7f4ee}
        .rw-btn.primary{background:#5a7a6f;color:#fff;border-color:#5a7a6f}
        .rw-btn.zoom{background:#6b8caf;color:#fff;border-color:#6b8caf}
        .rw-btn.channel{background:#3d7a5a;color:#fff;border-color:#3d7a5a}
      `}</style>
      <div className="rw-wrap">
        <div style={{ letterSpacing: 10, color: "#b58d88", textAlign: "center", fontSize: 18, marginBottom: 8 }}>◈ ◈ ◈</div>
        <h1 className="rw-title">رَوضَة</h1>
        <p className="rw-sub">دليل مجالس ودروس الذكر — أسبوعك في مكان واحد</p>

        <div style={{ margin: "22px 0 14px" }}>
          <input className="rw-search" placeholder="ابحثي باسم الداعية أو العنوان أو المنطقة أو المسجد…"
            value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {/* Primary filter: audience (women / men-for-all) */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {[["all", "الكل"], ["نساء", "دروس النساء"], ["رجال", "دروس للجميع"]].map(([val, label]) => (
            <button key={val} className="rw-chip" onClick={() => setGender(val)}
              style={gender === val ? { background: "#3d5a52", color: "#fff", borderColor: "#3d5a52" } : {}}>{label}</button>
          ))}
        </div>

        {!searching && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 8 }}>
            {daysWithLessons.map((dn) => (
              <button key={dn} className="rw-chip" onClick={() => setDay(dn)}
                style={day === dn ? { background: DAY_COLOR[dn], color: "#fff", borderColor: DAY_COLOR[dn] } : {}}>
                {dn}
              </button>
            ))}
          </div>
        )}

        {searching && (
          <p style={{ color: "#6b7570", fontSize: 14, marginBottom: 12 }}>
            {results.length ? `وجدنا ${results.length} نتيجة لـ «${q}»` : `لا توجد نتائج لـ «${q}»`}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: "center", color: "#6b7570", padding: 40 }}>جارٍ التحميل…</p>
        ) : err ? (
          <p style={{ textAlign: "center", color: "#a85a72", padding: 40 }}>تعذّر تحميل الدروس الآن.</p>
        ) : results.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7570", padding: 40 }}>لا توجد دروس مطابقة.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {results.map((l) => <Card key={l.id} l={l} showDay={searching} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ l, showDay }) {
  const women = genderOf(l) === "نساء";
  const maps = l.location ? `https://maps.google.com/?q=${encodeURIComponent((l.location || "") + " " + (l.area || ""))}` : null;
  const wa = l.phone ? `https://wa.me/965${String(l.phone).replace(/\D/g, "")}` : null;
  return (
    <div className="rw-card"
      style={{ background: women ? "#fbf0ef" : "#eef4f9", borderColor: women ? "#f0ddd9" : "#dbe6f1" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <h3 style={{ fontSize: 19, fontWeight: 700, color: "#2d3835", lineHeight: 1.4 }}>{l.title}</h3>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <span style={{ background: women ? "#b58d88" : "#5a7a8a", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
            {women ? "للنساء" : "للجميع"}
          </span>
          {showDay && l.day && (
            <span style={{ background: DAY_COLOR[l.day] || "#7a7a7a", color: "#fff", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{l.day}</span>
          )}
        </div>
      </div>
      {l.teacher && <p style={{ color: "#5a7a6f", fontWeight: 600, marginTop: 4 }}>{l.teacher}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, color: "#6b7570", fontSize: 14, marginTop: 10 }}>
        {l.time && <span>🕐 {l.time}</span>}
        {l.area && <span>📍 {l.area}</span>}
        {l.location && <span>🕌 {l.location}</span>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        {maps && <a className="rw-btn primary" href={maps} target="_blank" rel="noopener noreferrer">🗺️ الموقع</a>}
        {women ? (
          // Women's lessons: no Zoom (protect voices) — join a WhatsApp/Telegram channel instead.
          l.channel_link
            ? <a className="rw-btn channel" href={l.channel_link} target="_blank" rel="noopener noreferrer">💬 انضمي للقناة</a>
            : (wa && <a className="rw-btn channel" href={wa} target="_blank" rel="noopener noreferrer">💬 قناة الواتساب</a>)
        ) : (
          // Men's lessons (for everyone): Zoom allowed.
          l.zoom_link && <a className="rw-btn zoom" href={l.zoom_link} target="_blank" rel="noopener noreferrer">🎥 انضم عبر زوم</a>
        )}
        {l.instagram && <a className="rw-btn" href={`https://instagram.com/${l.instagram}`} target="_blank" rel="noopener noreferrer">📷 @{l.instagram}</a>}
        {!women && wa && <a className="rw-btn" href={wa} target="_blank" rel="noopener noreferrer">💬 {l.phone}</a>}
      </div>
    </div>
  );
}
