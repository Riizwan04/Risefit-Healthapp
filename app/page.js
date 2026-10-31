"use client";

import { useEffect, useState } from "react";
import { computeTarget, DEFAULT_PROFILE } from "@/lib/budget";
import MealLog from "@/components/MealLog";

const STORAGE_KEY = "risefit.profile"; // everything lives in this browser only
const MEALS_KEY = "risefit.meals"; // { date: "YYYY-MM-DD", items: [...] }

// Today's date in the user's local time, e.g. "2026-10-31".
function todayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// The three one-tap goals on the first screen.
const GOALS = [
  { label: "Lose slowly (-250)", deficit: 250 },
  { label: "Lose steadily (-400)", deficit: 400 },
  { label: "Stay the same (0)", deficit: 0 },
];

// Permanent safety notice, shown on every screen.
function Disclaimer() {
  return (
    <p className="mt-8 rounded-lg border border-slate-200 bg-white p-3 text-center text-xs text-slate-500">
      Not Medical Advice. RiseFit gives general estimates only. It cannot
      diagnose or treat anything. If you feel unwell, see a doctor.
    </p>
  );
}

// First-visit screen: pick a goal, optionally tune your numbers.
function Welcome({ onStart }) {
  const [tuned, setTuned] = useState({ ...DEFAULT_PROFILE });

  // Update one field of the optional "Tune my numbers" form.
  const setField = (key, value) => setTuned((t) => ({ ...t, [key]: value }));

  // Start with the (possibly tuned) profile and the chosen deficit.
  const start = (deficit) =>
    onStart({
      sex: tuned.sex,
      age: Number(tuned.age) || DEFAULT_PROFILE.age,
      heightCm: Number(tuned.heightCm) || DEFAULT_PROFILE.heightCm,
      weightKg: Number(tuned.weightKg) || DEFAULT_PROFILE.weightKg,
      deficit,
    });

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <div>
      <h1 className="mt-6 text-3xl font-bold text-emerald-600">RiseFit</h1>
      <p className="mt-2 text-slate-600">
        Say what you ate in your own words. We'll do the maths and keep you on
        track, without guilt.
      </p>

      <div className="mt-6 space-y-3">
        {GOALS.map((g) => (
          <button
            key={g.deficit}
            onClick={() => start(g.deficit)}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-sm active:bg-emerald-700"
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Optional, collapsed by default */}
      <details className="mt-6 rounded-xl border border-slate-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          Tune my numbers
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <label>
            Sex
            <select
              className={input}
              value={tuned.sex}
              onChange={(e) => setField("sex", e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label>
            Age
            <input
              type="number"
              min="14"
              max="100"
              className={input}
              value={tuned.age}
              onChange={(e) => setField("age", e.target.value)}
            />
          </label>
          <label>
            Height (cm)
            <input
              type="number"
              min="120"
              max="230"
              className={input}
              value={tuned.heightCm}
              onChange={(e) => setField("heightCm", e.target.value)}
            />
          </label>
          <label>
            Weight (kg)
            <input
              type="number"
              min="30"
              max="250"
              className={input}
              value={tuned.weightKg}
              onChange={(e) => setField("weightKg", e.target.value)}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Then tap a goal above. Defaults: male, 23, 172 cm, 72 kg.
        </p>
      </details>
    </div>
  );
}

// Daily budget card: kcal left, eaten of target, progress bar.
function BudgetCard({ target, eaten }) {
  const left = target - eaten;
  const over = left < 0;
  const pct = Math.min((eaten / target) * 100, 100);

  // Emerald when on track, amber when over. Never red (red = safety alerts only).
  const barColor = over ? "bg-amber-500" : "bg-emerald-500";
  const numColor = over ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">Today</p>
      <p className={`mt-1 text-5xl font-bold ${numColor}`}>
        {Math.abs(left)}
      </p>
      <p className="text-sm text-slate-600">
        {over ? "kcal over today's budget" : "kcal left today"}
      </p>

      <div
        className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-sm text-slate-500">
        {eaten} of {target} kcal eaten
      </p>
      {over && (
        <p className="mt-2 text-sm text-amber-700">
          No stress. One meal doesn't decide your week.
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [meals, setMeals] = useState([]); // today's meals only
  const [loaded, setLoaded] = useState(false); // avoids flashing the welcome screen

  // Load the saved profile once, in the browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProfile(JSON.parse(saved));
      // Only keep meals saved today; a new day starts with an empty log.
      const m = JSON.parse(localStorage.getItem(MEALS_KEY) || "null");
      if (m && m.date === todayStr()) setMeals(m.items);
    } catch {
      // Storage blocked or corrupted: just show the welcome screen.
    }
    setLoaded(true);
  }, []);

  const saveProfile = (p) => {
    setProfile(p);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
  };

  // Update the meal list in state and in localStorage.
  const saveMeals = (items) => {
    setMeals(items);
    try {
      localStorage.setItem(
        MEALS_KEY,
        JSON.stringify({ date: todayStr(), items })
      );
    } catch {}
  };

  const eaten = meals.reduce((sum, m) => sum + m.kcal, 0);

  // "Change goal" clears the profile and returns to the first screen.
  const changeGoal = () => {
    setProfile(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  if (!loaded) return null;

  return (
    <>
      {profile ? (
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-emerald-600">RiseFit</h1>
            <button
              onClick={changeGoal}
              className="text-sm text-slate-500 underline"
            >
              Change goal
            </button>
          </div>
          <div className="mt-4">
            <BudgetCard target={computeTarget(profile).target} eaten={eaten} />
          </div>
          <MealLog
            meals={meals}
            onAdd={(meal) => saveMeals([...meals, meal])}
            onRemove={(id) => saveMeals(meals.filter((m) => m.id !== id))}
          />
        </div>
      ) : (
        <Welcome onStart={saveProfile} />
      )}
      <Disclaimer />
    </>
  );
}
