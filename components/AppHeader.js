// Top of the app: the logo and "Change goal". Navigation lives in the bottom Dock.
export default function AppHeader({ onChangeGoal }) {
  return (
    <div className="flex items-center justify-between pb-2">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-base font-extrabold text-white shadow-[0_0_18px_rgba(16,185,129,0.55)]">
          R
        </span>
        <span className="text-lg font-bold tracking-tight">RiseFit</span>
      </div>
      <button onClick={onChangeGoal} className="text-sm text-slate-400 underline">
        Change goal
      </button>
    </div>
  );
}
