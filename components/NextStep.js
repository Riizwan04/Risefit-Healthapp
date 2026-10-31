import { tipOfDay } from "@/lib/tips";

// One clear next action, plus the tip of the day. Emerald only: no red, no guilt.
export default function NextStep({ step, onAction }) {
  return (
    <div className="glass relative mt-4 overflow-hidden border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 to-transparent p-4">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/30 blur-2xl" />
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Next step</p>
      <p className="mt-1 text-base font-semibold text-slate-100">{step.title}</p>
      <p className="mt-1 text-sm text-slate-300">{step.text}</p>
      {step.action && (
        <button
          onClick={() => onAction(step.action)}
          className="mt-3 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_22px_rgba(16,185,129,0.4)] px-4 py-2 text-sm font-semibold text-white"
        >
          {step.action === "log" ? "Log a meal" : "Open workout"}
        </button>
      )}
      <p className="mt-3 border-t border-emerald-400/20 pt-3 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Tip of the day: </span>
        {tipOfDay()}
      </p>
    </div>
  );
}
