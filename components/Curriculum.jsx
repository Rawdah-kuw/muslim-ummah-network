"use client";

import { useState } from "react";
import { GraduationCap, PlayCircle, ArrowUpLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import SectionHead from "./SectionHead";
import { PLAYLISTS, PL_CATS, PL_LEVELS, PL_CHANNELS } from "@/lib/curriculum";

const LEVEL_STYLE = {
  1: "bg-sage-100 text-sage-700",
  2: "bg-pearl-200 text-pine-800",
  3: "bg-pine-800 text-white",
};

export default function Curriculum({ t, lang, rtl }) {
  const [cat, setCat] = useState("all");
  const Arrow = rtl ? ArrowUpLeft : ArrowUpRight;

  // Sciences to show (in curriculum order), each with its playlists sorted beginner → advanced
  const sciences = PL_CATS.filter((c) => c.key !== "all")
    .filter((c) => cat === "all" || c.key === cat)
    .map((c) => ({
      cat: c,
      items: PLAYLISTS.filter((p) => p.sci === c.key).sort((a, b) => a.level - b.level),
    }))
    .filter((g) => g.items.length);

  return (
    <section id="curriculum" className="py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead icon={GraduationCap} kicker={t.pathKicker} title={t.pathTitle} desc={t.pathDesc} />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium bg-sage-100 text-sage-600">
          <ShieldCheck size={16} /> {t.pathTrust}
        </div>

        {/* Science filters */}
        <div className="flex flex-wrap gap-2 mb-12" role="tablist" aria-label={t.pathTitle}>
          {PL_CATS.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} role="tab" aria-selected={cat === c.key}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                cat === c.key
                  ? "bg-pine-800 text-white border-pine-800"
                  : "bg-white text-slate-500 border-pearl-300 hover:border-sage-300"
              }`}>
              {c[lang]}
            </button>
          ))}
        </div>

        {/* Grouped by science → ordered beginner to advanced inside each */}
        <div className="space-y-14">
          {sciences.map(({ cat: c, items }) => (
            <div key={c.key}>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-pine-800">{c[lang]}</h3>
                <span className="h-px flex-1 bg-pearl-200" />
                <span className="text-xs text-slate-400">{items.length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((p) => (
                  <div key={p.id}
                    className="bg-pearl-50 rounded-2xl p-5 border border-pearl-200 hover:shadow-pine transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage-100 shrink-0">
                        <PlayCircle size={19} className="text-sage-600" />
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${LEVEL_STYLE[p.level]}`}>
                        {PL_LEVELS[p.level][lang]}
                      </span>
                    </div>
                    <h4 className="font-bold text-ink leading-snug mb-4 flex-1">{p.title[lang]}</h4>
                    <div className="flex flex-col gap-2">
                      {p.sources.map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors">
                          <span className="flex items-center gap-2 min-w-0">
                            <PlayCircle size={15} className="shrink-0" />
                            <span className="truncate" dir="ltr">{PL_CHANNELS[s.ch][lang]}</span>
                          </span>
                          <Arrow size={15} className="shrink-0 opacity-60" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
