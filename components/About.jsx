import { Info, Youtube, ExternalLink } from "lucide-react";
import SectionHead from "./SectionHead";

export default function About({ t }) {
  // Highlight Ali's full name wherever it appears in a paragraph
  const highlight = (text) => {
    const parts = text.split(t.aboutName);
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && <span className="font-bold text-ink">{t.aboutName}</span>}
      </span>
    ));
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHead icon={Info} kicker={t.aboutKicker} title={t.aboutTitle} />
        <div className="rounded-2xl border border-sage-300 bg-pearl-50 p-8 md:p-10 leading-loose text-slate-600 text-base md:text-lg">
          {t.aboutParas.map((p, i) => (
            <p key={i} className="mb-5">{highlight(p)}</p>
          ))}
          <blockquote className="font-quran text-xl md:text-2xl text-center py-4 text-sage-600">
            {t.aboutHadith}
          </blockquote>
          <div className="flex justify-center">
            <a href="https://www.youtube.com/@For_AliAlseddiqi" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white border border-sage-300 text-sage-600 hover:shadow-pine transition-shadow">
              <Youtube size={16} /> {t.aboutYT} <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
