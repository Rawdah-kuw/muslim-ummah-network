"use client";

import { useState } from "react";
import { BookOpen, PenLine, Download, FileText, Library as LibraryIcon } from "lucide-react";
import SectionHead from "./SectionHead";
import { BOOKS, CATS } from "@/lib/data";

export default function Library({ t, lang }) {
  const [cat, setCat] = useState("all");
  const books = cat === "all" ? BOOKS : BOOKS.filter((b) => b.cat === cat);

  return (
    <section id="library" className="py-16 md:py-24 bg-pearl-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead icon={LibraryIcon} kicker={t.libKicker} title={t.libTitle} desc={t.libDesc} />

        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label={t.libKicker}>
          {CATS.map((c) => (
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

        {/* 3 columns max — cards need room to breathe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((b) => (
            <article key={b.id}
              className="bg-white rounded-2xl p-6 border border-pearl-200 hover:shadow-pine-lg transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-sage-100">
                  {b.cat === "ali"
                    ? <PenLine size={20} className="text-sage-600" />
                    : <BookOpen size={20} className="text-sage-600" />}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-pearl-100 text-slate-500">
                  {CATS.find((c) => c.key === b.cat)?.[lang]}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1 text-ink">{b.title[lang]}</h3>
              <p className="text-sm text-slate-500 mb-3">{b.author[lang]}</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">{b.desc[lang]}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <FileText size={13} /> {b.pages ? `${b.pages} ${t.pagesLabel}` : t.fullCopy}
                </span>
                <span dir="ltr">{b.size}</span>
              </div>
              {b.bilingual ? (
                <div className="flex gap-2">
                  <a href={b.fileAr} download
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors">
                    <Download size={15} /> {t.dlAr}
                  </a>
                  <a href={b.fileEn} download
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-pearl-300 text-slate-500 bg-white hover:bg-pearl-100 transition-colors">
                    <Download size={15} /> {t.dlEn}
                  </a>
                </div>
              ) : (
                <a href={b.fileAr} download
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors">
                  <Download size={16} /> {t.dlPdf}
                </a>
              )}
              {b.extra && (
                <a href={b.extraFile} download
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 bg-pearl-100 transition-colors">
                  <FileText size={13} /> {b.extra[lang]}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
