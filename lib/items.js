// Helpers for the items inside a logged meal.
// Each item keeps its per-unit kcal/protein, so changing the quantity
// recalculates in proportion without rounding drift.

// Turn an item from the API into a meal item we can edit.
export function toMealItem(i) {
  const qty = i.qty > 0 ? i.qty : 1;
  return {
    name: i.name,
    qty,
    baseQty: qty, // what the AI estimated, to detect edits
    unitKcal: i.kcal / qty,
    unitProtein: (i.protein_g || 0) / qty,
    hidden_fat: i.hidden_fat || null,
  };
}

export const itemKcal = (i) => Math.round(i.unitKcal * i.qty);
export const itemProtein = (i) => Math.round(i.unitProtein * i.qty);
export const sumKcal = (items) => items.reduce((s, i) => s + itemKcal(i), 0);
export const sumProtein = (items) => items.reduce((s, i) => s + itemProtein(i), 0);

// Where the estimate came from, shown as a small label on each meal.
export const SOURCE_LABEL = {
  ai: "AI estimate",
  demo: "Fallback estimate",
  manual: "Typed by you",
};
