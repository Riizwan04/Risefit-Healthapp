"use client";

import { useState } from "react";

// Add-meal form plus today's list of meals.
// The parent owns the data; this component only reports changes.
export default function MealLog({ meals, onAdd, onRemove }) {
  const [text, setText] = useState("");
  const [kcal, setKcal] = useState("");

  const kcalNum = Math.round(Number(kcal));
  // Accept 1-5000 kcal so typos like 50000 can't wreck the budget.
  const valid = text.trim() !== "" && kcalNum >= 1 && kcalNum <= 5000;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onAdd({ id: Date.now(), text: text.trim(), kcal: kcalNum });
    setText("");
    setKcal("");
  };

  const field =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-slate-700">Log a meal</h2>

      <form onSubmit={submit} className="mt-2 flex gap-2">
        <input
          className={`${field} min-w-0 flex-1`}
          placeholder="What did you eat?"
          maxLength={80}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          className={`${field} w-20`}
          type="number"
          inputMode="numeric"
          placeholder="kcal"
          min="1"
          max="5000"
          value={kcal}
          onChange={(e) => setKcal(e.target.value)}
        />
        <button
          type="submit"
          disabled={!valid}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
        >
          Add
        </button>
      </form>

      {meals.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nothing logged yet today.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {meals.map((m) => (
            <li key={m.id} className="flex items-center justify-between px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-sm">{m.text}</span>
              <span className="ml-3 text-sm text-slate-600">{m.kcal} kcal</span>
              {/* Slate, not red: removing a meal isn't a danger action */}
              <button
                onClick={() => onRemove(m.id)}
                className="ml-3 text-sm text-slate-400"
                aria-label={`Remove ${m.text}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
