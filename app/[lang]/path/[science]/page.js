import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { PLAYLISTS, PL_CATS, PL_LEVELS, PL_CHANNELS } from "@/lib/curriculum";
import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SCIENCES = PL_CATS.filter((c) => c.key !== "all");

export function generateStaticParams() {
  const out = [];
  for (const lang of LANGS) for (const c of SCIENCES) out.push({ lang, science: c.key });
  return out;
}

export const dynamicParams = false;

function findCat(key) {
  return SCIENCES.find((c) => c.key === key);
}

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const c = findCat(params.science);
  if (!c) return { title: t.pathTitle };
  return {
    title: `${c[lang]} — ${t.pathTitle}`,
    description: t.pathDesc,
    openGraph: { title: `${c[lang]} — ${t.pathTitle}`, description: t.pathDesc, type: "article" },
  };
}

export default function SciencePage({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const c = findCat(params.science);
  if (!c) notFound();

  const Back = lang === "ar" ? ArrowRight : ArrowLeft;
  const items = PLAYLISTS.filter((p) => p.sci === c.key).sort((a, b) => a.level - b.level);

  return (
    <>
      <Header t={t} lang={lang} />
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href={`/${lang}#curriculum`}
          className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:underline mb-8">
          <Back size={16} /> {t.nav.curriculum}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-pine-800 mb-2">{c[lang]}</h1>
        <p className="text-slate-500 mb-10">{t.pathDesc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <div key={p.id} className="bg-pearl-50 rounded-2xl p-5 border border-pearl-200 flex flex-col">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-sage-100 text-sage-700 self-start mb-3">
                {PL_LEVELS[p.level][lang]}
              </span>
              <h3 className="font-bold text-ink leading-snug mb-4 flex-1">{p.title[lang]}</h3>
              <div className="flex flex-col gap-2">
                {p.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-sage-300 text-sage-600 bg-white hover:bg-sage-100 transition-colors">
                    <PlayCircle size={15} /> <span dir="ltr" className="truncate">{PL_CHANNELS[s.ch][lang]}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
