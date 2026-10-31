import Thali from "@/components/Thali";
import SampleMeal from "@/components/SampleMeal";

// First screen: a welcome, a drawn thali with floating kcal tags, one clear button.
// Everything is our own drawing or CSS (no outside images, so no licensing issues).
const POINTS = [
  { icon: "📸", text: "Snap a photo or type your meal. We estimate the calories." },
  { icon: "🌿", text: "A calm daily budget, with no streaks and no guilt." },
  { icon: "💪", text: "Gentle daily workouts and a simple 7-day view." },
];

// A small floating label pointing at part of the plate.
const Tag = ({ className, name, kcal }) => (
  <span
    className={`absolute whitespace-nowrap rounded-xl border border-white/15 bg-black/70 px-3 py-1.5 text-xs backdrop-blur ${className}`}
  >
    <b className="text-emerald-300">{name}</b> · {kcal} kcal
  </span>
);

// returning = the visitor already has a saved goal: say "Welcome back". The button reads the
// same for everyone, but for a returning visitor it opens their saved app.
export default function Landing({ onStart, returning = false }) {
  const cta = (
    <button
      onClick={onStart}
      className="w-full rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 px-4 py-4 text-base font-bold text-white shadow-[0_0_34px_rgba(16,185,129,0.5)] active:brightness-90"
    >
      Start your fitness journey
    </button>
  );

  return (
    <div className="pt-2">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-base font-extrabold shadow-[0_0_18px_rgba(16,185,129,0.55)]">
          R
        </span>
        <div>
          <p className="text-sm font-bold leading-tight">RiseFit</p>
          <p className="text-xs leading-tight text-slate-400">
            {returning ? "Welcome back to" : "Welcome to"} RiseFit
          </p>
        </div>
      </div>

      {/* Hero: plate with floating tags */}
      <div className="relative mx-auto mt-4 h-[300px] w-full max-w-[340px]">
        <div className="pointer-events-none absolute left-1/2 top-4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/35 blur-3xl" />
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <Thali size={250} />
        </div>
        <Tag className="left-0 top-2" name="2 rotis" kcal="200" />
        <Tag className="right-0 top-14" name="Dal" kcal="180" />
        <Tag className="bottom-0 left-16" name="Dahi" kcal="100" />
      </div>

      <h1 className="mt-4 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight">
        Your food,
        <br />
        <span className="bg-gradient-to-r from-emerald-300 via-emerald-500 to-violet-400 bg-clip-text text-transparent">
          decoded.
        </span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        Track your fitness. Start your journey today. Say what you ate in your own
        words. We'll do the maths and keep you on track, without guilt.
      </p>

      <div className="mt-5">{cta}</div>
      <p className="mt-3 text-center text-xs text-slate-500">
        No signup. Nothing to install. Your meal log is saved on your device, not
        in an account.
      </p>

      <div className="mt-6">
        <SampleMeal />
      </div>

      <ul className="mt-6 space-y-3">
        {POINTS.map((p) => (
          <li key={p.text} className="glass flex items-center gap-3 p-3 text-sm text-slate-200">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-lg">
              {p.icon}
            </span>
            {p.text}
          </li>
        ))}
      </ul>

    </div>
  );
}
