// Daily calorie budget maths for RiseFit.
// Pure functions only (no browser APIs) so they are easy to test and explain.

// Default profile used when the user just taps a goal button.
export const DEFAULT_PROFILE = {
  sex: "male",
  age: 23,
  heightCm: 172,
  weightKg: 72,
  deficit: 400, // kcal/day below maintenance
};

const ACTIVITY_FACTOR = 1.35; // desk job, light movement
const MAX_DEFICIT = 500; // never ask for more than this per day
const MIN_TARGET = { male: 1500, female: 1200 }; // safety floor (kcal/day)
const MAX_CUSTOM = 4500; // upper limit for a target the user types in

// Mifflin-St Jeor: resting energy burn (kcal/day).
export function computeBMR({ sex, age, heightCm, weightKg }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "female" ? base - 161 : base + 5;
}

// The targets a user may type in for their own numbers. The lowest allowed is the safety
// floor or maintenance minus the 500 kcal/day deficit cap, whichever is higher.
export function calorieRange(profile = DEFAULT_PROFILE) {
  const p = { ...DEFAULT_PROFILE, ...profile };
  const maintenance = computeBMR(p) * ACTIVITY_FACTOR;
  const floor = MIN_TARGET[p.sex === "female" ? "female" : "male"];
  const min = Math.max(floor, Math.ceil((maintenance - MAX_DEFICIT) / 10) * 10);
  return { min, max: MAX_CUSTOM, maintenance: Math.round(maintenance) };
}

// Returns { bmr, maintenance, deficit, target } with whole numbers.
// If the profile has customKcal (a target the user typed in), that is used, but it is
// always kept inside calorieRange(), so the safety rules still hold.
export function computeTarget(profile = DEFAULT_PROFILE) {
  const p = { ...DEFAULT_PROFILE, ...profile };
  const bmr = computeBMR(p);
  const maintenance = bmr * ACTIVITY_FACTOR;
  const floor = MIN_TARGET[p.sex === "female" ? "female" : "male"];

  if (Number(p.customKcal) > 0) {
    const { min, max } = calorieRange(p);
    const target = Math.min(Math.max(Number(p.customKcal), min), max);
    return {
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      deficit: Math.round(maintenance - target), // negative means eating above maintenance
      target: Math.round(target),
      custom: true,
    };
  }

  // Clamp the deficit between 0 and 500 kcal.
  const deficit = Math.min(Math.max(Number(p.deficit) || 0, 0), MAX_DEFICIT);

  // Target = maintenance - deficit, but never below the safety floor.
  const target = Math.max(maintenance - deficit, floor);

  return {
    bmr: Math.round(bmr),
    maintenance: Math.round(maintenance),
    deficit,
    target: Math.round(target),
  };
}
