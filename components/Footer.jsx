import { Mail } from "lucide-react";
import PearlMark from "./PearlMark";
import { CONTACT_EMAIL } from "@/lib/data";

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
        <p className="font-quran text-lg text-slate-500">{t.footerHadith}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-pearl-200 flex flex-col items-center gap-2 text-center">
        <a href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:underline">
          <Mail size={15} /> {t.contactUs}: <span dir="ltr">{CONTACT_EMAIL}</span>
        </a>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{t.rightsNotice}</p>
      </div>
    </footer>
  );
}
