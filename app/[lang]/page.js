import { STR, LANGS } from "@/lib/i18n";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Library from "@/components/Library";
import AudioLibrary from "@/components/AudioLibrary";
import Feed from "@/components/Feed";
import SmartSearch from "@/components/SmartSearch";
import Footer from "@/components/Footer";

export default function Page({ params }) {
  const lang = LANGS.includes(params.lang) ? params.lang : "ar";
  const t = STR[lang];
  const rtl = lang === "ar";

  return (
    <>
      <Header t={t} lang={lang} />
      <Hero t={t} />
      <About t={t} />
      <Library t={t} lang={lang} />
      <AudioLibrary t={t} lang={lang} rtl={rtl} />
      <Feed t={t} lang={lang} rtl={rtl} />
      <SmartSearch t={t} lang={lang} />
      <Footer t={t} lang={lang} />
    </>
  );
}
