// Catch-up plan (F09): a gentle, guilt-free rebalance after a heavy meal or
// going over budget. Plain rules, no AI call, so it is instant and predictable.
// It never tells anyone to skip meals or eat very little.

const LIGHT_MEAL_MIN = 350; // never suggest a next meal smaller than this
const LIGHT_MEAL_MAX = 450;
const HEAVY_MEAL_SHARE = 0.4; // one meal >= 40% of the daily target counts as "heavy"
const WALK_KCAL_PER_MIN_PER_KG = 0.061; // ~3.5 MET brisk walk: 3.5*3.5/200

// Returns null (no plan needed) or { tone, title, lines[] }.
export function catchUpPlan({ target, meals, weightKg = 72 }) {
  const eaten = meals.reduce((sum, m) => sum + m.kcal, 0);
  const left = target - eaten;
  const biggest = meals.reduce((max, m) => Math.max(max, m.kcal), 0);

  // Case 1: over budget. Offer a walk, a light next meal, and reassurance.
  if (left < 0) {
    const over = -left;
    const perMin = WALK_KCAL_PER_MIN_PER_KG * weightKg;
    // Round to 5 minutes, keep it realistic (10 to 45 min).
    const walk = Math.min(Math.max(Math.round(over / perMin / 5) * 5, 10), 45);
    return {
      tone: "over",
      title: "Catch-up plan",
      lines: [
        `You're ${over} kcal over. That's one day, not a failure.`,
        `Take a ${walk}-minute brisk walk this evening.`,
        `Keep your next meal light (about ${LIGHT_MEAL_MAX} kcal): dal with sabzi, or paneer with salad.`,
        "Don't skip meals. Tomorrow's target stays the same.",
      ],
    };
  }

  // Case 2: a heavy meal but still within budget. Plan the rest of the day.
  if (biggest >= target * HEAVY_MEAL_SHARE) {
    // If less than a small meal is left, say so honestly: a little over is fine, skipping is not.
    const nextLine =
      left < LIGHT_MEAL_MIN
        ? `Only ${left} kcal left, so keep your next meal light (about ${LIGHT_MEAL_MIN} kcal). Going a little over is fine; skipping is not.`
        : `Keep your next meal around ${Math.min(left, LIGHT_MEAL_MAX)} kcal: dal, sabzi or paneer with salad.`;
    return {
      tone: "heavy",
      title: "Heavy meal? Easy fix.",
      lines: [
        `You have ${left} kcal left today.`,
        nextLine,
        "A 15-minute walk after eating also helps.",
      ],
    };
  }

  return null; // on track: no plan needed
}
