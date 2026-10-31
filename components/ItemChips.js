import { itemKcal, itemProtein } from "@/lib/items";

// One chip per food item: "2x roti · 200 kcal · 6 g protein",
// plus a small "hidden fat" note when the AI allowed for oil/ghee/butter.
export default function ItemChips({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, idx) => (
        <li key={idx}>
          <span className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
            {it.qty}x {it.name} · {itemKcal(it)} kcal · {itemProtein(it)} g protein
          </span>
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
