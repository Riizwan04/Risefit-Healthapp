// Sticky top bar: app name, "Change goal", and a row of chips to switch screens.
// The chip row scrolls sideways if more chips are added later.
const TABS = [
  { id: "today", label: "Today" },
  { id: "summary", label: "Summary" },
  { id: "workout", label: "Workout" },
  { id: "week", label: "7 days" },
];

export default function TabBar({ tab, onTab, onChangeGoal }) {
  return (
    <div className="sticky top-0 z-10 -mx-4 bg-[#070b0a]/90 px-4 pb-3 pt-1 backdrop-blur">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-emerald-400">RiseFit</h1>
        <button onClick={onChangeGoal} className="text-sm text-slate-400 underline">
          Change goal
        </button>
      </div>

      <div
        role="tablist"
        className="mt-3 flex gap-1.5 overflow-x-auto [scrollbar-width:none]"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => onTab(t.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === t.id
                ? "bg-emerald-600 text-white"
                : "border border-white/15 bg-white/5 text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
