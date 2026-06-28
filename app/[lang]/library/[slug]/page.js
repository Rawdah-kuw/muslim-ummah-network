import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Download, BookOpen, FileText } from "lucide-react";
import { BOOKS, CATS, CONTACT_EMAIL, bookSlug } from "@/lib/data";
import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";

export function generateStaticParams() {
  const out = [];
  for (const lang of LANGS) for (const b of BOOKS) out.push({ lang, slug: bookSlug(b) });
  return out;
}

export const dynamicParams = false;

function findBook(slug) {
  return BOOKS.find((b) => bookSlug(b) === slug);
}

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const b = findBook(params.slug);
  if (!b) return { title: t.libTitle };
  return {
    title: `${b.title[lang]} — ${b.author[lang]}`,
    description: b.desc[lang],
    openGraph: { title: b.title[lang], description: b.desc[lang], type: "article" },
  };
}

export default function BookPage({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const b = findBook(params.slug);
  if (!b) notFound();

  const Back = lang === "ar" ? ArrowRight : ArrowLeft;
  const cat = CATS.find((c) => c.key === b.cat);

  return (
    <>
      <Header t={t} lang={lang} />
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <Link href={`/${lang}#library`}
          className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:underline mb-8">
          <Back size={16} /> {t.nav.library}
        </Link>

        <span className="inline-block text-xs px-2.5 py-1 rounded-full font-medium bg-sage-100 text-sage-600 mb-4">
          {cat?.[lang]}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-pine-800 mb-2">{b.title[lang]}</h1>
        <p className="text-slate-500 mb-6">{b.author[lang]}</p>

        <div className="flex items-center gap-5 text-sm text-slate-500 mb-8">
          <span className="flex items-center gap-1.5">
            <FileText size={14} /> {b.pages ? `${b.pages} ${t.pagesLabel}` : t.fullCopy}
          </span>
          <span dir="ltr">{b.size}</span>
        </div>

        <p className="text-lg text-slate-600 leading-relaxed mb-10">{b.desc[lang]}</p>

        <div className="flex flex-wrap gap-3">
          {b.bilingual ? (
            <>
              <a href={b.fileAr} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 transition-colors">
                <BookOpen size={16} /> {t.readAr}
              </a>
              <a href={b.fileEn} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors">
                <BookOpen size={16} /> {t.readEn}
              </a>
            </>
          ) : (
            <a href={b.fileAr} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 transition-colors">
              <BookOpen size={16} /> {t.readBook}
            </a>
          )}
          <a href={b.fileAr} download
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-500 bg-pearl-100 hover:bg-pearl-200 transition-colors">
            <Download size={16} /> {t.dlPdf}
          </a>
          <ShareButton t={t} path={`/${lang}/library/${bookSlug(b)}`} title={b.title[lang]}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors" />
        </div>

        <p className="mt-14 text-xs text-slate-400 leading-relaxed">
          {t.rightsNotice}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr" className="text-sage-600 hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
