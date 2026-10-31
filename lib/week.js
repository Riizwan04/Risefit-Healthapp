// Numbers for the 7-day view. Plain rules, no AI.
import { lastDates } from "@/lib/days";

// One entry per day: { date, kcal, meals, logged }. Days with no meals are "not logged",
// and they are simply left out of the counts (no "missed day" wording).
export function weekData(days, target, n = 7) {
  return lastDates(n).map((date) => {
    const meals = days[date] || [];
    return {
      date,
      meals,
      logged: meals.length > 0,
      kcal: meals.reduce((s, m) => s + m.kcal, 0),
    };
  });
}

export function weekStats(week, target) {
  const logged = week.filter((d) => d.logged);
  const within = logged.filter((d) => d.kcal <= target).length;
  const avg = logged.length
    ? Math.round(logged.reduce((s, d) => s + d.kcal, 0) / logged.length)
    : 0;
  return { loggedDays: logged.length, withinDays: within, avgKcal: avg };
}
