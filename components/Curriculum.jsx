"use client";

import { useState } from "react";
import { GraduationCap, PlayCircle, ArrowUpLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import SectionHead from "./SectionHead";
import { PLAYLISTS, PL_CATS, PL_LEVELS, PL_CHANNELS } from "@/lib/curriculum";

export default function Curriculum({ t, lang, rtl }) {
  const [cat, setCat] = useState("all");
  const Arrow = rtl ? ArrowUpLeft : ArrowUpRight;

  const list = cat === "all" ? PLAYLISTS : PLAYLISTS.filter((p) => p.sci === cat);
  // group by level (1,2,3) and keep only levels that have items
  const levels = [1, 2, 3]
    .map((lvl) => ({ lvl, items: list.filter((p) => p.level === lvl) }))
    .filter((g) => g.items.length);

  return (
    <section id="curriculum" className="py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead icon={GraduationCap} kicker={t.pathKicker} title={t.pathTitle} desc={t.pathDesc} />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium bg-sage-100 text-sage-600">
          <ShieldCheck size={16} /> {t.pathTrust}
        </div>

        {/* Science filters */}
        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label={t.pathTitle}>
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

        {/* Grouped by level */}
        <div className="space-y-12">
          {levels.map(({ lvl, items }) => (
            <div key={lvl}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-pine-800 text-white">
                  {PL_LEVELS[lvl][lang]}
                </span>
                <span className="h-px flex-1 bg-pearl-200" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((p) => (
                  <div key={p.id}
                    className="bg-pearl-50 rounded-2xl p-5 border border-pearl-200 hover:shadow-pine transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-sage-100 shrink-0">
                        <PlayCircle size={19} className="text-sage-600" />
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-white border border-pearl-300 text-slate-500">
                        {PL_CATS.find((c) => c.key === p.sci)?.[lang]}
                      </span>
                    </div>
                    <h3 className="font-bold text-ink leading-snug mb-4 flex-1">{p.title[lang]}</h3>
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
