import { weekData, weekStats } from "@/lib/week";

const DAY_LETTER = ["S", "M", "T", "W", "T", "F", "S"];

// Last 7 days as small bars: emerald within budget, amber over, grey if nothing logged.
// Never red. Days with nothing logged are not counted or shown as "missed".
export default function WeekView({ days, target }) {
  const week = weekData(days, target);
  const stats = weekStats(week, target);
  if (stats.loggedDays === 0) return null;

  const top = Math.max(target * 1.3, ...week.map((d) => d.kcal)); // bar scale

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
    </div>
  );
}
