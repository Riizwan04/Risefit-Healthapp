// "What should I do next?" for the Today screen. Plain rules, no AI.
// Returns { title, text, action } where action is "log", "workout" or null.
import { missedMealNote } from "@/lib/mealtype";

export function nextStep({ hour, meals, workoutDone, water }) {
  // 1. A meal that looks missing (reuses the gentle missed-meal rules).
  const missed = missedMealNote(meals, hour);
  if (missed) return { title: "Log a meal", text: missed, action: "log" };

  // 2. Nothing logged yet in the morning.
  if (meals.length === 0 && hour >= 5 && hour < 11) {
    return { title: "Start your day", text: "Snap or type your breakfast to begin today's budget.", action: "log" };
  }

  // 3. Today's workout is still open.
  if (!workoutDone && hour >= 6 && hour < 21) {
    return { title: "Today's workout", text: "A gentle session is ready for you. Open it when you have a few minutes.", action: "workout" };
  }

  // 4. A little water.
  if (water < 4 && hour >= 12) {
    return { title: "Have some water", text: "Tap + on the water tile each time you finish a glass.", action: null };
  }

  // 5. All good.
  return { title: "You're on track today", text: "Nice work. Log your next meal when you have it.", action: null };
}
