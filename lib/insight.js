// Fallback insight (no AI): one calm sentence from the week's numbers.
// days: [{ date, kcal, meals: [{ text, kcal }] }] for days that have meals.

export function ruleInsight(days, target) {
  if (days.length < 2) return "Log a couple more days and I'll show you patterns.";

  const within = days.filter((d) => d.kcal <= target).length;
  const allMeals = days.flatMap((d) => d.meals);
  const biggest = allMeals.reduce((a, b) => (b.kcal > a.kcal ? b : a), allMeals[0]);

  return `You were within budget on ${within} of ${days.length} logged days. Your biggest meal was ${biggest.text} (${biggest.kcal} kcal).`;
}
