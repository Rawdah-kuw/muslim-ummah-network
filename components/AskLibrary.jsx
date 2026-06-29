"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, BookOpen, AlertTriangle } from "lucide-react";

export default function AskLibrary({ t, lang }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

  const ask = async () => {
    const query = q.trim();
    if (!query || loading) return;
    setLoading(true);
    setRes(null);
    setErr("");
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, lang }),
      });
      const data = await r.json();
      if (data.error) setErr(t.askError);
      else setRes(data);
    } catch {
      setErr(t.askError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ask" className="py-16 md:py-24 bg-pearl-50 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium bg-sage-100 text-sage-600">
          <Sparkles size={16} /> {t.askKicker}
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pinebtn text-cream">{t.beta}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-3 text-pine-800">{t.askTitle}</h2>
        <p className="text-slate-500 mb-8 text-base md:text-lg">{t.askSub}</p>

        <div className="bg-white rounded-2xl p-2 flex items-center gap-2 shadow-pine border border-sage-300">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder={t.askPh}
            aria-label={t.askTitle}
            className="flex-1 bg-transparent outline-none px-4 py-3 text-base text-ink"
          />
          <button onClick={ask} disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-cream font-medium bg-sage-600 hover:bg-sage-700 disabled:opacity-60 transition-colors">
            <Send size={18} />
            <span className="hidden sm:inline">{loading ? t.asking : t.askBtn}</span>
          </button>
        </div>

        {err && <p className="mt-6 text-sm text-slate-500">{err}</p>}

        {res && (
          <div className="mt-8 text-start">
            {res.notFound ? (
              <div className="bg-white border border-pearl-200 rounded-2xl p-6 text-slate-600 leading-relaxed">
                {t.askNotFound}
              </div>
            ) : (
              <div className="bg-white border border-pearl-200 rounded-2xl p-6">
                <p className="text-ink leading-loose whitespace-pre-wrap">{res.answer}</p>
                {res.sources && res.sources.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-pearl-200">
                    <p className="text-xs text-slate-500 mb-2">{t.askSources}</p>
                    <div className="flex flex-wrap gap-2">
                      {res.sources.map((s, i) => (
                        <Link key={i} href={`/${lang}/library/${s.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-pearl-100 hover:bg-sage-100 text-sage-600 border border-pearl-300 transition-colors">
                          <BookOpen size={12} /> {s.title} — ص {s.page}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 leading-relaxed">
          <AlertTriangle size={13} /> {t.askDisclaimer}
        </p>
      </div>
    </section>
  );
}
