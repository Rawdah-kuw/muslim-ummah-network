"use client";

import { useState } from "react";
import { ADHKAR } from "@/lib/adhkar";
import AdhkarDownload from "./AdhkarDownload";

export default function Adhkar({ t, lang }) {
  const [tab, setTab] = useState("morning");
  const ar = lang === "ar";
  const items = ADHKAR[tab] || [];

  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <h1 className="text-2xl font-bold text-pine-800 mb-1 text-center">{t.adhkarTitle}</h1>
      <p className="text-sm text-slate-500 mb-6 text-center">{t.adhkarSubtitle}</p>

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
        {items.map((d, i) => {
          const src = ar ? d.source : (d.sourceEn || d.source);
          const note = ar ? d.note : (d.noteEn || d.note);
          return (
            <div key={i} className="bg-white rounded-2xl border border-pearl-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sage-700 bg-sage-100 rounded-full px-3 py-1">
                  {i + 1} / {items.length}
                </span>
                {d.count > 1 && <span className="text-xs font-bold text-sage-700">× {d.count}</span>}
              </div>

              {d.prefix && (
                <p className="text-center text-slate-500 mb-1" style={{ fontFamily: "Amiri, serif" }}>
                  {d.prefix}
                </p>
              )}
              <p dir="rtl" className="text-center text-pine-800 leading-loose text-xl" style={{ fontFamily: "Amiri, serif" }}>
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

              <div className="mt-4 flex justify-center">
                <AdhkarDownload d={d} lang={lang} t={t} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
