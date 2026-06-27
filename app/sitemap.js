import { BOOKS, bookSlug } from "@/lib/data";
import { LANGS } from "@/lib/i18n";

const BASE = "https://muslimummah.app";

export default function sitemap() {
  const now = new Date();
  const urls = [];
  for (const lang of LANGS) {
    urls.push({ url: `${BASE}/${lang}`, lastModified: now, changeFrequency: "weekly", priority: 1 });
    for (const b of BOOKS) {
      urls.push({
        url: `${BASE}/${lang}/library/${bookSlug(b)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }
  return urls;
}
