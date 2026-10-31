// Daily workout suggestion. Plain rules and a small fixed library of gentle,
// no-equipment exercises (text only: no videos or images). No AI, so it can never
// invent an unsafe exercise.

export const LEVELS = ["beginner", "regular"];
export const LEVEL_LABEL = { beginner: "Beginner", regular: "Regular" };

// Each weekday (0 = Sunday ... 6 = Saturday) gets one session type.
const WEEK = ["rest", "walk", "strengthA", "walk", "strengthB", "walk", "long"];

const COOL_DOWN = "Finish with 2 minutes of slow walking.";

export function todaysWorkout(date, level = "beginner") {
  const regular = level === "regular";
  const sets = regular ? 3 : 2; // regular does one more round
  const more = regular ? 2 : 0; // and a couple more reps
  const walkMin = regular ? 40 : 30;

  switch (WEEK[date.getDay()]) {
    case "walk":
      return {
        title: "Brisk walk",
        minutes: walkMin,
        steps: [
          `Walk at a pace where you can talk but not sing, for ${walkMin} minutes.`,
          "Swing your arms and keep your shoulders relaxed.",
          COOL_DOWN,
        ],
      };
    case "strengthA":
      return {
        title: "Strength A (no equipment)",
        minutes: regular ? 20 : 15,
        steps: [
          `Bodyweight squats: ${sets} x ${10 + more}`,
          `Wall push-ups: ${sets} x ${10 + more}`,
          `Glute bridges: ${sets} x ${12 + more}`,
          `Plank (knees down is fine): ${sets} x ${regular ? 30 : 20} seconds`,
          "Rest about 45 seconds between rounds.",
        ],
      };
    case "strengthB":
      return {
        title: "Strength B (no equipment)",
        minutes: regular ? 20 : 15,
        steps: [
          `Step-ups on a low, stable step: ${sets} x ${8 + more} each leg`,
          `Standing knee raises: ${sets} x ${20 + more * 2}`,
          `Bird-dog: ${sets} x ${8 + more} each side`,
          `Calf raises: ${sets} x ${15 + more}`,
          "Rest about 45 seconds between rounds.",
        ],
      };
    case "long":
      return {
        title: "Longer easy activity",
        minutes: regular ? 60 : 45,
        steps: [
          `${regular ? 60 : 45} minutes of something you enjoy: a long walk, cycling, badminton or a swim.`,
          "Keep the effort easy to moderate.",
        ],
      };
    default:
      return {
        title: "Rest day",
        minutes: 10,
        steps: [
          "Rest is part of getting fitter.",
          "Optional, 10 minutes of gentle stretching: shoulder rolls, hamstring stretch, quad stretch, cat-cow.",
        ],
      };
  }
}
