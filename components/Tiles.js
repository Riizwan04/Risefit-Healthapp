"use client";

import { useEffect, useState } from "react";
import { dateStr } from "@/lib/days";
import { loadWater, setWater, loadWorkouts } from "@/lib/progress";

const MAX_GLASSES = 20;

// Four small colour tiles under the ring: protein, meals, workout and water.
// Emerald = food, sky = protein, violet = workout, teal = water.
// (Amber and red are never used here: amber means over budget, red means a safety alert.)
export default function Tiles({ meals, onTab, onChange }) {
  const today = dateStr();
  const [water, setWaterState] = useState(0);
  const [workoutDone, setWorkoutDone] = useState(false);

  useEffect(() => {
    setWaterState(loadWater()[today] || 0);
    setWorkoutDone(!!loadWorkouts()[today]);
  }, [today]);

  const protein = meals.reduce((s, m) => s + (m.protein_g || 0), 0);

  const changeWater = (delta) => {
    const next = Math.min(Math.max(water + delta, 0), MAX_GLASSES);
    setWaterState(next);
    setWater(today, next);
    onChange?.(); // lets the page refresh the "next step" card
  };

  const tile = "rounded-xl border p-3";
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-full border border-teal-400/40 bg-white/5 text-teal-300 disabled:opacity-30";

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className={`${tile} border-sky-400/20 bg-sky-500/10`}>
        <p className="text-xs text-sky-300">Protein</p>
        <p className="mt-1 text-xl font-semibold text-sky-100">{protein} g</p>
      </div>

      <div className={`${tile} border-emerald-400/20 bg-emerald-500/10`}>
        <p className="text-xs text-emerald-300">Meals logged</p>
        <p className="mt-1 text-xl font-semibold text-emerald-100">{meals.length}</p>
      </div>

      <button
        onClick={() => onTab("workout")}
        className={`${tile} border-violet-400/20 bg-violet-500/10 text-left`}
      >
        <p className="text-xs text-violet-300">Workout</p>
        <p className="mt-1 text-xl font-semibold text-violet-100">
          {workoutDone ? "Done ✓" : "Not yet"}
        </p>
      </button>

      <div className={`${tile} border-teal-400/20 bg-teal-500/10`}>
        <p className="text-xs text-teal-300">Water</p>
        <div className="mt-1 flex items-center justify-between">
          <button className={btn} disabled={water <= 0} onClick={() => changeWater(-1)} aria-label="Less water">
            −
          </button>
          <p className="text-xl font-semibold text-teal-100">
            {water} <span className="text-xs font-normal">glasses</span>
          </p>
          <button className={btn} disabled={water >= MAX_GLASSES} onClick={() => changeWater(1)} aria-label="More water">
            +
          </button>
        </div>
      </div>
    </div>
  );
}
