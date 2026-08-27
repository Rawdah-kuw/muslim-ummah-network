"use client";

import { useMemo, useState } from "react";
import { Quote as QuoteIcon, RefreshCw } from "lucide-react";
import QuoteDownload from "./QuoteDownload";
import { QUOTES } from "@/lib/quotes";

// "Quote of the Day" from Sheikh Ali's books. The English page shows only
// quotes that have an English text (verbatim excerpts), never Arabic-only
// adapted summaries.
export default function DailyQuote({ t, lang }) {
  const list = useMemo(
    () => (lang === "ar" ? QUOTES : QUOTES.filter((q) => q.en)),
    [lang]
  );
  const start = useMemo(() => {
    const now = new Date();
    const s = new Date(now.getFullYear(), 0, 0);
    const day = Math.floor((now - s) / 86400000);
    return list.length ? (day + 3) % list.length : 0;
  }, [list]);
  const [i, setI] = useState(start);

  if (!list.length) return null;
  const q = list[i % list.length];
  const text = lang === "ar" ? q.ar : q.en;
  const cited = q.source.cited === true;
  const author = lang === "ar" ? q.source.authorAr : q.source.authorEn;
  const book = q.source[lang] || q.source.ar;

  return (
    <section className="bg-pine-800">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-14 text-center">
        <QuoteIcon size={38} className="mx-auto mb-5 text-sage-300 opacity-60" />

        <p
          dir={lang === "ar" ? "rtl" : "ltr"}
          className={`${lang === "ar" ? "font-quran text-2xl md:text-3xl leading-loose" : "text-xl md:text-2xl leading-relaxed"} text-cream mb-6`}
        >
          {text}
        </p>

        {cited ? (
          <>
            <p className="text-base font-semibold" style={{ color: "#C8A86B" }}>{author}</p>
            <p className="text-sm text-sage-300 mb-6">
              {lang === "ar" ? `مقتبَس من كتاب «${book}»` : `Quoted from “${book}”`}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-sage-300">{book}</p>
            <p className="text-base font-semibold mb-6" style={{ color: "#C8A86B" }}>{author}</p>
          </>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setI((v) => (v + 1) % list.length)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-sage-300 text-sage-300 hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={15} /> {t.anotherQuote}
          </button>
          <QuoteDownload q={q} lang={lang} t={t} />
        </div>
      </div>
    </section>
  );
}
