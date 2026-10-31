"use client";

import { useEffect, useState } from "react";
import { todaysWorkout, LEVELS, LEVEL_LABEL } from "@/lib/workout";
import { dateStr, lastDates } from "@/lib/days";

const LEVEL_KEY = "risefit.level";
const DONE_KEY = "risefit.workouts"; // { "YYYY-MM-DD": true }

// "Today's workout": a gentle suggestion for the day, a level switch, and a Done tick.
// General fitness tips only. Emerald and slate colours, never red, no streaks.
export default function WorkoutCard() {
  const [level, setLevel] = useState("beginner");
  const [done, setDone] = useState({});

  // Load saved level and ticks once, in the browser.
  useEffect(() => {
    try {
      const l = localStorage.getItem(LEVEL_KEY);
      if (LEVELS.includes(l)) setLevel(l);
      setDone(JSON.parse(localStorage.getItem(DONE_KEY) || "{}") || {});
    } catch {}
  }, []);

  const today = dateStr();
  const plan = todaysWorkout(new Date(), level);
  const doneToday = !!done[today];
  const doneThisWeek = lastDates(7).filter((d) => done[d]).length;

  const chooseLevel = (l) => {
    setLevel(l);
    try {
      localStorage.setItem(LEVEL_KEY, l);
    } catch {}
  };

  const toggleDone = () => {
    const next = { ...done, [today]: !doneToday };
    if (doneToday) delete next[today];
    setDone(next);
    try {
      localStorage.setItem(DONE_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-700">Today's workout</h2>
        <div className="flex overflow-hidden rounded-lg border border-slate-300 text-xs">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => chooseLevel(l)}
              className={`px-2 py-1 ${level === l ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}
            >
              {LEVEL_LABEL[l]}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-800">
        {plan.title} · about {plan.minutes} min
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {plan.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <button
        onClick={toggleDone}
        className={`mt-3 rounded-lg px-4 py-2 text-sm font-semibold ${
          doneToday ? "bg-emerald-100 text-emerald-800" : "bg-emerald-600 text-white"
        }`}
      >
        {doneToday ? "Done ✓" : "Mark done"}
      </button>
      {doneThisWeek > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          Done on {doneThisWeek} of the last 7 days.
        </p>
      )}

      <p className="mt-3 text-xs text-slate-500">
        General fitness tips, not medical advice. Start easy. Stop if you feel pain,
        dizziness or chest discomfort, and see a doctor if it continues.
      </p>
    </div>
  );
}
