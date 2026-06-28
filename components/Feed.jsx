"use client";

import { Instagram } from "lucide-react";
import SectionHead from "./SectionHead";
import ShareButton from "./ShareButton";
import { IG_PROFILES } from "@/lib/data";

export default function Feed({ t, lang }) {
  return (
    <section id="feed" className="py-16 md:py-24 bg-pearl-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead icon={Instagram} kicker={t.feedKicker} title={t.feedTitle} desc={t.feedDesc} />

        <div className="flex justify-center mb-8">
          <ShareButton t={t} path={`/${lang}/curated/instagram`} title={t.feedTitle}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors" />
        </div>

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
      </div>
    </section>
  );
}
