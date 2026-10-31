// Daily summary: turns today's meals into a few simple numbers and one kind sentence.
// Plain rules, no AI. Returns null when nothing is logged yet.

const CLOSE_SHARE = 0.6; // below this, "right on track" would sound odd, so stay neutral

export function dailySummary({ target, meals }) {
  if (meals.length === 0) return null;

  const eaten = meals.reduce((sum, m) => sum + m.kcal, 0);
  const diff = eaten - target; // positive = over budget
  const biggest = meals.reduce((a, b) => (b.kcal > a.kcal ? b : a));

  let status, message;
  if (diff > 0) {
    status = "over";
    message = `${diff} kcal over today. Totally okay. Tomorrow is a fresh start.`;
  } else if (eaten < target * CLOSE_SHARE) {
    // Early in the day: just state the facts. No nagging, no praise.
    status = "on-track";
    message = `${-diff} kcal left in today's budget.`;
  } else {
    status = "on-track";
    message = `${-diff} kcal to spare. Right on track, well done.`;
  }

  return { eaten, target, diff, status, message, mealCount: meals.length, biggest };
}
