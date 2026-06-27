import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Play, Instagram } from "lucide-react";
import { YT_CHANNELS, IG_PROFILES } from "@/lib/data";
import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TYPES = ["youtube", "instagram"];

export function generateStaticParams() {
  const out = [];
  for (const lang of LANGS) for (const type of TYPES) out.push({ lang, type });
  return out;
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const title = params.type === "youtube" ? t.pathChannels : t.feedTitle;
  return { title, description: t.feedDesc, openGraph: { title, type: "website" } };
}

export default function CuratedPage({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  if (!TYPES.includes(params.type)) notFound();

  const yt = params.type === "youtube";
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <>
      <Header t={t} lang={lang} />
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href={`/${lang}#${yt ? "curriculum" : "feed"}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:underline mb-8">
          <Back size={16} /> {yt ? t.nav.curriculum : t.nav.feed}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-pine-800 mb-10">
          {yt ? t.pathChannels : t.feedTitle}
        </h1>

        {yt ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {YT_CHANNELS.map((c) => (
              <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer"
                className="group bg-pearl-50 rounded-2xl border border-pearl-200 p-5 flex items-start gap-4 hover:shadow-pine transition-shadow">
                <span className="w-11 h-11 rounded-xl bg-sage-100 flex items-center justify-center shrink-0">
                  <Play size={18} className="text-sage-600" />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink truncate">{c.name[lang]}</h3>
                  <p className="text-xs text-slate-500 mb-1.5" dir="ltr">{c.handle}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {c.official ? t.officialBadge : c.topic[lang]}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {IG_PROFILES.map((p) => (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                className="group bg-pearl-50 rounded-2xl border border-pearl-200 p-5 flex items-center gap-4 hover:shadow-pine transition-shadow">
                <span className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0 border-2 border-sage-300 bg-sage-100 text-sage-600">
                  {p.name[lang].replace("د. ", "").replace("الشيخ ", "").replace("Dr. ", "").charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink truncate">{p.name[lang]}</h3>
                  <p className="text-xs text-slate-500 mb-1" dir="ltr">@{p.handle}</p>
                  <p className="text-sm text-slate-500 truncate">{p.focus[lang]}</p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium shrink-0 px-4 py-2 rounded-xl border border-sage-300 text-sage-600 group-hover:bg-sage-100 transition-colors">
                  <Instagram size={15} /> {t.follow}
                </span>
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
