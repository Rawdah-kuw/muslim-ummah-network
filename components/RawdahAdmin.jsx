"use client";

import { useState } from "react";

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const TYPES = ["حضوري", "اونلاين", "مسجل"];
const EMPTY = {
  title: "", teacher: "", gender: "نساء", day: "الأحد", time: "", area: "", location: "",
  types: [], instagram: "", phone: "", channel_link: "", zoom_link: "", zoom_passcode: "",
  lesson_date: "", is_recurring: false,
};

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
  const p = String(d).split("-");
  return p.length === 3 ? `${+p[2]}/${+p[1]}/${p[0]}` : d;
}

const inp = "w-full px-3 py-2 rounded-lg border border-pearl-300 bg-white text-ink text-sm outline-none focus:border-sage-300";
const lbl = "block text-xs font-semibold text-slate-500 mb-1";
const btn = "px-4 py-2 rounded-lg text-sm font-medium transition-colors";

function LessonForm({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const toggleType = (t) => {
    const has = (value.types || []).includes(t);
    set("types", has ? value.types.filter((x) => x !== t) : [...(value.types || []), t]);
  };
  return (
    <div className="grid sm:grid-cols-2 gap-3">
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
      <div><label className={lbl}>التاريخ (لمرة واحدة)</label><input type="date" className={inp} value={value.lesson_date || ""} onChange={(e) => set("lesson_date", e.target.value)} /></div>
      <div className="sm:col-span-2">
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={!!value.is_recurring} onChange={(e) => set("is_recurring", e.target.checked)} />
          درس متكرّر أسبوعيًا (بلا تاريخ)
        </label>
      </div>
    </div>
  );
}

export default function RawdahAdmin() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [existing, setExisting] = useState([]);
  const [editing, setEditing] = useState(null); // lesson being edited (existing)
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const headers = { "x-admin-pass": pass };

  async function loadExisting() {
    const r = await fetch("/api/rawdah/lessons", { headers });
    if (r.status === 401) { setMsg("كلمة السر غير صحيحة"); setAuthed(false); return false; }
    const d = await r.json();
    setExisting(d.lessons || []);
    return true;
  }
  async function login() {
    setMsg("");
    if (await loadExisting()) { setAuthed(true); setMsg(""); }
  }

  async function postLesson(lesson) {
    const r = await fetch("/api/rawdah/lessons", { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ lessons: [lesson] }) });
    return r.json();
  }
  const isComplete = (l) => !!(l.title && l.teacher && l.time);

  async function onFiles(e) {
    const files = [...e.target.files];
    e.target.value = "";
    setBusy(true); setMsg("جارٍ تحليل الملصقات…");
    let published = 0, review = 0;
    const errors = [];
    for (const f of files) {
      try {
        const img = await fileToBase64(f);
        const r = await fetch("/api/rawdah/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: img, adminPassword: pass }) });
        const d = await r.json();
        if (d.error) { errors.push(d.error); continue; }
        if (d.data?.error) { errors.push(d.data.error); continue; }
        const lessons = (d.data?.lessons || []).map((l) => ({ ...EMPTY, ...l }));
        if (!lessons.length) { errors.push("لم يُستخرج أي درس من هذه الصورة"); continue; }
        for (const l of lessons) {
          if (isComplete(l)) {
            const res = await postLesson({ ...l, is_published: true });
            if (res.error) { errors.push(res.error); setDrafts((p) => [...p, l]); review++; }
            else published++;
          } else {
            setDrafts((p) => [...p, l]); review++;
          }
        }
      } catch (err) { errors.push(err.message); }
    }
    setBusy(false);
    await loadExisting();
    const parts = [];
    if (published) parts.push(`نُشِر ${published} تلقائيًا ✓`);
    if (review) parts.push(`${review} بحاجة لمراجعة أدناه`);
    if (errors.length) parts.push(`تنبيه: ${errors.join(" · ")}`);
    setMsg(parts.join(" — ") || "لم يُستخرج أي درس");
  }

  async function publishDraft(i) {
    setBusy(true);
    const lesson = { ...drafts[i], is_published: true };
    const r = await fetch("/api/rawdah/lessons", { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ lessons: [lesson] }) });
    const d = await r.json();
    setBusy(false);
    if (d.error) { setMsg("خطأ بالحفظ: " + d.error); return; }
    setDrafts((prev) => prev.filter((_, x) => x !== i));
    loadExisting();
    setMsg("نُشِر الدرس ✓");
  }

  async function saveEdit() {
    setBusy(true);
    const r = await fetch("/api/rawdah/lessons", { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    const d = await r.json();
    setBusy(false);
    if (d.error) { setMsg("خطأ: " + d.error); return; }
    setEditing(null); loadExisting(); setMsg("حُفِظ التعديل ✓");
  }
  async function togglePublish(l) {
    await fetch("/api/rawdah/lessons", { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ id: l.id, is_published: !l.is_published }) });
    loadExisting();
  }
  async function remove(id) {
    if (!confirm("حذف هذا الدرس نهائيًا؟")) return;
    await fetch(`/api/rawdah/lessons?id=${id}`, { method: "DELETE", headers });
    loadExisting();
  }

  if (!authed) {
    return (
      <section className="py-20 bg-pearl-50 min-h-screen">
        <div className="max-w-sm mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold text-pine-800 mb-6">لوحة إدارة روضة</h1>
          <input type="password" className={inp} placeholder="كلمة المرور" value={pass}
            onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
          <button className={`${btn} w-full mt-3 bg-pinebtn text-cream`} onClick={login}>دخول</button>
          {msg && <p className="text-sm text-red-500 mt-3">{msg}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-pearl-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-pine-800 mb-1">لوحة إدارة روضة</h1>
        {msg && <p className="text-sm text-sage-600 mb-4">{msg}</p>}

        {/* Upload */}
        <div className="bg-white rounded-2xl border border-pearl-200 p-5 mb-6">
          <label className={`${btn} inline-block bg-pinebtn text-cream cursor-pointer`}>
            + رفع ملصقات (تحليل تلقائي)
            <input type="file" accept="image/*" multiple hidden onChange={onFiles} disabled={busy} />
          </label>
          <button className={`${btn} ms-2 border border-pearl-300 text-slate-600`} onClick={() => setDrafts((p) => [...p, { ...EMPTY }])}>+ إضافة يدويًا</button>
        </div>

        {/* Drafts to review */}
        {drafts.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold text-pine-800 mb-3">مسودّات للمراجعة ({drafts.length})</h2>
            <div className="space-y-4">
              {drafts.map((d, i) => (
                <div key={i} className="bg-white rounded-2xl border border-sage-300 p-5">
                  <LessonForm value={d} onChange={(v) => setDrafts((prev) => prev.map((x, j) => (j === i ? v : x)))} />
                  <div className="flex gap-2 mt-4">
                    <button className={`${btn} bg-sage-600 text-cream`} disabled={busy} onClick={() => publishDraft(i)}>نشر</button>
                    <button className={`${btn} border border-pearl-300 text-slate-500`} onClick={() => setDrafts((prev) => prev.filter((_, x) => x !== i))}>حذف من القائمة</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing lessons — grouped by day */}
        <h2 className="font-bold text-pine-800 mb-3">الدروس ({existing.length})</h2>
        {[...DAYS, "غير محدد"].map((day) => {
          const items = existing
            .filter((l) => (l.day || "غير محدد") === day)
            .sort((a, b) => (a.lesson_date || "").localeCompare(b.lesson_date || "") || (a.time || "").localeCompare(b.time || ""));
          if (!items.length) return null;
          return (
            <div key={day} className="mb-5">
              <h3 className="text-sm font-bold text-pine-700 mb-2 border-b border-pearl-200 pb-1">
                {day} <span className="text-xs text-slate-400">({items.length})</span>
              </h3>
              <div className="space-y-2">
                {items.map((l) => (
                  <div key={l.id} className="bg-white rounded-xl border border-pearl-200 p-4">
                    {editing && editing.id === l.id ? (
                      <>
                        <LessonForm value={editing} onChange={setEditing} />
                        <div className="flex gap-2 mt-4">
                          <button className={`${btn} bg-sage-600 text-cream`} disabled={busy} onClick={saveEdit}>حفظ</button>
                          <button className={`${btn} border border-pearl-300 text-slate-500`} onClick={() => setEditing(null)}>إلغاء</button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <p className="font-bold text-ink truncate">{l.title || "—"} <span className="text-xs text-slate-400">· {l.gender || "نساء"}</span></p>
                          <p className="text-xs text-slate-500 truncate">
                            {l.teacher}
                            {l.time ? ` · ${l.time}` : ""}
                            {l.lesson_date ? ` · ${fmtDate(l.lesson_date)}` : (l.is_recurring ? " · أسبوعي" : "")}
                            {l.area ? ` · ${l.area}` : ""}
                          </p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button className={`${btn} text-xs ${l.is_published ? "bg-sage-100 text-sage-700" : "bg-pearl-200 text-slate-500"}`} onClick={() => togglePublish(l)}>
                            {l.is_published ? "منشور" : "مخفي"}
                          </button>
                          <button className={`${btn} text-xs border border-pearl-300 text-slate-600`} onClick={() => setEditing({ ...EMPTY, ...l })}>تعديل</button>
                          <button className={`${btn} text-xs text-red-500`} onClick={() => remove(l.id)}>حذف</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
