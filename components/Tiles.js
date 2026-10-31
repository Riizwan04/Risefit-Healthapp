"use client";

import { useEffect, useState } from "react";
import { dateStr } from "@/lib/days";
import { loadWater, setWater, loadWorkouts } from "@/lib/progress";

const MAX_GLASSES = 20;

// A soft coloured glow in the tile's corner (the "bento" look).
const Glow = ({ colour }) => (
  <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${colour}`} />
);

// Four glass tiles under the arc: protein, meals, workout and water.
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

  const tile = "glass relative overflow-hidden p-3.5";
  const label = "text-[11px] font-medium uppercase tracking-wide";
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-full border border-teal-400/40 bg-white/5 text-teal-300 disabled:opacity-30";

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className={`${tile} border-sky-400/20`}>
        <Glow colour="bg-sky-400/40" />
        <p className={`${label} relative text-sky-300`}>Protein</p>
        <p className="relative mt-1 text-2xl font-extrabold text-sky-100">
          {protein}
          <span className="text-sm font-semibold"> g</span>
        </p>
      </div>

      <div className={`${tile} border-emerald-400/20`}>
        <Glow colour="bg-emerald-400/40" />
        <p className={`${label} relative text-emerald-300`}>Meals logged</p>
        <p className="relative mt-1 text-2xl font-extrabold text-emerald-100">{meals.length}</p>
      </div>

      <button onClick={() => onTab("workout")} className={`${tile} border-violet-400/20 text-left`}>
        <Glow colour="bg-violet-400/45" />
        <p className={`${label} relative text-violet-300`}>Workout</p>
        <p className="relative mt-1 text-2xl font-extrabold text-violet-100">
          {workoutDone ? "Done ✓" : "Not yet"}
        </p>
      </button>

      <div className={`${tile} border-teal-400/20`}>
        <Glow colour="bg-teal-400/40" />
        <p className={`${label} relative text-teal-300`}>Water</p>
        <div className="relative mt-1 flex items-center justify-between">
          <button className={btn} disabled={water <= 0} onClick={() => changeWater(-1)} aria-label="Less water">
            −
          </button>
          <p className="text-2xl font-extrabold text-teal-100">
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
