"use client";

import { useState, useRef, useEffect } from "react";
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

  return (
    <div
      onClick={countable ? tap : undefined}
      className={`bg-white rounded-2xl border p-5 transition-colors ${
        complete ? "border-sage-500 bg-sage-100" : "border-pearl-200"
      } ${countable ? "cursor-pointer select-none active:bg-pearl-50" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400" dir="ltr">
          {i + 1} <span className="text-pearl-300">/</span> {total}
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
  const [cur, setCur] = useState(0);
  const ar = lang === "ar";
  const items = ADHKAR[tab] || [];
  const trackRef = useRef(null);

  // Scroll one dhikr into the centre (works in both RTL and LTR via scrollIntoView).
  const go = (idx, smooth = true) => {
    const root = trackRef.current;
    if (!root) return;
    const n = Math.max(0, Math.min(items.length - 1, idx));
    const el = root.querySelector(`[data-idx="${n}"]`);
    if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" });
  };

  // Track which card is centred as the user swipes.
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    const slides = root.querySelectorAll("[data-idx]");
    const io = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
        }
        if (best) {
          const idx = Number(best.target.dataset.idx);
          if (!Number.isNaN(idx)) setCur(idx);
        }
      },
      { root, threshold: [0.5, 0.7, 0.9] }
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [tab, items.length]);

  // When switching morning/evening, jump back to the first dhikr.
  const switchTab = (k) => {
    if (k === tab) return;
    setTab(k);
    setCur(0);
    requestAnimationFrame(() => go(0, false));
  };

  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <h1 className="text-2xl font-bold text-pine-800 mb-1 text-center">{t.adhkarTitle}</h1>
      <p className="text-sm text-slate-500 mb-2 text-center">{t.adhkarSubtitle}</p>
      <p className="text-xs text-sage-600 mb-6 text-center">
        {ar
          ? "👆 اضغط على الذكر للعدّ · اسحب للجنب للتنقّل بين الأذكار"
          : "👆 Tap a dhikr to count · swipe sideways to move between them"}
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {["morning", "evening"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => switchTab(k)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === k ? "bg-sage-600 text-cream" : "bg-white border border-pearl-300 text-slate-500"
            }`}
          >
            {k === "morning" ? t.adhkarMorning : t.adhkarEvening}
          </button>
        ))}
      </div>

      {/* Horizontal swipeable track — one dhikr per view, snap to centre. */}
      <div
        ref={trackRef}
        dir={ar ? "rtl" : "ltr"}
        className="adhkar-track flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((d, i) => (
          <div
            key={`${tab}-${i}`}
            data-idx={i}
            className="snap-center shrink-0 w-[90%] sm:w-[85%] max-w-xl mx-auto flex"
          >
            <div className="w-full">
              <DhikrCard d={d} i={i} total={items.length} lang={lang} t={t} />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation: arrows + position. Chevrons follow reading direction. */}
      <div className="flex items-center justify-center gap-5 mt-5">
        <button
          type="button"
          onClick={() => go(cur - 1)}
          disabled={cur === 0}
          aria-label={ar ? "السابق" : "Previous"}
          className="w-11 h-11 rounded-full border border-pearl-300 bg-white text-xl text-sage-700 flex items-center justify-center shadow-sm disabled:opacity-30 active:bg-pearl-50"
        >
          {ar ? "›" : "‹"}
        </button>
        <span className="text-sm font-semibold text-slate-500 tabular-nums min-w-16 text-center" dir="ltr">
          {cur + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={() => go(cur + 1)}
          disabled={cur === items.length - 1}
          aria-label={ar ? "التالي" : "Next"}
          className="w-11 h-11 rounded-full border border-pearl-300 bg-white text-xl text-sage-700 flex items-center justify-center shadow-sm disabled:opacity-30 active:bg-pearl-50"
        >
          {ar ? "‹" : "›"}
        </button>
      </div>

      {/* Dots */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-4" dir="ltr">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`${ar ? "ذكر" : "dhikr"} ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === cur ? "w-6 bg-sage-600" : "w-2 bg-pearl-300 hover:bg-pearl-400"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        .adhkar-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
