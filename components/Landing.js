// First screen for a new visitor: a friendly welcome and one clear button.
// No images (so no licensing issues): just a colour hero and three short points.
const POINTS = [
  "Snap a photo or type your meal. We estimate the calories.",
  "A calm daily budget, with no streaks and no guilt.",
  "Gentle daily workouts and a simple 7-day view.",
];

// returning = the visitor already has a saved goal: say "Welcome back" and show Continue.
export default function Landing({ onStart, returning = false }) {
  return (
    <div className="pt-4">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-emerald-100">
          {returning ? "Welcome back to" : "Welcome to"}
        </p>
        <h1 className="mt-1 text-4xl font-bold">RiseFit</h1>
        <p className="mt-3 text-lg font-medium">
          Track your fitness. Start your journey today.
        </p>
      </div>

      <p className="mt-5 text-slate-600">
        Say what you ate in your own words. We'll do the maths and keep you on
        track, without guilt.
      </p>

      <ul className="mt-5 space-y-3">
        {POINTS.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm text-slate-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              ✓
            </span>
            {p}
          </li>
        ))}
      </ul>

      <button
        onClick={onStart}
        className="mt-8 w-full rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-sm active:bg-emerald-700"
      >
        {returning ? "Continue" : "Start your fitness journey"}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        No signup. Nothing to install. Your meal log is saved on your device, not
        in an account.
      </p>
    </div>
  );
}
