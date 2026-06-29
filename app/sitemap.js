import { BOOKS, bookSlug } from "@/lib/data";
import { PL_CATS } from "@/lib/curriculum";
import { LANGS } from "@/lib/i18n";

const BASE = "https://muslimummah.app";

export default function sitemap() {
  const now = new Date();
  const urls = [];
  const sciences = PL_CATS.filter((c) => c.key !== "all");

  for (const lang of LANGS) {
    urls.push({ url: `${BASE}/${lang}`, lastModified: now, changeFrequency: "weekly", priority: 1 });
    urls.push({ url: `${BASE}/${lang}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    urls.push({ url: `${BASE}/${lang}/library`, lastModified: now, changeFrequency: "weekly", priority: 0.9 });
    urls.push({ url: `${BASE}/${lang}/curriculum`, lastModified: now, changeFrequency: "weekly", priority: 0.9 });
    urls.push({ url: `${BASE}/${lang}/curated/youtube`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    urls.push({ url: `${BASE}/${lang}/curated/instagram`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });

    for (const b of BOOKS) {
      urls.push({ url: `${BASE}/${lang}/library/${bookSlug(b)}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
    }
    for (const c of sciences) {
      urls.push({ url: `${BASE}/${lang}/path/${c.key}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }
  }
  return urls;
}
