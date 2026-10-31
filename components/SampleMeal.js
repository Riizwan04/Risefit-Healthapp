"use client";

import { useState } from "react";
import { demoParse } from "@/lib/demo";

const SAMPLE = "2 rotis, dal and dahi";

// "Try a sample meal": shows what the app does, with no typing and no server call.
// It uses the built-in example estimator, so it is clearly an example.
export default function SampleMeal() {
  const [state, setState] = useState("idle"); // idle | reading | done
  const [result, setResult] = useState(null);

  const run = () => {
    setState("reading");
    setTimeout(() => {
      setResult(demoParse(SAMPLE));
      setState("done");
    }, 700);
  };

  return (
    <div className="rounded-2xl border border-emerald-400/30 bg-white/5 p-4">
      <p className="text-sm font-semibold text-slate-100">See it in 10 seconds</p>

      {state === "idle" && (
        <>
          <p className="mt-1 text-sm text-slate-300">
            Say "{SAMPLE}" and watch RiseFit do the maths.
          </p>
          <button
            onClick={run}
            className="mt-3 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200"
          >
            Try a sample meal
          </button>
        </>
      )}

      {state === "reading" && <p className="mt-3 text-sm text-slate-400">Reading your meal...</p>}

      {state === "done" && result && (
        <div className="mt-3">
          <p className="text-xs text-slate-400">You said: "{SAMPLE}"</p>
          <ul className="mt-2 space-y-1">
            {result.items.map((i) => (
              <li key={i.name} className="flex justify-between rounded-lg bg-white/5 px-3 py-1.5 text-sm text-slate-200">
                <span>
                  {i.qty}x {i.name}
                </span>
                <span>{i.kcal} kcal</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm font-semibold text-emerald-300">Total: {result.total_kcal} kcal</p>
          <p className="mt-1 text-xs text-slate-400">
            An example only. In the app, you describe your own meal or take a photo, and you can fix any item.
          </p>
        </div>
      )}
    </div>
  );
}
