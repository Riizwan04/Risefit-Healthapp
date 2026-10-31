// Floating bottom dock: one icon per screen. The active one glows in its own colour.
// (Amber and red are never used here: amber means over budget, red means a safety alert.)
const TABS = [
  {
    id: "today",
    label: "Today",
    active: "from-emerald-400 to-emerald-700 shadow-[0_0_22px_rgba(16,185,129,0.7)]",
    icon: <path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />,
  },
  {
    id: "summary",
    label: "Summary",
    active: "from-sky-400 to-sky-700 shadow-[0_0_22px_rgba(56,189,248,0.65)]",
    icon: <path d="M5 20V10M12 20V4M19 20v-7" />,
  },
  {
    id: "workout",
    label: "Workout",
    active: "from-violet-400 to-violet-700 shadow-[0_0_22px_rgba(167,139,250,0.7)]",
    icon: <path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12" />,
  },
  {
    id: "week",
    label: "7 days",
    active: "from-teal-400 to-teal-700 shadow-[0_0_22px_rgba(45,212,191,0.65)]",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
];

export default function Dock({ tab, onTab }) {
  return (
    <nav
      role="tablist"
      className="fixed inset-x-0 bottom-4 z-20 mx-auto flex w-[calc(100%-2rem)] max-w-[26rem] items-center justify-around rounded-full border border-white/10 bg-black/80 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-xl"
    >
      {TABS.map((t) => {
        const on = tab === t.id;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onTab(t.id)}
            className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium ${
              on ? `bg-gradient-to-br text-white ${t.active}` : "text-slate-400"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {t.icon}
            </svg>
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
