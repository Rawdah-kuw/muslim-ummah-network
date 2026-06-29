import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DailyWird from "@/components/DailyWird";
import About from "@/components/About";
import Library from "@/components/Library";
import Feed from "@/components/Feed";
import Curriculum from "@/components/Curriculum";
import SmartSearch from "@/components/SmartSearch";
import AskLibrary from "@/components/AskLibrary";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export default function Page({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const rtl = lang === "ar";

  return (
    <>
      <Header t={t} lang={lang} />
      <Hero t={t} />
      <DailyWird t={t} lang={lang} />
      <About t={t} lang={lang} preview />
      <Library t={t} lang={lang} preview />
      <Curriculum t={t} lang={lang} rtl={rtl} preview />
      <Feed t={t} lang={lang} preview />
      <SmartSearch t={t} lang={lang} />
      <AskLibrary t={t} lang={lang} />
      <Footer t={t} lang={lang} />
    </>
  );
}
