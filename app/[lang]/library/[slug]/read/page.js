import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Download, ExternalLink } from "lucide-react";
import { BOOKS, bookSlug } from "@/lib/data";
import { STR, LANGS } from "@/lib/i18n";
import PdfReader from "@/components/PdfReader";

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
  const b = findBook(params.slug);
  return { title: b ? b.title[lang] : STR[lang].libTitle };
}

export default function ReadPage({ params, searchParams }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const b = findBook(params.slug);
  if (!b) notFound();

  const useEn = searchParams?.v === "en" && b.fileEn;
  const url = useEn ? b.fileEn : b.fileAr;
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex flex-col bg-pearl-100">
      <header className="sticky top-0 z-40 bg-white/95 border-b border-pearl-200 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href={`/${lang}/library/${bookSlug(b)}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:underline min-w-0">
            <Back size={16} className="shrink-0" />
            <span className="truncate">{b.title[lang]}</span>
          </Link>
          <div className="flex items-center gap-1.5 shrink-0">
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={t.openNewTab}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-sage-600 hover:bg-sage-100 transition-colors">
              <ExternalLink size={16} />
            </a>
            <a href={url} download aria-label={t.download}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-sage-600 hover:bg-sage-100 transition-colors">
              <Download size={16} />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto">
        <PdfReader url={url} t={t} />
      </main>
    </div>
  );
}
