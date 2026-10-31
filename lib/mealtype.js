// Meal types, and the gentle "missed meal" note. Plain rules, no AI.

export const MEAL_TYPES = ["breakfast", "lunch", "snack", "dinner"];
export const TYPE_LABEL = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
};

// Guess the meal type from the hour of the day (0-23). The user can change it.
export function guessMealType(hour) {
  if (hour >= 5 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 19) return "snack";
  if (hour >= 19 && hour < 23) return "dinner";
  return "snack"; // late night / very early
}

const LUNCH_AFTER = 15; // note appears after 3 pm if no lunch is logged
const DINNER_AFTER = 21; // note appears after 9 pm if no dinner is logged

// Returns a short friendly note, or null when nothing is missing.
// Meals saved before types existed have no type, so we stay quiet for those.
export function missedMealNote(meals, hour) {
  if (meals.some((m) => !m.type)) return null;
  const has = (t) => meals.some((m) => m.type === t);

  if (hour >= DINNER_AFTER && !has("dinner")) {
    return "No dinner logged yet. If you've eaten, add it here when you can.";
  }
  if (hour >= LUNCH_AFTER && hour < DINNER_AFTER && !has("lunch")) {
    return "No lunch logged yet. If you've eaten, add it here when you can.";
  }
  return null;
}
