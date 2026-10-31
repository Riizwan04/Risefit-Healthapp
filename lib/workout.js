// Daily workout suggestion. Plain rules and a small fixed library of gentle,
// no-equipment exercises (text only: no videos or images). No AI, so it can never
// invent an unsafe exercise.

export const LEVELS = ["beginner", "regular"];
export const LEVEL_LABEL = { beginner: "Beginner", regular: "Regular" };

// Each weekday (0 = Sunday ... 6 = Saturday) gets one session type.
const WEEK = ["rest", "walk", "strengthA", "walk", "strengthB", "walk", "long"];

// A small icon per session type, for the week strip.
export const SESSION_ICON = {
  rest: "🧘",
  walk: "🚶",
  strengthA: "💪",
  strengthB: "🦵",
  long: "🚴",
};

export const sessionType = (date) => WEEK[date.getDay()];

// Returns { type, title, minutes, items: [{ id, name, detail, icon }], note }.
export function todaysWorkout(date, level = "beginner") {
  const regular = level === "regular";
  const sets = regular ? 3 : 2; // regular does one more round
  const more = regular ? 2 : 0; // and a couple more reps
  const walkMin = regular ? 40 : 30;
  const type = sessionType(date);
  const item = (n, name, detail, icon) => ({ id: `${type}-${n}`, name, detail, icon });

  switch (type) {
    case "walk":
      return {
        type,
        title: "Brisk walk",
        minutes: walkMin,
        items: [
          item(0, "Brisk walk", `${walkMin} minutes at a pace where you can talk but not sing`, "🚶"),
          item(1, "Cool down", "2 minutes of slow walking", "🌿"),
        ],
        note: "Swing your arms and keep your shoulders relaxed.",
      };
    case "strengthA":
      return {
        type,
        title: "Strength A (no equipment)",
        minutes: regular ? 20 : 15,
        items: [
          item(0, "Bodyweight squats", `${sets} x ${10 + more}`, "🦵"),
          item(1, "Wall push-ups", `${sets} x ${10 + more}`, "💪"),
          item(2, "Glute bridges", `${sets} x ${12 + more}`, "🌉"),
          item(3, "Plank (knees down is fine)", `${sets} x ${regular ? 30 : 20} seconds`, "🧘"),
        ],
        note: "Rest about 45 seconds between rounds.",
      };
    case "strengthB":
      return {
        type,
        title: "Strength B (no equipment)",
        minutes: regular ? 20 : 15,
        items: [
          item(0, "Step-ups on a low, stable step", `${sets} x ${8 + more} each leg`, "🪜"),
          item(1, "Standing knee raises", `${sets} x ${20 + more * 2}`, "🏃"),
          item(2, "Bird-dog", `${sets} x ${8 + more} each side`, "🐕"),
          item(3, "Calf raises", `${sets} x ${15 + more}`, "🦶"),
        ],
        note: "Rest about 45 seconds between rounds.",
      };
    case "long":
      return {
        type,
        title: "Longer easy activity",
        minutes: regular ? 60 : 45,
        items: [
          item(0, "Something you enjoy", `${regular ? 60 : 45} minutes: a long walk, cycling, badminton or a swim`, "🚴"),
        ],
        note: "Keep the effort easy to moderate.",
      };
    default:
      return {
        type,
        title: "Rest day",
        minutes: 10,
        items: [
          item(0, "Gentle stretching (optional)", "10 minutes: shoulder rolls, hamstring stretch, quad stretch, cat-cow", "🧘"),
        ],
        note: "Rest is part of getting fitter.",
      };
  }
}

// The Monday-to-Sunday dates of the week that contains `date`.
export function weekDates(date = new Date()) {
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
