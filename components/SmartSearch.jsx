"use client";

import { useEffect } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { APPROVED_SITES, PSE_CX } from "@/lib/data";

export default function SmartSearch({ t, lang }) {
  // Load the Programmable Search Engine widget once (free, no API key).
  useEffect(() => {
    if (document.getElementById("pse-script")) return;
    const s = document.createElement("script");
    s.id = "pse-script";
    s.async = true;
    s.src = `https://cse.google.com/cse.js?cx=${PSE_CX}`;
    document.head.appendChild(s);
  }, []);

  return (
    <section id="search" className="py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium bg-sage-100 text-sage-600">
          <ShieldCheck size={16} /> {t.searchKicker}
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-3 text-pine-800">{t.searchTitle}</h2>
        <p className="text-slate-500 mb-3 text-base md:text-lg">{t.searchSub}</p>
        <p className="text-sm mb-10 italic text-sage-600">{t.searchNote}</p>

        {/* Google Programmable Search — restricted to the approved sites, no API key needed */}
        <div className="text-start rounded-2xl border border-sage-300 shadow-pine p-3 md:p-4 bg-white">
          <div className="gcse-search" />
        </div>

        <div className="mt-10">
          <p className="text-xs text-slate-500 mb-3">{t.approvedOnly}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {APPROVED_SITES.map((s) => (
              <span key={s} dir="ltr"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white border border-sage-300 text-slate-500">
                <CheckCircle2 size={13} className="text-sage-600" /> {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
