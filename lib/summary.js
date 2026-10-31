// Daily summary: turns today's meals into a few simple numbers and one kind sentence.
// Plain rules, no AI. Returns null when nothing is logged yet.

const LOW_SHARE = 0.6; // eating under 60% of target is worth a gentle nudge

export function dailySummary({ target, meals }) {
  if (meals.length === 0) return null;

  const eaten = meals.reduce((sum, m) => sum + m.kcal, 0);
  const diff = eaten - target; // positive = over budget
  const biggest = meals.reduce((a, b) => (b.kcal > a.kcal ? b : a));

  let status, message;
  if (diff > 0) {
    status = "over";
    message = `${diff} kcal over today. Totally okay. Tomorrow is a fresh start.`;
  } else if (eaten < target * LOW_SHARE) {
    // Never celebrate very low intake: remind them to eat enough.
    status = "low";
    message = "You've eaten quite little so far. Make sure you eat enough today.";
  } else {
    status = "on-track";
    message = `${-diff} kcal to spare. Right on track, well done.`;
  }

  return { eaten, target, diff, status, message, mealCount: meals.length, biggest };
}
