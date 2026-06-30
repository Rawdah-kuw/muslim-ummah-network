"use client";

import { useState } from "react";
import { Sparkles, Globe } from "lucide-react";
import AskLibrary from "./AskLibrary";
import SmartSearch from "./SmartSearch";

export default function Search({ t, lang }) {
  const [mode, setMode] = useState("ask"); // "ask" = AI from books, "web" = trusted sites

  const tabBase = "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-sm font-medium transition-colors";

  return (
    <section id="search" className="py-16 md:py-24 bg-pearl-50 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-3 text-pine-800">{t.searchUnifiedTitle}</h2>
        <p className="text-slate-500 mb-8 text-base md:text-lg">{t.searchUnifiedSub}</p>

        {/* Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-white border border-pearl-200 mb-10">
          <button type="button" onClick={() => setMode("ask")} aria-pressed={mode === "ask"}
            className={`${tabBase} ${mode === "ask" ? "bg-pinebtn text-cream" : "text-slate-500 hover:text-slate-900"}`}>
            <Sparkles size={16} /> {t.searchTabAsk}
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sage-100 text-sage-600">{t.beta}</span>
          </button>
          <button type="button" onClick={() => setMode("web")} aria-pressed={mode === "web"}
            className={`${tabBase} ${mode === "web" ? "bg-pinebtn text-cream" : "text-slate-500 hover:text-slate-900"}`}>
            <Globe size={16} /> {t.searchTabWeb}
          </button>
        </div>

        {/* Keep both mounted so the PSE script and AI state persist; toggle visibility */}
        <div className={mode === "ask" ? "block" : "hidden"}>
          <AskLibrary t={t} lang={lang} embedded />
        </div>
        <div className={mode === "web" ? "block" : "hidden"}>
          <SmartSearch t={t} lang={lang} embedded />
        </div>
      </div>
    </section>
  );
}
