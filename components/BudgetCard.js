import Ring from "@/components/Ring";

// Daily budget card: a ring with the kcal left in the middle.
// Emerald when on track, amber when over. Never red (red = safety alerts only).
export default function BudgetCard({ target, eaten }) {
  const left = target - eaten;
  const over = left < 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <p className="text-sm text-slate-400">Today</p>
      <div className="mt-2">
        <Ring value={eaten} max={target} strokeClass={over ? "stroke-amber-400" : "stroke-emerald-500"}>
          <p className={`text-5xl font-bold ${over ? "text-amber-300" : "text-emerald-400"}`}>
            {Math.abs(left)}
          </p>
          <p className="px-6 text-xs text-slate-300">
            {over ? "kcal over today's budget" : "kcal left today"}
          </p>
        </Ring>
      </div>
      <p className="mt-3 text-center text-sm text-slate-400">
        {eaten} of {target} kcal eaten
      </p>
      {over && (
        <p className="mt-2 text-center text-sm text-amber-300">
          No stress. One meal doesn't decide your week.
        </p>
      )}
    </div>
  );
}
