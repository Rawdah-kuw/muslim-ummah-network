"use client";

import { useState } from "react";
import { Search, ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";
import { APPROVED_SITES } from "@/lib/data";

export default function SmartSearch({ t, lang }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(null);

  const go = async () => {
    const query = q.trim();
    if (!query || loading) return;
    setLoading(true);
    setResults(null);
    setFallback(null);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await r.json();
      if (data.fallback) {
        // API keys not configured yet → offer the scoped external search
        setFallback(`https://www.google.com/search?q=${encodeURIComponent(data.scoped)}`);
      } else {
        setResults(data.items ?? []);
      }
    } catch {
      const scoped = `${query} (${APPROVED_SITES.map((s) => `site:${s}`).join(" OR ")})`;
      setFallback(`https://www.google.com/search?q=${encodeURIComponent(scoped)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="search" className="py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium bg-sage-100 text-sage-600">
          <ShieldCheck size={16} /> {t.searchKicker}
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-3 text-pine-800">{t.searchTitle}</h2>
        <p className="text-slate-500 mb-3 text-base md:text-lg">{t.searchSub}</p>
        <p className="text-sm mb-10 italic text-sage-600">{t.searchNote}</p>

        <div className="bg-white rounded-2xl p-2 flex items-center gap-2 shadow-pine border border-sage-300">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder={t.searchPh}
            aria-label={t.searchTitle}
            className="flex-1 bg-transparent outline-none px-4 py-3 text-base text-ink"
          />
          <button onClick={go} disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium bg-sage-600 hover:bg-sage-700 disabled:opacity-60 transition-colors">
            <Search size={18} />
            <span className="hidden sm:inline">{loading ? t.searching : t.searchBtn}</span>
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-8 text-start space-y-3" aria-live="polite">
            {results.length === 0 && <p className="text-slate-500 text-center">{t.noResults}</p>}
            {results.map((r, i) => (
              <a key={i} href={r.link} target="_blank" rel="noopener noreferrer"
                className="block bg-pearl-50 border border-pearl-200 rounded-xl p-5 hover:shadow-pine transition-shadow">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <h3 className="font-bold text-ink">{r.title}</h3>
                  <ExternalLink size={14} className="text-slate-400 shrink-0" />
                </div>
                <p className="text-xs text-sage-600 mb-2" dir="ltr">{r.displayLink}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{r.snippet}</p>
              </a>
            ))}
          </div>
        )}

        {fallback && (
          <a href={fallback} target="_blank" rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-sage-300 text-sage-600 hover:bg-sage-100 transition-colors">
            {t.openExternal} <ExternalLink size={15} />
          </a>
        )}

        <div className="mt-8">
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
