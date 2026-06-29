"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, PenLine, Download, FileText, Library as LibraryIcon, ArrowLeft } from "lucide-react";
import SectionHead from "./SectionHead";
import ShareButton from "./ShareButton";
import { BOOKS, CATS, CONTACT_EMAIL, bookSlug } from "@/lib/data";

export default function Library({ t, lang, preview = false }) {
  const [cat, setCat] = useState("all");
  const books = cat === "all" ? BOOKS : BOOKS.filter((b) => b.cat === cat);
  const readHref = (b, v) => `/${lang}/library/${bookSlug(b)}/read${v ? `?v=${v}` : ""}`;

  return (
    <section id="library" className="py-16 md:py-24 bg-pearl-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead icon={LibraryIcon} kicker={t.libKicker} title={t.libTitle} desc={t.libDesc} />

        {preview ? (
          <>
            {/* Overview of every category so visitors see the full scope before entering */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CATS.filter((c) => c.key !== "all").map((c) => {
                const n = BOOKS.filter((b) => b.cat === c.key).length;
                if (!n) return null;
                return (
                  <Link key={c.key} href={`/${lang}/library`}
                    className="bg-white rounded-xl border border-pearl-200 p-4 hover:shadow-pine hover:border-sage-300 transition-all flex flex-col gap-1.5">
                    <span className="font-bold text-ink text-sm leading-snug">{c[lang]}</span>
                    <span className="text-xs text-sage-600">{n} {t.libCountWord}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href={`/${lang}/library`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-cream bg-pinebtn hover:opacity-90 transition-opacity">
                {t.viewAllBooks} <ArrowLeft size={16} className="rtl:rotate-180" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label={t.libKicker}>
              {CATS.map((c) => (
                <button key={c.key} onClick={() => setCat(c.key)} role="tab" aria-selected={cat === c.key}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    cat === c.key
                      ? "bg-pinebtn text-cream border-pine-800"
                      : "bg-white text-slate-500 border-pearl-300 hover:border-sage-300"
                  }`}>
                  {c[lang]}
                </button>
              ))}
            </div>

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
                  <Link href={`/${lang}/library/${bookSlug(b)}`}
                    className="text-lg font-bold mb-1 text-ink hover:text-sage-600 transition-colors">
                    {b.title[lang]}
                  </Link>
                  <p className="text-sm text-slate-500 mb-3 mt-1">{b.author[lang]}</p>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">{b.desc[lang]}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <FileText size={13} /> {b.pages ? `${b.pages} ${t.pagesLabel}` : t.fullCopy}
                    </span>
                    <span dir="ltr">{b.size}</span>
                  </div>

                  {b.bilingual ? (
                    <>
                      <div className="flex gap-2">
                        <Link href={readHref(b)} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-cream bg-sage-600 hover:bg-sage-700 transition-colors">
                          <BookOpen size={15} /> {t.dlAr}
                        </Link>
                        <Link href={readHref(b, "en")} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors">
                          <BookOpen size={15} /> {t.dlEn}
                        </Link>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <a href={b.fileAr} download
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-slate-500 bg-pearl-100 hover:bg-pearl-200 transition-colors">
                          <Download size={13} /> {t.dlAr}
                        </a>
                        <a href={b.fileEn} download
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-slate-500 bg-pearl-100 hover:bg-pearl-200 transition-colors">
                          <Download size={13} /> {t.dlEn}
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href={readHref(b)} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-cream bg-sage-600 hover:bg-sage-700 transition-colors">
                        <BookOpen size={16} /> {t.readBook}
                      </Link>
                      <a href={b.fileAr} download
                        className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-slate-500 bg-pearl-100 hover:bg-pearl-200 transition-colors">
                        <Download size={13} /> {t.dlPdf}
                      </a>
                    </>
                  )}

                  {b.extra && (
                    <a href={b.extraFile} download
                      className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 bg-pearl-100 transition-colors">
                      <FileText size={13} /> {b.extra[lang]}
                    </a>
                  )}
                  <ShareButton t={t} path={`/${lang}/library/${bookSlug(b)}`} title={b.title[lang]}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-sage-600 hover:bg-sage-100 transition-colors" />
                </article>
              ))}
            </div>

            <p className="mt-12 text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t.rightsNotice}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sage-600 hover:underline" dir="ltr">{CONTACT_EMAIL}</a>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
