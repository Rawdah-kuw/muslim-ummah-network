import { Mail } from "lucide-react";
import PearlMark from "./PearlMark";
import { CONTACT_EMAIL, APP_PLAY_URL } from "@/lib/data";

export default function Footer({ t, lang }) {
  return (
    <footer className="border-t border-pearl-200 py-12 bg-pearl-50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <PearlMark size={30} />
          <div>
            <p className="font-bold text-sm text-pine-800">{t.siteName}</p>
            <p className="text-xs text-slate-500">{t.footerTag}</p>
          </div>
        </div>
        <p className="font-quran text-lg text-slate-500 text-center">{t.footerHadith}</p>
        <a href={APP_PLAY_URL} target="_blank" rel="noopener noreferrer" aria-label={t.ctaApp}
          className="inline-flex items-center gap-3 ps-4 pe-5 py-2.5 rounded-lg bg-pine-800 text-cream hover:bg-pine-900 transition-colors shrink-0">
          <svg width="20" height="22" viewBox="0 0 22 24" fill="none" aria-hidden="true">
            <path d="M1 1.6 12.8 12 1 22.4a1.2 1.2 0 0 1-.6-1V2.6c0-.4.2-.8.6-1Z" fill="#EA4335"/>
            <path d="M16.9 8.1 12.8 12 1 1.6c.3-.2.8-.2 1.2 0l13.7 6.5Z" fill="#34A853"/>
            <path d="M16.9 15.9 3.2 22.4c-.4.2-.9.2-1.2 0L12.8 12l4.1 3.9Z" fill="#FBBC04"/>
            <path d="M21 10.9c.8.4.8 1.8 0 2.2l-4.1 2-4.1-3.1 4.1-3.1 4.1 2Z" fill="#4285F4"/>
          </svg>
          <span className="flex flex-col items-start leading-none text-start">
            <span className="text-[10px] opacity-85">{t.getItOn}</span>
            <span className="text-sm font-semibold">{t.googlePlay}</span>
          </span>
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-pearl-200 flex flex-col items-center gap-2 text-center">
        <a href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:underline">
          <Mail size={15} /> {t.contactUs}: <span dir="ltr">{CONTACT_EMAIL}</span>
        </a>
        <a href={`/${lang}/privacy`} className="text-xs text-sage-600 hover:underline">
          {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
        </a>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{t.rightsNotice}</p>
      </div>
    </footer>
  );
}
