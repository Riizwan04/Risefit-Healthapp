"use client";

import { useState } from "react";
import { weekData, weekStats } from "@/lib/week";

const DAY_LETTER = ["S", "M", "T", "W", "T", "F", "S"];

// Last 7 days as small bars: emerald within budget, amber over, grey if nothing logged.
// Never red. Days with nothing logged are not counted or shown as "missed".
// A "Show insight" button asks the server for one short, friendly sentence.
export default function WeekView({ days, target }) {
  const [insight, setInsight] = useState(null); // { text, source }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const week = weekData(days, target);
  const stats = weekStats(week, target);
  if (stats.loggedDays === 0) return null;

  const top = Math.max(target * 1.3, ...week.map((d) => d.kcal)); // bar scale

  const getInsight = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          // Only days with meals, and only meal names + kcal: nothing else leaves the browser.
          days: week
            .filter((d) => d.logged)
            .map((d) => ({
              date: d.date,
              kcal: d.kcal,
              meals: d.meals.map((m) => ({ text: m.text, kcal: m.kcal })),
            })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setInsight({ text: data.insight, source: data.source });
    } catch {
      setError("I couldn't get an insight right now. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-700">Your last 7 days</h2>

      <div className="mt-3 flex items-end justify-between gap-1" style={{ height: 96 }}>
        {week.map((d) => {
          const color = !d.logged
            ? "bg-slate-200"
            : d.kcal > target
              ? "bg-amber-400"
              : "bg-emerald-500";
          const h = d.logged ? Math.max((d.kcal / top) * 100, 6) : 6;
          return (
            <div key={d.date} className="flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
              <div className={`w-full max-w-[28px] rounded-t ${color}`} style={{ height: `${h}%` }} title={`${d.date}: ${d.kcal} kcal`} />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between gap-1 text-xs text-slate-500">
        {week.map((d) => (
          <span key={d.date} className="flex-1 text-center">
            {DAY_LETTER[new Date(d.date + "T00:00:00").getDay()]}
          </span>
        ))}
      </div>

      <p className="mt-3 text-sm text-slate-700">
        Within budget on {stats.withinDays} of {stats.loggedDays} logged{" "}
        {stats.loggedDays === 1 ? "day" : "days"}. Average {stats.avgKcal} kcal a day.
      </p>

      {insight ? (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          <p>{insight.text}</p>
          <p className="mt-1 text-xs text-emerald-700">
            {insight.source === "ai" ? "AI insight" : "Simple insight"}
          </p>
        </div>
      ) : (
        <button
          onClick={getInsight}
          disabled={loading}
          className="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Show insight"}
        </button>
      )}
      {error && <p className="mt-2 text-sm text-amber-700">{error}</p>}
    </div>
  );
}
