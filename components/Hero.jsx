import PearlMark from "./PearlMark";

export default function Hero({ t }) {
  return (
    <section id="top" className="py-20 md:py-32 bg-pearl-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-8">
          <PearlMark size={72} />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-pine-800">
          {t.heroTitle1} <span className="text-sage-600">{t.heroTitle2}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10">{t.heroDesc}</p>
        <blockquote dir="rtl" className="font-quran text-2xl md:text-3xl leading-loose mb-3 text-sage-600">
          {t.heroAyah}
        </blockquote>
        {t.heroAyahTr ? (
          <p className="text-sm text-slate-500 mb-10 italic">{t.heroAyahTr}</p>
        ) : (
          <div className="mb-10" />
        )}
        <div className="flex flex-wrap gap-3 justify-center">
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
