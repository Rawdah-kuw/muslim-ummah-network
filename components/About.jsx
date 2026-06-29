import { Info, Youtube, ExternalLink, Home, GraduationCap, Users, BookOpen, Search, Moon, Sprout } from "lucide-react";
import SectionHead from "./SectionHead";

// Icons per milestone (content lives in i18n: t.aboutTimeline). The last two
// steps are styled differently to mark them with dignity.
const STEPS = [
  { Icon: Home },
  { Icon: GraduationCap },
  { Icon: Users },
  { Icon: BookOpen },
  { Icon: Search },
  { Icon: Moon, final: true },
  { Icon: Sprout, accent: true },
];

export default function About({ t }) {
  return (
    <section id="about" className="py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHead icon={Info} kicker={t.aboutKicker} title={t.aboutTitle} />

        <div className="relative">
          <span className="absolute top-2 bottom-12 w-0.5 bg-sage-300" style={{ insetInlineStart: "21px" }} aria-hidden="true" />
          <div className="space-y-4">
            {t.aboutTimeline.map((s, i) => {
              const { Icon, final, accent } = STEPS[i] || STEPS[0];
              return (
                <div key={i} className="flex items-start gap-4 relative">
                  <span className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 relative z-10 text-cream ${final ? "bg-pinebtn" : "bg-sage-600"}`}>
                    <Icon size={20} />
                  </span>
                  <div className={`flex-1 rounded-2xl border p-4 md:p-5 ${
                    accent ? "bg-sage-100 border-sage-300" : final ? "bg-pearl-50 border-pearl-200" : "bg-white border-pearl-200"
                  }`}>
                    <div className="text-xs font-medium text-sage-600 mb-1">{s.phase}</div>
                    <h3 className="font-bold text-pine-800 mb-1.5">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <blockquote className="font-quran text-xl md:text-2xl text-center mt-12 mb-1.5 text-sage-600 leading-loose">
          {t.aboutHadith}
        </blockquote>
        <p className="text-center text-xs text-slate-400 mb-8">{t.aboutHadithSrc}</p>

        <div className="flex justify-center">
          <a href="https://www.youtube.com/@For_AliAlseddiqi" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white border border-sage-300 text-sage-600 hover:shadow-pine transition-shadow">
            <Youtube size={16} /> {t.aboutYT} <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
