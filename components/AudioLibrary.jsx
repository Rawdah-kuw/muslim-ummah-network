"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Headphones } from "lucide-react";
import SectionHead from "./SectionHead";
import { TRACKS } from "@/lib/data";

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* "عقد اللؤلؤ" — the pearl-string progress bar.
   Each bead fills as playback advances; clicking a bead seeks. */
function PearlString({ ratio, onSeek, total = 28 }) {
  return (
    <div className="flex justify-between items-center gap-0.5 py-1" role="slider"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(ratio * 100)}>
      {Array.from({ length: total }, (_, i) => {
        const filled = (i + 0.5) / total <= ratio;
        return (
          <button key={i} onClick={() => onSeek((i + 0.5) / total)}
            aria-label={`${Math.round(((i + 0.5) / total) * 100)}%`}
            className="rounded-full transition-all duration-300 hover:scale-150"
            style={{
              width: 7, height: 7,
              background: filled ? "#4F7263" : "#EDE9DF",
              transform: filled ? "scale(1.2)" : "scale(1)",
            }} />
        );
      })}
    </div>
  );
}

/* Circular progress ring around the play button — the opening shell */
function PlayRing({ ratio, playing, onClick }) {
  const R = 30, C = 2 * Math.PI * R;
  return (
    <button onClick={onClick} aria-label={playing ? "Pause" : "Play"}
      className="relative w-[68px] h-[68px] shrink-0 rounded-full flex items-center justify-center transition-transform hover:scale-105">
      <svg className="absolute inset-0 -rotate-90" width="68" height="68" viewBox="0 0 68 68" aria-hidden>
        <circle cx="34" cy="34" r={R} fill="none" stroke="#EDE9DF" strokeWidth="3" />
        <circle cx="34" cy="34" r={R} fill="none" stroke="#4F7263" strokeWidth="3"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ratio)}
          style={{ transition: "stroke-dashoffset 0.5s linear" }} />
      </svg>
      <span className={`w-12 h-12 rounded-full flex items-center justify-center text-cream shadow-pine ${playing ? "bg-pinebtn" : "bg-sage-600"}`}>
        {playing ? <Pause size={20} /> : <Play size={20} />}
      </span>
    </button>
  );
}

export default function AudioLibrary({ t, lang }) {
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const audioRef = useRef(null);
  const simRef = useRef(null);

  const stopSim = () => { clearInterval(simRef.current); simRef.current = null; };

  const cleanup = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    stopSim();
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startSim = (track) => {
    // Fallback when the MP3 isn't uploaded yet: simulate playback
    stopSim();
    simRef.current = setInterval(() => {
      setPos((p) => {
        if (p + 1 >= track.dur) { setPlaying(false); stopSim(); return 0; }
        return p + 1;
      });
    }, 1000);
  };

  const toggle = (track) => {
    if (active === track.id) {
      if (playing) {
        audioRef.current ? audioRef.current.pause() : stopSim();
        setPlaying(false);
      } else {
        audioRef.current ? audioRef.current.play() : startSim(track);
        setPlaying(true);
      }
      return;
    }

    cleanup();
    setActive(track.id);
    setPos(0);
    setPlaying(true);

    const el = new Audio(track.src);
    el.addEventListener("timeupdate", () => setPos(el.currentTime));
    el.addEventListener("ended", () => { setPlaying(false); setPos(0); });
    el.addEventListener("error", () => { audioRef.current = null; startSim(track); });
    el.play().then(() => { audioRef.current = el; })
      .catch(() => { audioRef.current = null; startSim(track); });
  };

  const seek = (track, ratio) => {
    if (active !== track.id) return;
    const target = ratio * track.dur;
    if (audioRef.current) audioRef.current.currentTime = target;
    setPos(target);
  };

  return (
    <section id="audio" className="py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead icon={Headphones} kicker={t.audioKicker} title={t.audioTitle} desc={t.audioDesc} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRACKS.map((tr) => {
            const isActive = active === tr.id;
            const isPlaying = isActive && playing;
            const ratio = isActive ? Math.min(pos / tr.dur, 1) : 0;
            return (
              <div key={tr.id}
                className={`rounded-2xl p-6 border transition-all ${
                  isActive ? "border-sage-300 bg-sage-100" : "border-pearl-200 bg-pearl-50"
                }`}>
                <div className="flex items-center gap-4 mb-4">
                  <PlayRing ratio={ratio} playing={isPlaying} onClick={() => toggle(tr)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold truncate text-ink">{tr.title[lang]}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-pearl-300 text-slate-500 shrink-0">
                        {tr.tag[lang]}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{tr.sub[lang]}</p>
                    <p className="text-xs text-slate-500 mt-1" dir="ltr">
                      {isActive ? fmt(pos) : "0:00"} / {fmt(tr.dur)}
                    </p>
                  </div>
                </div>
                <PearlString ratio={ratio} onSeek={(r) => seek(tr, r)} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
