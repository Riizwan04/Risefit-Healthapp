// Shows the catch-up plan under the budget card. Amber/emerald only, never red.
export default function CatchUpCard({ plan }) {
  if (!plan) return null;
  const style =
    plan.tone === "over"
      ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
      : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100";
  return (
    <div className={`mt-4 rounded-xl border p-4 ${style}`}>
      <h2 className="text-sm font-semibold">{plan.title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {plan.lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
