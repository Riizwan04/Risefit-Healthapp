"use client";

import { useEffect, useState } from "react";
import { dateStr } from "@/lib/days";
import { loadWater, loadWorkouts } from "@/lib/progress";

// "Today's highlights": a checklist of what went well. Things not done yet show a grey
// dot, never red and never a warning.
export default function Highlights({ meals, target }) {
  const today = dateStr();
  const [water, setWater] = useState(0);
  const [workout, setWorkout] = useState(false);
  useEffect(() => {
    setWater(loadWater()[today] || 0);
    setWorkout(!!loadWorkouts()[today]);
  }, [today]);

  const eaten = meals.reduce((s, m) => s + m.kcal, 0);
  const protein = meals.reduce((s, m) => s + (m.protein_g || 0), 0);

  const rows = [
    { ok: meals.length > 0, label: `${meals.length} ${meals.length === 1 ? "meal" : "meals"} logged` },
    { ok: meals.length > 0 && eaten <= target, label: "Within today's budget" },
    { ok: protein > 0, label: `${protein} g protein logged` },
    { ok: workout, label: "Workout done" },
    { ok: water > 0, label: `${water} ${water === 1 ? "glass" : "glasses"} of water` },
  ];

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-base font-semibold text-slate-200">Today's highlights</h2>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                r.ok ? "bg-emerald-500 text-white" : "bg-white/10 text-transparent"
              }`}
            >
              ✓
            </span>
            <span className={r.ok ? "text-slate-100" : "text-slate-500"}>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
