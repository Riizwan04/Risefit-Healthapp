// Small per-day trackers kept in this browser only (localStorage).
// Each is an object keyed by date, e.g. { "2026-10-31": 5 }.
// Components read them when they appear, so they are always up to date.

const WATER_KEY = "risefit.water"; // { date: glasses }
const WORKOUT_KEY = "risefit.workouts"; // { date: true }
const TICKS_KEY = "risefit.ticks"; // { date: { exerciseId: true } }

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch {
    return {};
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const loadWater = () => read(WATER_KEY);
export function setWater(date, glasses) {
  write(WATER_KEY, { ...loadWater(), [date]: glasses });
}

export const loadWorkouts = () => read(WORKOUT_KEY);
export function setWorkoutDone(date, done) {
  const all = { ...loadWorkouts() };
  if (done) all[date] = true;
  else delete all[date];
  write(WORKOUT_KEY, all);
}

export const loadTicks = () => read(TICKS_KEY);
export function setTicksFor(date, ticks) {
  write(TICKS_KEY, { ...loadTicks(), [date]: ticks });
}
