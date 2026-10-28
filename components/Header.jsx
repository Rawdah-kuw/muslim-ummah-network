"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Languages, Moon, Sun } from "lucide-react";
import PearlMark from "./PearlMark";

const NAV_IDS = ["about", "library", "curriculum", "adhkar", "prayer", "rawdah"];
const navHref = (lang, id) =>
  id === "about" ? `/${lang}/about`
  : id === "library" ? `/${lang}/library`
  : id === "curriculum" ? `/${lang}/curriculum`
  : id === "adhkar" ? `/${lang}/adhkar`
  : id === "prayer" ? `/${lang}/prayer`
  : id === "rawdah" ? `/${lang}/rawdah`
  : `/${lang}#${id}`;

export default function Header({ t, lang }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const el = document.documentElement;
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    setDark(next);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 border-b border-pearl-200 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-2">
        {/* Top row: brand (start) + small language / theme controls (end). */}
        <div className="flex items-center justify-between gap-2">
          <a href={`/${lang}`} className="flex items-center gap-2">
            <PearlMark size={28} />
            <span className="font-extrabold text-base tracking-tight text-pine-800">{t.brand}</span>
          </a>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={toggleTheme} aria-label={dark ? t.lightMode : t.darkMode}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-sage-300 text-sage-600 hover:bg-sage-100 transition-colors">
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Link href={`/${t.langTarget}`} aria-label={t.langBtn}
              className="flex items-center gap-1 px-2.5 h-8 rounded-lg text-sm font-bold border border-sage-300 text-sage-600 hover:bg-sage-100 transition-colors">
              <Languages size={14} /> {lang === "ar" ? "E" : "ع"}
            </Link>
          </div>
        </div>
        {/* Compact nav — a balanced 3×2 grid on phones, inline on larger screens. */}
        <nav className="grid grid-cols-3 gap-0.5 mt-1.5 sm:flex sm:flex-wrap sm:justify-center sm:items-center" aria-label="Main">
          {NAV_IDS.map((id) => (
            <Link key={id} href={navHref(lang, id)}
              className="px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-center text-slate-500 hover:text-slate-900 hover:bg-pearl-100 transition-colors">
              {t.nav[id]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
