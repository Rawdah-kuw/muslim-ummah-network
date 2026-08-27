import { Sparkles } from "lucide-react";
import WirdDownload from "./WirdDownload";
import { WIRD } from "@/lib/wird";

// Server component: picks the same item for everyone on a given day.
// (The homepage uses revalidate so this refreshes daily without a rebuild.)
export default function DailyWird({ t, lang }) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  const item = WIRD[day % WIRD.length];

  return (
    <section className="bg-pearl-50 border-y border-pearl-200">
      <div className="max-w-3xl mx-auto px-6 py-10 md:py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium bg-sage-100 text-sage-600">
          <Sparkles size={16} /> {t.wirdLabel} · {t.wirdTypes[item.type]}
        </div>

        {lang === "ar" ? (
          <p className="font-quran text-2xl md:text-3xl leading-loose text-pine-800 mb-4">{item.ar}</p>
        ) : (
          <p className="text-xl md:text-2xl leading-relaxed italic text-pine-800 mb-4">{item.en}</p>
        )}

        <p className="text-sm text-sage-600 mb-6">{item.source[lang]}</p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <WirdDownload item={item} lang={lang} t={t} />
        </div>
      </div>
    </section>
  );
}
