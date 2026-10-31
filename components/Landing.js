import PhonePreview from "@/components/PhonePreview";
import SampleMeal from "@/components/SampleMeal";

// First screen: a friendly welcome, a preview of the app, a sample meal, one clear button.
// Everything is our own drawing or CSS (no outside images, so no licensing issues).
const POINTS = [
  { icon: "📸", text: "Snap a photo or type your meal. We estimate the calories." },
  { icon: "🌿", text: "A calm daily budget, with no streaks and no guilt." },
  { icon: "💪", text: "Gentle daily workouts and a simple 7-day view." },
];

// returning = the visitor already has a saved goal: say "Welcome back" and show Continue.
export default function Landing({ onStart, returning = false }) {
  const cta = (
    <button
      onClick={onStart}
      className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-sm active:bg-emerald-700"
    >
      {returning ? "Continue" : "Start your fitness journey"}
    </button>
  );

  return (
    <div className="pt-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 pb-8 text-white shadow-sm">
        {/* Decorative rings and a plate, drawn with SVG */}
        <svg className="absolute -right-8 -top-8 opacity-25" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="10" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="white" strokeWidth="10" strokeDasharray="260 130" />
          <circle cx="100" cy="100" r="34" fill="white" />
        </svg>
        <p className="relative text-sm font-medium text-emerald-100">
          {returning ? "Welcome back to" : "Welcome to"}
        </p>
        <h1 className="relative mt-1 text-5xl font-extrabold tracking-tight">RiseFit</h1>
        <p className="relative mt-3 text-xl font-semibold leading-snug">
          Track your fitness.
          <br />
          Start your journey today.
        </p>
      </div>

      <div className="mt-5">{cta}</div>

      <p className="mt-5 text-center text-slate-300">
        Say what you ate in your own words. We'll do the maths and keep you on
        track, without guilt.
      </p>

      <div className="mt-6">
        <PhonePreview />
      </div>

      <div className="mt-6">
        <SampleMeal />
      </div>

      <ul className="mt-6 space-y-3">
        {POINTS.map((p) => (
          <li key={p.text} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-lg">
              {p.icon}
            </span>
            {p.text}
          </li>
        ))}
      </ul>

      <div className="mt-8">{cta}</div>
      <p className="mt-3 text-center text-xs text-slate-400">
        No signup. Nothing to install. Your meal log is saved on your device, not
        in an account.
      </p>
    </div>
  );
}
