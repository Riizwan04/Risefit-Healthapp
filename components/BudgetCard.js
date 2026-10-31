import SegArc from "@/components/SegArc";

// Daily budget: a segmented arc with the kcal left in the middle.
// Emerald when on track, amber when over. Never red (red = safety alerts only).
export default function BudgetCard({ target, eaten }) {
  const left = target - eaten;
  const over = left < 0;

  return (
    <div className="glass relative overflow-hidden p-4 pb-3">
      <div
        className={`pointer-events-none absolute -top-10 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full blur-3xl ${
          over ? "bg-amber-500/25" : "bg-emerald-500/30"
        }`}
      />
      <p className="relative text-xs font-medium uppercase tracking-wide text-slate-400">Today</p>
      <div className="relative mt-1">
        <SegArc value={eaten} max={target} over={over}>
          <p className={`text-xs font-medium ${over ? "text-amber-300" : "text-emerald-300"}`}>
            {over ? "a little over" : "on track"}
          </p>
          <p className={`text-5xl font-extrabold tracking-tight ${over ? "text-amber-300" : "text-emerald-300"}`}>
            {Math.abs(left)}
          </p>
          <p className="text-xs text-slate-300">
            {over ? "kcal over today's budget" : "kcal left today"}
          </p>
        </SegArc>
      </div>
      <p className="relative mt-1 text-center text-sm text-slate-400">
        {eaten} of {target} kcal eaten
      </p>
      {over && (
        <p className="relative mt-2 text-center text-sm text-amber-300">
          No stress. One meal doesn't decide your week.
        </p>
      )}
    </div>
  );
}
