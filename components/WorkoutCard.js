"use client";

import { useEffect, useRef, useState } from "react";
import { todaysWorkout, sessionType, weekDates, SESSION_ICON, LEVELS, LEVEL_LABEL } from "@/lib/workout";
import { dateStr, lastDates } from "@/lib/days";
import { loadWorkouts, setWorkoutDone, loadTicks, setTicksFor } from "@/lib/progress";

const LEVEL_KEY = "risefit.level";
const DAY_LETTER = ["M", "T", "W", "T", "F", "S", "S"];

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// Today's workout: a Monday-to-Sunday strip, a gentle suggestion for the day, a tick for
// each exercise, and a session timer. General fitness tips only. Violet and emerald,
// never red, no streaks.
export default function WorkoutCard() {
  const [level, setLevel] = useState("beginner");
  const [done, setDone] = useState({}); // { date: true }
  const [ticks, setTicks] = useState({}); // { exerciseId: true } for today

  const today = dateStr();
  const plan = todaysWorkout(new Date(), level);

  // --- timer: counts down plan.minutes. It uses an end time, so it stays right if the tab sleeps.
  const [remaining, setRemaining] = useState(plan.minutes * 60);
  const [endAt, setEndAt] = useState(null); // ms timestamp while running
  const timer = useRef(null);

  // Load saved level, ticks and done-days once, in the browser.
  useEffect(() => {
    try {
      const l = localStorage.getItem(LEVEL_KEY);
      if (LEVELS.includes(l)) setLevel(l);
    } catch {}
    setDone(loadWorkouts());
    setTicks(loadTicks()[today] || {});
  }, [today]);

  // A new level means a new duration: reset the timer.
  useEffect(() => {
    setEndAt(null);
    setRemaining(plan.minutes * 60);
  }, [plan.minutes]);

  // Tick the countdown once a second while running.
  useEffect(() => {
    if (!endAt) return;
    timer.current = setInterval(() => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(timer.current);
        setEndAt(null);
      }
    }, 500);
    return () => clearInterval(timer.current);
  }, [endAt]);

  const doneToday = !!done[today];
  const doneThisWeek = lastDates(7).filter((d) => done[d]).length;
  const finished = remaining === 0;

  const chooseLevel = (l) => {
    setLevel(l);
    try {
      localStorage.setItem(LEVEL_KEY, l);
    } catch {}
  };

  const markDone = (value) => {
    setWorkoutDone(today, value);
    setDone(loadWorkouts());
  };

  // Tick an exercise; when every exercise is ticked, the workout counts as done.
  const toggleTick = (id) => {
    const next = { ...ticks, [id]: !ticks[id] };
    if (!next[id]) delete next[id];
    setTicks(next);
    setTicksFor(today, next);
    if (plan.items.every((it) => next[it.id])) markDone(true);
  };

  return (
    <div className="mt-2 space-y-4">
      {/* Monday-to-Sunday strip */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-medium text-slate-400">This week</p>
        <div className="mt-2 flex justify-between">
          {weekDates().map((d, i) => {
            const key = dateStr(d);
            const isToday = key === today;
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <span className="text-xs text-slate-400">{DAY_LETTER[i]}</span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${
                    done[key]
                      ? "bg-violet-600 text-white"
                      : isToday
                        ? "border-2 border-violet-400 bg-violet-500/10"
                        : "bg-white/10"
                  }`}
                >
                  {done[key] ? "✓" : SESSION_ICON[sessionType(d)]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-200">Today's workout</h2>
          <div className="flex overflow-hidden rounded-lg border border-white/15 text-xs">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => chooseLevel(l)}
                className={`px-2 py-1 ${level === l ? "bg-violet-600 text-white" : "bg-white/5 text-slate-300"}`}
              >
                {LEVEL_LABEL[l]}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm font-medium text-slate-100">
          {plan.title} · about {plan.minutes} min
        </p>

        {/* Timer */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-violet-500/10 p-3">
          <p className="text-3xl font-bold tabular-nums text-violet-100">{mmss(remaining)}</p>
          <div className="flex gap-2">
            {endAt ? (
              <button
                onClick={() => setEndAt(null)}
                className="rounded-lg border border-violet-400/40 bg-white/5 px-3 py-2 text-sm font-semibold text-violet-200"
              >
                Pause
              </button>
            ) : (
              !finished && (
                <button
                  onClick={() => setEndAt(Date.now() + remaining * 1000)}
                  className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  {remaining === plan.minutes * 60 ? "Start timer" : "Resume"}
                </button>
              )
            )}
            {(remaining !== plan.minutes * 60 || endAt) && (
              <button
                onClick={() => {
                  setEndAt(null);
                  setRemaining(plan.minutes * 60);
                }}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-300"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        {finished && <p className="mt-2 text-sm font-medium text-violet-200">Time's up. Nice work!</p>}

        {/* Exercise cards with a tick each */}
        <ul className="mt-3 space-y-2">
          {plan.items.map((it) => (
            <li key={it.id}>
              <button
                onClick={() => toggleTick(it.id)}
                aria-pressed={!!ticks[it.id]}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                  ticks[it.id] ? "border-violet-400/30 bg-violet-500/10" : "border-white/10 bg-white/5"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xl">
                  {it.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-100">{it.name}</span>
                  <span className="block text-xs text-slate-400">{it.detail}</span>
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                    ticks[it.id] ? "border-violet-600 bg-violet-600 text-white" : "border-white/15 text-transparent"
                  }`}
                >
                  ✓
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-400">{plan.note}</p>

        <button
          onClick={() => markDone(!doneToday)}
          className={`mt-3 rounded-lg px-4 py-2 text-sm font-semibold ${
            doneToday ? "bg-violet-500/20 text-violet-200" : "bg-violet-600 text-white"
          }`}
        >
          {doneToday ? "Done ✓" : "Mark done"}
        </button>
        {doneThisWeek > 0 && (
          <p className="mt-2 text-xs text-slate-400">Done on {doneThisWeek} of the last 7 days.</p>
        )}

        <p className="mt-3 text-xs text-slate-400">
          General fitness tips, not medical advice. Start easy. Stop if you feel pain,
          dizziness or chest discomfort, and see a doctor if it continues.
        </p>
      </div>
    </div>
  );
}
