// End-of-day style summary card. Emerald when on track, amber when over, slate
// otherwise. Never red (red is for safety alerts only).
export default function DailySummary({ summary }) {
  if (!summary) return null;

  const border = {
    "on-track": "border-emerald-400/30",
    over: "border-amber-400/30",
  }[summary.status];

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  // One small stat tile.
  const Stat = ({ label, value }) => (
    <div className="rounded-lg bg-white/5 p-2 text-center">
      <p className="text-lg font-semibold text-slate-100">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );

  return (
    <div className={`mt-6 rounded-xl border bg-white/5 p-4 ${border}`}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-200">
          Today's summary
        </h2>
        <span className="text-xs text-slate-400">{today}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="eaten (kcal)" value={summary.eaten} />
        <Stat label="target (kcal)" value={summary.target} />
        <Stat label={summary.mealCount === 1 ? "meal" : "meals"} value={summary.mealCount} />
      </div>

      <p className="mt-3 text-sm text-slate-200">{summary.message}</p>
      <p className="mt-1 text-xs text-slate-400">
        Biggest meal: {summary.biggest.text} ({summary.biggest.kcal} kcal)
      </p>
    </div>
  );
}
