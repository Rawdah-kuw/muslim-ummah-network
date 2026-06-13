import PearlMark from "./PearlMark";

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
    </footer>
  );
}
