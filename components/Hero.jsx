import PearlMark from "./PearlMark";
import { APP_PLAY_URL } from "@/lib/data";

export default function Hero({ t }) {
  return (
    <section id="top" className="py-10 md:py-20 bg-pearl-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-4">
          <PearlMark size={58} />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-pine-800">
          {t.heroTitle1} <span className="text-sage-600">{t.heroTitle2}</span>
        </h1>
        <p className="text-base md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-6">{t.heroDesc}</p>
        <blockquote dir="rtl" className="font-quran text-2xl md:text-3xl leading-loose mb-2 text-sage-600">
          {t.heroAyah}
        </blockquote>
        {t.heroAyahTr ? (
          <p className="text-sm text-slate-500 mb-7 italic">{t.heroAyahTr}</p>
        ) : (
          <div className="mb-7" />
        )}
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <a href={APP_PLAY_URL} target="_blank" rel="noopener noreferrer"
            aria-label={t.ctaApp}
            className="inline-flex items-center gap-3 ps-5 pe-6 py-3 rounded-xl bg-pine-800 text-cream hover:bg-pine-900 transition-colors shadow-sm">
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden="true">
              <path d="M1 1.6 12.8 12 1 22.4a1.2 1.2 0 0 1-.6-1V2.6c0-.4.2-.8.6-1Z" fill="#EA4335"/>
              <path d="M16.9 8.1 12.8 12 1 1.6c.3-.2.8-.2 1.2 0l13.7 6.5Z" fill="#34A853"/>
              <path d="M16.9 15.9 3.2 22.4c-.4.2-.9.2-1.2 0L12.8 12l4.1 3.9Z" fill="#FBBC04"/>
              <path d="M21 10.9c.8.4.8 1.8 0 2.2l-4.1 2-4.1-3.1 4.1-3.1 4.1 2Z" fill="#4285F4"/>
            </svg>
            <span className="flex flex-col items-start leading-none text-start">
              <span className="text-[10px] opacity-85">{t.getItOn}</span>
              <span className="text-base font-semibold">{t.googlePlay}</span>
            </span>
          </a>
          <a href="#library"
            className="px-7 py-3.5 rounded-xl text-cream font-medium bg-sage-600 hover:bg-sage-700 transition-colors">
            {t.ctaLibrary}
          </a>
          <a href="#search"
            className="px-7 py-3.5 rounded-xl font-medium bg-white border border-pearl-300 text-slate-600 hover:border-sage-300 transition-colors">
            {t.ctaSearch}
          </a>
        </div>
      </div>
    </section>
  );
}
