import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Adhkar from "@/components/Adhkar";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const title = lang === "ar" ? "أذكار الصباح والمساء" : "Morning & Evening Adhkar";
  const description = lang === "ar"
    ? "أذكار الصباح والمساء من حصن المسلم، مع تحميل كل ذكر كصورة."
    : "Morning & evening adhkar from Hisnul Muslim, each downloadable as an image.";
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default function Page({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  return (
    <>
      <Header t={t} lang={lang} />
      <Adhkar t={t} lang={lang} />
      <Footer t={t} lang={lang} />
    </>
  );
}
