"use client";

import { useState } from "react";
import { ADHKAR } from "@/lib/adhkar";
import AdhkarDownload from "./AdhkarDownload";

// One dhikr card. Tapping the card counts recitations (0 → count), like the app:
// it shows "done / count" while counting and "✓ count" when complete; tapping
// again after completing resets it. The count is shown in Western digits.
function DhikrCard({ d, i, total, lang, t }) {
  const ar = lang === "ar";
  const src = ar ? d.source : (d.sourceEn || d.source);
  const note = ar ? d.note : (d.noteEn || d.note);
  const countable = d.count > 1;
  const [done, setDone] = useState(0);
  const complete = countable && done >= d.count;

  const tap = () => {
    if (!countable) return;
    setDone((v) => {
      if (v >= d.count) return 0; // completed → tap resets to recount
      const nv = v + 1;
      if (nv === d.count && typeof navigator !== "undefined" && navigator.vibrate) {
        try { navigator.vibrate(30); } catch { /* ignore */ }
      }
      return nv;
    });
  };

  // Arabic-Indic only for the position label; the repeat counter stays Western.
  const pos = (n) => (ar ? String(n).replace(/\d/g, (x) => "٠١٢٣٤٥٦٧٨٩"[x]) : String(n));

  return (
    <div
      onClick={countable ? tap : undefined}
      className={`bg-white rounded-2xl border p-5 transition-colors ${
        complete ? "border-sage-500 bg-sage-100" : "border-pearl-200"
      } ${countable ? "cursor-pointer select-none active:bg-pearl-50" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400">
          {pos(i + 1)} <span className="text-pearl-300">/</span> {pos(total)}
        </span>
        {countable && (
          <span
            title={ar ? "اضغط للعدّ · عدد مرّات التكرار" : "Tap to count · repetitions"}
            className={`inline-flex items-center justify-center gap-0.5 min-w-14 h-12 px-3 rounded-full border-2 text-lg font-extrabold shadow-sm tabular-nums ${
              complete
                ? "bg-sage-600 border-sage-600 text-cream"
                : "bg-pearl-100 border-sage-500 text-sage-700"
            }`}
          >
            {done === 0 ? (
              <>
                {d.count}
                <span className="text-2xl leading-none">×</span>
              </>
            ) : complete ? (
              `✓ ${d.count}`
            ) : (
              `${done} / ${d.count}`
            )}
          </span>
        )}
      </div>

      {d.prefix && (
        <p className="font-quran text-center text-slate-500 mb-1 text-lg">{d.prefix}</p>
      )}
      <p dir="rtl" className="font-quran text-center text-pine-800 leading-loose text-2xl">
        {d.ar}
      </p>
      {!ar && d.en && (
        <p dir="ltr" className="text-center text-slate-600 italic mt-3 leading-relaxed">
          {d.en}
        </p>
      )}

      {(note || src) && (
        <div className="mt-3 text-center">
          {note && <p className="text-xs text-sage-700">{note}</p>}
          {src && <p className="text-xs text-slate-400">{src}</p>}
        </div>
      )}

      {/* Share must not trigger the card's tap-to-count. */}
      <div className="mt-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
        <AdhkarDownload d={d} lang={lang} t={t} />
      </div>
    </div>
  );
}

export default function Adhkar({ t, lang }) {
  const [tab, setTab] = useState("morning");
  const ar = lang === "ar";
  const items = ADHKAR[tab] || [];

  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <h1 className="text-2xl font-bold text-pine-800 mb-1 text-center">{t.adhkarTitle}</h1>
      <p className="text-sm text-slate-500 mb-2 text-center">{t.adhkarSubtitle}</p>
      <p className="text-xs text-sage-600 mb-6 text-center">
        {ar ? "👆 اضغط على الذكر لتعداد مرّات قراءتك" : "👆 Tap a dhikr to count your recitations"}
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {["morning", "evening"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === k ? "bg-sage-600 text-cream" : "bg-white border border-pearl-300 text-slate-500"
            }`}
          >
            {k === "morning" ? t.adhkarMorning : t.adhkarEvening}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {items.map((d, i) => (
          <DhikrCard key={`${tab}-${i}`} d={d} i={i} total={items.length} lang={lang} t={t} />
        ))}
      </div>
    </section>
  );
}
