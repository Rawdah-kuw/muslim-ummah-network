"use client";

import Link from "next/link";
import { Instagram, ArrowLeft } from "lucide-react";
import SectionHead from "./SectionHead";
import ShareButton from "./ShareButton";
import { IG_PROFILES } from "@/lib/data";

export default function Feed({ t, lang, preview = false }) {
  // On the homepage teaser, show only the featured accounts; the rest live behind the button.
  const featured = IG_PROFILES.filter((p) => p.feat);
  const profiles = preview ? (featured.length ? featured : IG_PROFILES.slice(0, 3)) : IG_PROFILES;

  return (
    <section id="feed" className="py-16 md:py-24 bg-pearl-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead icon={Instagram} kicker={t.feedKicker} title={t.feedTitle} desc={t.feedDesc} />

        {!preview && (
          <div className="flex justify-center mb-8">
            <ShareButton t={t} path={`/${lang}/curated/instagram`} title={t.feedTitle}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {profiles.map((p) => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-pearl-200 p-4 md:p-6 flex items-center gap-4 hover:shadow-pine-lg transition-shadow">
              <span className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-xl font-bold shrink-0 border-2 border-sage-300 bg-sage-100 text-sage-600">
                {p.name[lang].replace("د. ", "").replace("الشيخ ", "").replace("Dr. ", "").charAt(0)}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base md:text-lg truncate text-ink">{p.name[lang]}</h3>
                <p className="text-xs text-slate-500 mb-1 truncate" dir="ltr">@{p.handle}</p>
                <p className="text-sm text-slate-500 truncate">{p.focus[lang]}</p>
              </div>
              <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium shrink-0 px-4 py-2 rounded-xl border border-sage-300 text-sage-600 group-hover:bg-sage-100 transition-colors">
                <Instagram size={15} /> {t.follow}
              </span>
              <Instagram size={18} className="sm:hidden text-sage-600 shrink-0" />
            </a>
          ))}
        </div>

        {preview && (
          <div className="mt-8 text-center">
            <Link href={`/${lang}/curated/instagram`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-cream bg-pinebtn hover:opacity-90 transition-opacity">
              {t.feedViewAll} <ArrowLeft size={16} className="rtl:rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
