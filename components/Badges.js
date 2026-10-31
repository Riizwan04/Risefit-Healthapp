import { BADGES } from "@/lib/badges";

// The badge shelf. Earned badges are in colour; the rest are soft grey with a hint.
// Nothing here is a streak, and an earned badge stays for good.
export default function Badges({ earned }) {
  const count = BADGES.filter((b) => earned[b.id]).length;
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-200">Your badges</h2>
        <span className="text-xs text-slate-400">
          {count} of {BADGES.length}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">Badges you earn stay for good, in any order.</p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {BADGES.map((b) => {
          const got = !!earned[b.id];
          return (
            <li
              key={b.id}
              className={`flex items-center gap-2 rounded-xl border p-2 ${
                got ? "border-emerald-400/30 bg-emerald-500/10" : "border-white/10 bg-white/5"
              }`}
            >
              <span className={`text-2xl ${got ? "" : "opacity-30 grayscale"}`}>{b.icon}</span>
              <span className="min-w-0">
                <span className={`block text-xs font-semibold ${got ? "text-emerald-100" : "text-slate-400"}`}>
                  {b.title}
                </span>
                {!got && <span className="block text-[11px] text-slate-500">{b.hint}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
