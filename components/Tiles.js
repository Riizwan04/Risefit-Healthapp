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
    "flex h-7 w-7 items-center justify-center rounded-full border border-teal-300 bg-white text-teal-700 disabled:opacity-30";

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className={`${tile} border-sky-100 bg-sky-50`}>
        <p className="text-xs text-sky-700">Protein</p>
        <p className="mt-1 text-xl font-semibold text-sky-900">{protein} g</p>
      </div>

      <div className={`${tile} border-emerald-100 bg-emerald-50`}>
        <p className="text-xs text-emerald-700">Meals logged</p>
        <p className="mt-1 text-xl font-semibold text-emerald-900">{meals.length}</p>
      </div>

      <button
        onClick={() => onTab("workout")}
        className={`${tile} border-violet-100 bg-violet-50 text-left`}
      >
        <p className="text-xs text-violet-700">Workout</p>
        <p className="mt-1 text-xl font-semibold text-violet-900">
          {workoutDone ? "Done ✓" : "Not yet"}
        </p>
      </button>

      <div className={`${tile} border-teal-100 bg-teal-50`}>
        <p className="text-xs text-teal-700">Water</p>
        <div className="mt-1 flex items-center justify-between">
          <button className={btn} disabled={water <= 0} onClick={() => changeWater(-1)} aria-label="Less water">
            −
          </button>
          <p className="text-xl font-semibold text-teal-900">
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
