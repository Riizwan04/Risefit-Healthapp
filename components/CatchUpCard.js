// Shows the catch-up plan under the budget card. Amber/emerald only, never red.
export default function CatchUpCard({ plan }) {
  if (!plan) return null;
  const style =
    plan.tone === "over"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-emerald-200 bg-emerald-50 text-emerald-900";
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
