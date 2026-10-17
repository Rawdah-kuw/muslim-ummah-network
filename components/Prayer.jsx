"use client";

import { useState, useEffect } from "react";
import { Sunrise, Sun, Sunset, Moon, CloudSun, Clock } from "lucide-react";

const ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const LABEL = {
  ar: { Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" },
  en: { Fajr: "Fajr", Sunrise: "Sunrise", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha" },
};
const ICON = { Fajr: CloudSun, Sunrise: Sunrise, Dhuhr: Sun, Asr: CloudSun, Maghrib: Sunset, Isha: Moon };

const mins = (hhmm) => {
  const p = String(hhmm || "").split(":");
  return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0);
};

const time12 = (hhmm, ar) => {
  const p = String(hhmm || "").split(":");
  if (p.length < 2) return hhmm || "";
  let h = parseInt(p[0], 10) || 0;
  const m = p[1];
  const pm = h >= 12;
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  const suffix = ar ? (pm ? "م" : "ص") : (pm ? "PM" : "AM");
  return `${h12}:${m} ${suffix}`;
};

// Current time-of-day in Kuwait (UTC+3), regardless of the viewer's timezone.
const kuwaitNow = () => {
  const d = new Date();
  const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
  const kw = new Date(utcMs + 3 * 3600000);
  return { min: kw.getHours() * 60 + kw.getMinutes(), sec: kw.getSeconds() };
};

export default function Prayer({ t, lang }) {
  const ar = lang === "ar";
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | error
  const [, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch("/api/prayer")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        if (!alive) return;
        if (j && j.error) setState("error");
        else { setData(j); setState("ok"); }
      })
      .catch(() => alive && setState("error"));
    const id = setInterval(() => setTick((v) => v + 1), 1000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const title = ar ? "أوقات الصلاة" : "Prayer Times";
  const cityLabel = ar ? "مدينة الكويت" : "Kuwait City";

  // Determine the next prayer (Sunrise excluded) and the remaining time.
  let nextKey = null;
  let remaining = null;
  if (data?.timings) {
    const { min: nowMin, sec: nowSec } = kuwaitNow();
    for (const k of ORDER) {
      if (k === "Sunrise") continue;
      if (mins(data.timings[k]) > nowMin) { nextKey = k; break; }
    }
    const target = nextKey ? mins(data.timings[nextKey]) : mins(data.timings.Fajr) + 1440;
    if (!nextKey) nextKey = "Fajr"; // after Isha → Fajr tomorrow
    let totalSec = (target - nowMin) * 60 - nowSec;
    if (totalSec < 0) totalSec = 0;
    const hh = Math.floor(totalSec / 3600);
    const mm = Math.floor((totalSec % 3600) / 60);
    const ss = totalSec % 60;
    const pad = (n) => String(n).padStart(2, "0");
    remaining = `${hh}:${pad(mm)}:${pad(ss)}`;
  }

  return (
    <section className="max-w-xl mx-auto px-4 md:px-6 py-8 md:py-10">
      <h1 className="text-2xl font-bold text-pine-800 mb-1 text-center">{title}</h1>
      <p className="text-sm text-slate-500 mb-6 text-center">
        {cityLabel}
        {data ? ` · ${ar ? data.hijriAr : data.hijriEn}` : ""}
      </p>

      {state === "loading" && (
        <div className="space-y-3 animate-pulse">
          <div className="h-24 rounded-2xl bg-pearl-100" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-pearl-100" />
          ))}
        </div>
      )}

      {state === "error" && (
        <div className="rounded-2xl border border-pearl-200 bg-white p-6 text-center text-slate-500">
          {ar ? "تعذّر جلب أوقات الصلاة حالياً. حاول لاحقاً." : "Couldn't load prayer times right now. Please try again later."}
        </div>
      )}

      {state === "ok" && data && (
        <>
          {/* Next prayer — highlighted with a live countdown */}
          <div className="rounded-2xl bg-sage-600 text-cream p-5 mb-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80 mb-0.5 flex items-center gap-1.5">
                <Clock size={14} /> {ar ? "الصلاة القادمة" : "Next prayer"}
              </p>
              <p className="text-2xl font-extrabold leading-tight">{LABEL[lang][nextKey]}</p>
              <p className="text-sm opacity-90">{time12(data.timings[nextKey], ar)}</p>
            </div>
            <div className="text-end">
              <p className="text-xs opacity-80 mb-0.5">{ar ? "باقٍ" : "in"}</p>
              <p className="text-3xl font-extrabold tabular-nums tracking-tight" dir="ltr">{remaining}</p>
            </div>
          </div>

          {/* The six daily times */}
          <div className="space-y-2">
            {ORDER.map((k) => {
              const Icon = ICON[k];
              const isNext = k === nextKey;
              return (
                <div
                  key={k}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                    isNext ? "border-sage-500 bg-sage-100" : "border-pearl-200 bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-semibold text-pine-800">
                    <Icon size={18} className="text-sage-600" />
                    {LABEL[lang][k]}
                  </span>
                  <span className={`tabular-nums font-bold ${isNext ? "text-sage-700" : "text-slate-600"}`} dir="ltr">
                    {time12(data.timings[k], ar)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 mt-5 text-center">
            {ar
              ? "بتوقيت مدينة الكويت · طريقة الحساب: الكويت (المعهد الوطني للعلوم البحرية)"
              : "Kuwait City time · Calculation method: Kuwait"}
          </p>
        </>
      )}
    </section>
  );
}
