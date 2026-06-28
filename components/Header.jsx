"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Languages, Moon, Sun } from "lucide-react";
import PearlMark from "./PearlMark";

const NAV_IDS = ["about", "library", "audio", "curriculum", "search"];

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
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-2">
        <a href={`/${lang}`} className="flex items-center gap-2.5">
          <PearlMark size={34} />
          <span className="font-extrabold text-lg tracking-tight text-pine-800">{t.brand}</span>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-1">
          <nav className="flex flex-wrap items-center justify-center gap-1" aria-label="Main">
            {NAV_IDS.map((id) => (
              <a key={id} href={`/${lang}#${id}`}
                className="px-3 md:px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-pearl-100 transition-colors">
                {t.nav[id]}
              </a>
            ))}
          </nav>
          <button type="button" onClick={toggleTheme} aria-label={dark ? t.lightMode : t.darkMode}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-sage-300 text-sage-600 hover:bg-sage-100 transition-colors">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href={`/${t.langTarget}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold border border-sage-300 text-sage-600 hover:bg-sage-100 transition-colors">
            <Languages size={15} /> {t.langBtn}
          </Link>
        </div>
      </div>
    </header>
  );
}
