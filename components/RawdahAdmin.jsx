"use client";

import { useState, useCallback } from "react";

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const DAY_COLORS = {
  "الأحد": "#b58d88", "الاثنين": "#7a9a8f", "الثلاثاء": "#9a8aa8", "الأربعاء": "#c9a961",
  "الخميس": "#6b8caf", "الجمعة": "#8a7355", "السبت": "#a85a72", "بدون يوم": "#999",
};
const TYPES = ["حضوري", "اونلاين", "مسجل"];
const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve({ data: String(r.result).split(",")[1], mediaType: file.type || "image/jpeg" });
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
function fmtDate(d) {
  if (!d) return "";
  try {
    const dt = new Date(d + "T00:00:00");
    return `${DAYS[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
  } catch { return d; }
}
function parseTime(t) {
  if (!t) return 9999;
  const n = t.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
  if (/بعد الفجر/.test(t)) return 330; if (/بعد العصر/.test(t)) return 960;
  if (/بعد المغرب/.test(t)) return 1110; if (/بعد العشاء/.test(t)) return 1200;
  const m = n.match(/(\d{1,2}):(\d{2})/); if (!m) return 9999;
  let h = +m[1]; const min = +m[2];
  const pm = /م|pm|مساء/i.test(n), am = /ص|am|صباح/i.test(n);
  if (pm && h < 12) h += 12; if (am && h === 12) h = 0;
  if (!pm && !am && h >= 1 && h <= 7) h += 12;
  return h * 60 + min;
}
function todayKuwait() {
  return new Date(Date.now() + 3 * 3600 * 1000).toISOString().split("T")[0];
}

const inp = "w-full px-3 py-2 rounded-lg border border-pearl-300 bg-white text-ink text-sm outline-none focus:border-sage-300";
const lbl = "block text-xs font-semibold text-slate-500 mb-1";
const btn = "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors";

function Fields({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const toggleType = (t) => {
    const has = (value.types || []).includes(t);
    set("types", has ? value.types.filter((x) => x !== t) : [...(value.types || []), t]);
  };
  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-3">
      <div className="sm:col-span-2"><label className={lbl}>العنوان</label><input className={inp} value={value.title || ""} onChange={(e) => set("title", e.target.value)} /></div>
      <div><label className={lbl}>الداعية</label><input className={inp} value={value.teacher || ""} onChange={(e) => set("teacher", e.target.value)} /></div>
      <div><label className={lbl}>الجنس</label>
        <select className={inp} value={value.gender || "نساء"} onChange={(e) => set("gender", e.target.value)}>
          <option value="نساء">نساء (للنساء فقط)</option>
          <option value="رجال">رجال (للجميع)</option>
        </select>
      </div>
      <div><label className={lbl}>اليوم</label>
        <select className={inp} value={value.day || "الأحد"} onChange={(e) => set("day", e.target.value)}>
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div><label className={lbl}>الوقت</label><input className={inp} value={value.time || ""} onChange={(e) => set("time", e.target.value)} /></div>
      <div><label className={lbl}>المنطقة</label><input className={inp} value={value.area || ""} onChange={(e) => set("area", e.target.value)} /></div>
      <div><label className={lbl}>المسجد</label><input className={inp} value={value.location || ""} onChange={(e) => set("location", e.target.value)} /></div>
      <div className="sm:col-span-2"><label className={lbl}>النوع</label>
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button key={t} type="button" onClick={() => toggleType(t)}
              className={`${btn} border ${(value.types || []).includes(t) ? "bg-sage-600 text-cream border-sage-600" : "bg-white text-slate-500 border-pearl-300"}`}>{t}</button>
          ))}
        </div>
      </div>
      <div><label className={lbl}>إنستغرام (بدون @)</label><input className={inp} value={value.instagram || ""} onChange={(e) => set("instagram", e.target.value)} /></div>
      <div><label className={lbl}>الهاتف (واتساب)</label><input className={inp} value={value.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
      <div><label className={lbl}>رابط القناة/القروب (للنساء)</label><input className={inp} value={value.channel_link || ""} onChange={(e) => set("channel_link", e.target.value)} /></div>
      <div><label className={lbl}>رابط زوم (للرجال)</label><input className={inp} value={value.zoom_link || ""} onChange={(e) => set("zoom_link", e.target.value)} /></div>
      <div><label className={lbl}>رمز الزوم</label><input className={inp} value={value.zoom_passcode || ""} onChange={(e) => set("zoom_passcode", e.target.value)} /></div>
      <div><label className={lbl}>التاريخ</label><input type="date" className={inp} value={value.lesson_date || ""} onChange={(e) => set("lesson_date", e.target.value)} /></div>
      <div className="sm:col-span-2 bg-pearl-100 rounded-lg p-3">
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input type="checkbox" checked={!!value.is_recurring} onChange={(e) => set("is_recurring", e.target.checked)} />
          🔁 درس أسبوعي متكرّر (يظهر كل أسبوع تلقائيًا)
        </label>
        {value.is_recurring && (
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer mt-2">
            <input type="checkbox" checked={!!value.is_paused} onChange={(e) => set("is_paused", e.target.checked)} />
            ⏸️ موقوف مؤقتًا (للإجازات)
          </label>
        )}
      </div>
    </div>
  );
}

export default function RawdahAdmin() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [openId, setOpenId] = useState(null); // which card is expanded for editing
  const [collapsed, setCollapsed] = useState({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const headers = { "x-admin-pass": pass, "Content-Type": "application/json" };

  const load = useCallback(async () => {
    const r = await fetch("/api/rawdah/lessons", { headers: { "x-admin-pass": pass } });
    if (r.status === 401) { setMsg("كلمة السر غير صحيحة"); setAuthed(false); return false; }
    const d = await r.json();
    if (d.error) { setMsg("خطأ: " + d.error); return false; }
    setLessons(d.lessons || []);
    if (d.cleaned) setMsg(`🧹 حُذف ${d.cleaned} درس منتهٍ تلقائيًا`);
    return true;
  }, [pass]);

  async function login() {
    setMsg("");
    if (await load()) setAuthed(true);
  }

  const isComplete = (l) => !!(l.title && l.teacher && l.time);

  async function onFiles(e) {
    const files = [...e.target.files];
    e.target.value = "";
    if (!files.length) return;
    setBusy(true); setMsg(`جارٍ تحليل ${files.length} ملصق…`);
    let inserted = 0, skipped = 0;
    const errors = [];
    for (const f of files) {
      try {
        const img = await fileToBase64(f);
        const r = await fetch("/api/rawdah/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: img, adminPassword: pass }) });
        const d = await r.json();
        if (d.error) { errors.push(d.error); continue; }
        if (d.data?.error) { errors.push(d.data.error); continue; }
        const arr = (d.data?.lessons || []).map((l) => ({ ...l, is_published: isComplete(l) }));
        if (!arr.length) { errors.push(`${f.name}: لم يُستخرج درس`); continue; }
        const res = await fetch("/api/rawdah/lessons", { method: "POST", headers, body: JSON.stringify({ lessons: arr }) }).then((x) => x.json());
        if (res.error) { errors.push(res.error); continue; }
        inserted += res.inserted || 0; skipped += res.skipped || 0;
      } catch (err) { errors.push(err.message); }
    }
    await load();
    setBusy(false);
    const parts = [];
    if (inserted) parts.push(`أُضيف ${inserted} ✓`);
    if (skipped) parts.push(`تُجوهل ${skipped} مكرّر`);
    if (errors.length) parts.push(`تنبيه: ${errors.join(" · ")}`);
    setMsg(parts.join(" — ") || "لم يُستخرج أي درس");
  }

  const setLocal = (id, patch) => setLessons((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  async function patch(id, fields) {
    const r = await fetch("/api/rawdah/lessons", { method: "PATCH", headers, body: JSON.stringify({ id, ...fields }) });
    const d = await r.json();
    if (d.error) { setMsg("خطأ: " + d.error); return false; }
    return true;
  }
  async function saveCard(l) {
    setBusy(true);
    const ok = await patch(l.id, l);
    setBusy(false);
    if (ok) { setMsg("✅ حُفظ"); setOpenId(null); }
  }
  async function publish(l, val) {
    if (val) await patch(l.id, l); // save edits before publishing
    if (await patch(l.id, { is_published: val })) { setLocal(l.id, { ...(val ? l : {}), is_published: val }); setMsg(val ? "✅ نُشر" : "أُخفي"); }
  }
  async function remove(id) {
    if (!confirm("حذف هذا الدرس نهائيًا؟")) return;
    const r = await fetch(`/api/rawdah/lessons?id=${id}`, { method: "DELETE", headers: { "x-admin-pass": pass } });
    const d = await r.json();
    if (d.error) { setMsg("خطأ: " + d.error); return; }
    setLessons((ls) => ls.filter((l) => l.id !== id));
  }
  async function addManual() {
    const blank = { title: "درس جديد", teacher: "", gender: "نساء", day: "الأحد", time: "", types: [], is_published: false, is_recurring: false };
    const res = await fetch("/api/rawdah/lessons", { method: "POST", headers, body: JSON.stringify({ lessons: [blank] }) }).then((x) => x.json());
    if (res.error) { setMsg("خطأ: " + res.error); return; }
    await load();
    if (res.lessons?.[0]) setOpenId(res.lessons[0].id);
  }

  if (!authed) {
    return (
      <section className="py-20 bg-pearl-50 min-h-screen">
        <div className="max-w-sm mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold text-pine-800 mb-6">لوحة إدارة روضة</h1>
          <input type="password" className={inp} placeholder="كلمة المرور" value={pass}
            onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
          <button className={`${btn} w-full mt-3 py-2.5 bg-pinebtn text-cream text-sm`} onClick={login}>دخول</button>
          {msg && <p className="text-sm text-red-500 mt-3">{msg}</p>}
        </div>
      </section>
    );
  }

  const today = todayKuwait();
  const published = lessons.filter((l) => l.is_published).length;
  const drafts = lessons.length - published;

  const byDay = {};
  [...DAYS, "بدون يوم"].forEach((d) => (byDay[d] = []));
  lessons.forEach((l) => { (byDay[l.day] ? byDay[l.day] : byDay["بدون يوم"]).push(l); });
  Object.values(byDay).forEach((arr) => arr.sort((a, b) => {
    if (!!a.is_published !== !!b.is_published) return a.is_published ? 1 : -1;
    const dA = a.lesson_date || "9999", dB = b.lesson_date || "9999";
    if (dA !== dB) return dA < dB ? -1 : 1;
    return parseTime(a.time) - parseTime(b.time);
  }));

  return (
    <section className="py-10 bg-pearl-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-5">
        <h1 className="text-2xl font-bold text-pine-800 mb-1">لوحة إدارة روضة</h1>
        <p className="text-xs text-slate-500 mb-4">الإجمالي {lessons.length} · منشور {published} · مسودّات {drafts}</p>
        {msg && <p className="text-sm text-sage-700 bg-sage-100 rounded-lg px-3 py-2 mb-4">{msg}</p>}

        <div className="bg-white rounded-2xl border border-pearl-200 p-4 mb-5 flex flex-wrap gap-2 items-center">
          <label className={`${btn} py-2 px-4 inline-block bg-pinebtn text-cream cursor-pointer text-sm`}>
            📤 رفع ملصقات
            <input type="file" accept="image/*" multiple hidden onChange={onFiles} disabled={busy} />
          </label>
          <button className={`${btn} py-2 border border-pearl-300 text-slate-600`} onClick={addManual}>+ إضافة يدويًا</button>
          <div className="grow" />
          <button className={`${btn} border border-pearl-300 text-slate-500`} onClick={() => setCollapsed(Object.fromEntries([...DAYS, "بدون يوم"].map((d) => [d, true])))}>⬆️ طيّ الكل</button>
          <button className={`${btn} border border-pearl-300 text-slate-500`} onClick={() => setCollapsed({})}>⬇️ فتح الكل</button>
        </div>

        {lessons.length === 0 && <p className="text-center text-slate-400 py-10">لا توجد دروس بعد — ابدئي برفع ملصق.</p>}

        {[...DAYS, "بدون يوم"].map((day) => {
          const items = byDay[day];
          if (!items.length) return null;
          const isCol = collapsed[day];
          const dc = items.filter((l) => !l.is_published).length;
          return (
            <div key={day} className="mb-4">
              <button onClick={() => setCollapsed((c) => ({ ...c, [day]: !c[day] }))}
                className="w-full flex items-center gap-2 bg-white rounded-xl border border-pearl-200 px-4 py-3 text-right"
                style={{ borderRightWidth: 5, borderRightColor: DAY_COLORS[day] }}>
                <span className="text-slate-400 text-xs">{isCol ? "▶" : "▼"}</span>
                <span className="font-bold text-pine-800">{day}</span>
                <span className="text-xs bg-pearl-100 text-slate-500 rounded-full px-2 py-0.5">{items.length} درس</span>
                {dc > 0 && <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">{dc} مسودة</span>}
              </button>

              {!isCol && (
                <div className="space-y-2 mt-2">
                  {items.map((l) => {
                    const past = l.lesson_date && l.lesson_date < today && !l.is_recurring;
                    const open = openId === l.id;
                    return (
                      <div key={l.id} className={`rounded-xl border p-4 ${past ? "bg-pearl-100 border-pearl-200 opacity-80" : "bg-white border-pearl-200"}`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <span className={`text-xs rounded-full px-2 py-0.5 ${l.is_published ? "bg-sage-100 text-sage-700" : "bg-amber-100 text-amber-700"}`}>{l.is_published ? "✅ منشور" : "📝 مسودة"}</span>
                            {l.is_recurring && <span className="text-xs rounded-full px-2 py-0.5 text-white" style={{ background: "#7a9a8f" }}>{l.is_paused ? "⏸️ متكرر (موقوف)" : "🔁 متكرر"}</span>}
                            {past && <span className="text-xs rounded-full px-2 py-0.5 text-white" style={{ background: "#a39e90" }}>⏳ انتهى</span>}
                            {l.lesson_date && <span className="text-xs rounded-full px-2 py-0.5 text-white" style={{ background: "#6b8caf" }}>📅 {fmtDate(l.lesson_date)}</span>}
                            {!l.lesson_date && !l.is_recurring && <span className="text-xs rounded-full px-2 py-0.5 text-white" style={{ background: "#c98a8a" }}>⚠️ بلا تاريخ</span>}
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            {l.is_published
                              ? <button className={`${btn} border border-pearl-300 text-slate-600`} onClick={() => publish(l, false)}>إلغاء النشر</button>
                              : <button className={`${btn} bg-sage-600 text-cream`} onClick={() => publish(l, true)}>✅ نشر</button>}
                            <button className={`${btn} border border-pearl-300 text-slate-600`} onClick={() => setOpenId(open ? null : l.id)}>{open ? "إغلاق" : "تعديل"}</button>
                            <button className={`${btn} text-red-500`} onClick={() => remove(l.id)}>🗑️</button>
                          </div>
                        </div>
                        <p className="font-bold text-ink mt-2 truncate">{l.title || "—"}</p>
                        <p className="text-xs text-slate-500 truncate">{l.teacher}{l.time ? ` · ${l.time}` : ""}{l.area ? ` · ${l.area}` : ""}{l.gender === "رجال" ? " · للجميع" : " · للنساء"}</p>

                        {open && (
                          <>
                            <Fields value={l} onChange={(v) => setLocal(l.id, v)} />
                            <div className="flex gap-2 mt-3">
                              <button className={`${btn} py-2 bg-pinebtn text-cream`} disabled={busy} onClick={() => saveCard(l)}>💾 حفظ التعديلات</button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
