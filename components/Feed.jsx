"use client";

import { useState } from "react";
import { Youtube, Instagram, Play, Radio, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import SectionHead from "./SectionHead";
import { YT_CHANNELS, IG_PROFILES } from "@/lib/data";

export default function Feed({ t, lang, rtl }) {
  const [tab, setTab] = useState("yt");
  const Arrow = rtl ? ArrowUpLeft : ArrowUpRight;

  return (
    <section id="feed" className="py-16 md:py-24 bg-pearl-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead icon={Radio} kicker={t.feedKicker} title={t.feedTitle} desc={t.feedDesc} />

        <div className="inline-flex p-1 rounded-xl bg-white border border-pearl-300 mb-10" role="tablist">
          {[
            { k: "yt", label: t.tabYT, Icon: Youtube },
            { k: "ig", label: t.tabIG, Icon: Instagram },
          ].map(({ k, label, Icon }) => (
            <button key={k} onClick={() => setTab(k)} role="tab" aria-selected={tab === k}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === k ? "bg-pine-800 text-white" : "text-slate-500 hover:text-slate-700"
              }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {tab === "yt" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {YT_CHANNELS.map((c) => (
              <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-pearl-200 overflow-hidden hover:shadow-pine-lg transition-shadow">
                <div className="h-36 relative flex items-center justify-center bg-gradient-to-br from-sage-100 to-pearl-200">
                  <span className="w-14 h-14 rounded-full bg-white shadow-pine flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Play size={22} className="text-sage-600" />
                  </span>
                  <span dir={c.official ? undefined : "ltr"}
                    className={`absolute top-3 left-3 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                      c.official ? "bg-sage-600 text-white" : "bg-white/90 text-slate-500"
                    }`}>
                    <Youtube size={13} className={c.official ? "" : "text-red-500"} />
                    {c.official ? t.officialBadge : c.subs}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg text-ink">{c.name[lang]}</h3>
                    <Arrow size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 mb-2" dir="ltr">{c.handle}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{c.topic[lang]}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {IG_PROFILES.map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-pearl-200 p-6 flex items-center gap-5 hover:shadow-pine-lg transition-shadow">
                <span className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 border-2 border-sage-300 bg-sage-100 text-sage-600">
                  {p.name[lang].replace("د. ", "").replace("الشيخ ", "").replace("Dr. ", "").charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate text-ink">{p.name[lang]}</h3>
                  <p className="text-xs text-slate-500 mb-1.5" dir="ltr">@{p.handle}</p>
                  <p className="text-sm text-slate-500 truncate">{p.focus[lang]}</p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium shrink-0 px-4 py-2 rounded-xl border border-sage-300 text-sage-600 group-hover:bg-sage-100 transition-colors">
                  <Instagram size={15} /> {t.follow}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
