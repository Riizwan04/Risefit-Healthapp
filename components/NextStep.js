import { tipOfDay } from "@/lib/tips";

// One clear next action, plus the tip of the day. Emerald only: no red, no guilt.
export default function NextStep({ step, onAction }) {
  return (
    <div className="mt-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Next step</p>
      <p className="mt-1 text-base font-semibold text-slate-800">{step.title}</p>
      <p className="mt-1 text-sm text-slate-600">{step.text}</p>
      {step.action && (
        <button
          onClick={() => onAction(step.action)}
          className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {step.action === "log" ? "Log a meal" : "Open workout"}
        </button>
      )}
      <p className="mt-3 border-t border-emerald-100 pt-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-600">Tip of the day: </span>
        {tipOfDay()}
      </p>
    </div>
  );
}
