import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Rawdah from "@/components/Rawdah";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const title = lang === "ar" ? "روضة — مجالس ودروس الذكر" : "Rawdah — Dhikr Gatherings";
  const description = lang === "ar"
    ? "دليل أسبوعي لمجالس ودروس الذكر: بحث وفلاتر بالمنطقة واليوم والداعية."
    : "A weekly directory of dhikr gatherings and lessons.";
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default function RawdahPage({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  return (
    <>
      <Header t={t} lang={lang} />
      <Rawdah />
      <Footer t={t} lang={lang} />
    </>
  );
}
