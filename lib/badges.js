// Badges: small rewards you keep for good. There are NO streaks: every badge counts
// totals, so days do not have to be in a row, and a badge is never taken away.
import { loadWater, loadWorkouts } from "@/lib/progress";

export const BADGES = [
  { id: "first_meal", icon: "🍽️", title: "First meal logged", hint: "Log your first meal", test: (s) => s.totalMeals >= 1 },
  { id: "five_meals", icon: "🥗", title: "5 meals logged", hint: "Log 5 meals", test: (s) => s.totalMeals >= 5 },
  { id: "first_workout", icon: "💪", title: "First workout done", hint: "Finish a workout", test: (s) => s.workoutsDone >= 1 },
  { id: "five_workouts", icon: "🏅", title: "5 workouts done", hint: "Finish 5 workouts", test: (s) => s.workoutsDone >= 5 },
  { id: "budget_days", icon: "🌿", title: "3 days within budget", hint: "Stay within budget on 3 days", test: (s) => s.daysWithin >= 3 },
  { id: "logged_days", icon: "📅", title: "7 days logged", hint: "Log meals on 7 different days", test: (s) => s.loggedDays >= 7 },
  { id: "water_8", icon: "💧", title: "8 glasses in a day", hint: "Log 8 glasses of water in one day", test: (s) => s.maxWater >= 8 },
];

// The numbers the badges are judged on, from what is saved in this browser.
export function badgeStats(days, target) {
  const logged = Object.values(days).filter((meals) => meals.length > 0);
  return {
    totalMeals: logged.reduce((n, meals) => n + meals.length, 0),
    loggedDays: logged.length,
    daysWithin: logged.filter((meals) => meals.reduce((s, m) => s + m.kcal, 0) <= target).length,
    workoutsDone: Object.keys(loadWorkouts()).length,
    maxWater: Math.max(0, ...Object.values(loadWater())),
  };
}

// Add any newly earned badges to the saved ones. Old badges are never removed.
// Returns { merged, fresh } where fresh lists the badges earned just now.
export function mergeBadges(saved, stats, today) {
  const merged = { ...saved };
  const fresh = [];
  for (const b of BADGES) {
    if (!merged[b.id] && b.test(stats)) {
      merged[b.id] = today;
      fresh.push(b);
    }
  }
  return { merged, fresh };
}
