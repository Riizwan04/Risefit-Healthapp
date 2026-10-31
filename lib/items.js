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

// Return a copy of items with one item's quantity changed.
export function setItemQty(items, index, qty) {
  return items.map((it, i) => (i === index ? { ...it, qty } : it));
}

// Return a copy of a logged meal with one item's quantity changed
// and the meal totals recalculated.
export function withQty(meal, index, qty) {
  const items = setItemQty(meal.items, index, qty);
  return { ...meal, items, kcal: sumKcal(items), protein_g: sumProtein(items) };
}

// A meal counts as "edited" if any quantity differs from the AI's estimate.
export const isEdited = (meal) =>
  !!meal.items && meal.items.some((i) => i.qty !== i.baseQty);
