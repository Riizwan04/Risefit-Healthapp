"use client";

import { useEffect, useState } from "react";
import { computeTarget, DEFAULT_PROFILE } from "@/lib/budget";
import MealLog from "@/components/MealLog";
import CatchUpCard from "@/components/CatchUpCard";
import NextStep from "@/components/NextStep";
import Greeting from "@/components/Greeting";
import { nextStep } from "@/lib/nextstep";
import { loadWater, loadWorkouts } from "@/lib/progress";
import DailySummary from "@/components/DailySummary";
import { dailySummary } from "@/lib/summary";
import WeekView from "@/components/WeekView";
import WorkoutCard from "@/components/WorkoutCard";
import TabBar from "@/components/TabBar";
import BudgetCard from "@/components/BudgetCard";
import Tiles from "@/components/Tiles";
import Landing from "@/components/Landing";
import { weekData, weekStats } from "@/lib/week";
import { catchUpPlan } from "@/lib/catchup";
import { dateStr, loadDays, saveDays, withDay } from "@/lib/days";

const STORAGE_KEY = "risefit.profile"; // everything lives in this browser only

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
function Welcome({ onStart, onBack }) {
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
      <button onClick={onBack} className="text-sm text-slate-500 underline">
        Back
      </button>
      <h1 className="mt-4 text-3xl font-bold text-emerald-600">What's your goal?</h1>
      <p className="mt-2 text-slate-600">
        Pick one to begin. You can change it any time.
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

// Shown on a tab that has nothing to display yet, with a shortcut to log a meal.
function EmptyTab({ text, onLog }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-center">
      <p className="text-sm text-slate-600">{text}</p>
      <button
        onClick={onLog}
        className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Log a meal
      </button>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState("today"); // today | summary | workout | week
  // landing (every time the app opens) -> goal (new visitors) or app (returning visitors)
  const [step, setStep] = useState("landing");
  const [welcomeBack, setWelcomeBack] = useState(false); // true after a few days away
  const [, setTick] = useState(0); // bump to re-render after water changes
  const [profile, setProfile] = useState(null);
  const [days, setDays] = useState({}); // { "YYYY-MM-DD": [meals] } for recent days
  const [loaded, setLoaded] = useState(false); // avoids flashing the welcome screen

  // Load the saved profile once, in the browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProfile(JSON.parse(saved));
    } catch {
      // Storage blocked or corrupted: just show the welcome screen.
    }
    setDays(loadDays());
    // Remember the last visit; after 2+ days away show a warm welcome (never a count of missed days).
    try {
      const last = localStorage.getItem("risefit.lastVisit");
      if (last) {
        const gap = (new Date(dateStr() + "T00:00:00") - new Date(last + "T00:00:00")) / 86400000;
        setWelcomeBack(gap >= 2);
      }
      localStorage.setItem("risefit.lastVisit", dateStr());
    } catch {}
    setLoaded(true);
  }, []);

  const saveProfile = (p) => {
    setProfile(p);
    setStep("app");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
  };

  // Today's meals come from the history; a new day starts with an empty list.
  const today = dateStr();
  const meals = days[today] || [];

  // Replace today's meals, in state and in localStorage.
  const saveMeals = (items) => {
    const next = withDay(days, today, items);
    setDays(next);
    saveDays(next);
  };

  const eaten = meals.reduce((sum, m) => sum + m.kcal, 0);

  // "Change goal" clears the profile and returns to the first screen.
  const changeGoal = () => {
    setProfile(null);
    setTab("today");
    setStep("goal"); // go straight to the goal picker, skip the landing
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Numbers shared by several tabs.
  const target = profile ? computeTarget(profile).target : 0;
  const summary = profile ? dailySummary({ target, meals }) : null;
  const hasWeekData = profile ? weekStats(weekData(days, target), target).loggedDays > 0 : false;

  if (!loaded) return null;

  return (
    <>
      {step === "landing" ? (
        <Landing
          returning={!!profile}
          onStart={() => setStep(profile ? "app" : "goal")}
        />
      ) : profile ? (
        <div>
          <TabBar tab={tab} onTab={setTab} onChangeGoal={changeGoal} />

          {/* Today: the daily flow (budget, guidance, log a meal) */}
          {tab === "today" && (
            <>
              <Greeting welcomeBack={welcomeBack} />
              <div className="mt-3">
                <BudgetCard target={target} eaten={eaten} />
              </div>
              <Tiles meals={meals} onTab={setTab} onChange={() => setTick((t) => t + 1)} />
              <NextStep
                step={nextStep({
                  hour: new Date().getHours(),
                  meals,
                  workoutDone: !!loadWorkouts()[dateStr()],
                  water: loadWater()[dateStr()] || 0,
                })}
                onAction={(a) => {
                  if (a === "workout") return setTab("workout");
                  document.getElementById("log-meal")?.scrollIntoView({ behavior: "smooth" });
                  document.querySelector("#log-meal input[type=text], #log-meal input:not([type])")?.focus();
                }}
              />
              <CatchUpCard plan={catchUpPlan({ target, meals, weightKg: profile.weightKg })} />
              <MealLog
                meals={meals}
                onAdd={(meal) => saveMeals([...meals, meal])}
                onRemove={(id) => saveMeals(meals.filter((m) => m.id !== id))}
                onUpdate={(id, updated) =>
                  saveMeals(meals.map((m) => (m.id === id ? updated : m)))
                }
              />
            </>
          )}

          {tab === "summary" &&
            (summary ? (
              <DailySummary summary={summary} />
            ) : (
              <EmptyTab text="Log a meal to see your summary for today." onLog={() => setTab("today")} />
            ))}

          {tab === "workout" && <WorkoutCard />}

          {tab === "week" &&
            (hasWeekData ? (
              <WeekView days={days} target={target} />
            ) : (
              <EmptyTab text="Log a meal to start your 7-day view." onLog={() => setTab("today")} />
            ))}
        </div>
      ) : (
        <Welcome onStart={saveProfile} onBack={() => setStep("landing")} />
      )}
      <Disclaimer />
    </>
  );
}
