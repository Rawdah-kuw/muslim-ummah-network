import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import About from "@/components/About";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export function generateMetadata({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  return {
    title: t.aboutTitle,
    description: t.aboutParas[0].slice(0, 160),
    openGraph: { title: t.aboutTitle, description: t.aboutParas[0].slice(0, 160), type: "article" },
  };
}

export default function AboutPage({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  return (
    <>
      <Header t={t} lang={lang} />
      <About t={t} />
      <Footer t={t} lang={lang} />
    </>
  );
}
