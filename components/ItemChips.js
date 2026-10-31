import { itemKcal, itemProtein } from "@/lib/items";

const MIN_QTY = 0.5; // half portions are allowed ("half a cup of rice")
const MAX_QTY = 20;
const STEP = 0.5;

// One chip per food item: "2x roti · 200 kcal · 6 g protein",
// plus a small "hidden fat" note when the AI allowed for oil/ghee/butter.
// If onChange is given, each chip gets a -/+ stepper for the quantity.
export default function ItemChips({ items, onChange }) {
  const stepBtn =
    "flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-sm text-slate-600 disabled:opacity-30";

  return (
    <ul className="space-y-1.5">
      {items.map((it, idx) => (
        <li key={idx}>
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
            {onChange && (
              <button
                type="button"
                className={stepBtn}
                disabled={it.qty <= MIN_QTY}
                onClick={() => onChange(idx, it.qty - STEP)}
                aria-label={`Less ${it.name}`}
              >
                −
              </button>
            )}
            <span>
              {it.qty}x {it.name} · {itemKcal(it)} kcal · {itemProtein(it)} g protein
            </span>
            {onChange && (
              <button
                type="button"
                className={stepBtn}
                disabled={it.qty >= MAX_QTY}
                onClick={() => onChange(idx, it.qty + STEP)}
                aria-label={`More ${it.name}`}
              >
                +
              </button>
            )}
          </div>
          {it.hidden_fat && (
            <p className="ml-1 mt-0.5 text-xs text-slate-500">
              Hidden fat: {it.hidden_fat}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
