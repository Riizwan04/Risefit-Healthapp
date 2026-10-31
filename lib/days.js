// Per-day meal history, kept in this browser only (localStorage).
// Shape: { "2026-10-31": [meal, meal, ...], "2026-10-30": [...] }

const DAYS_KEY = "risefit.days";
const OLD_MEALS_KEY = "risefit.meals"; // older versions kept only today's meals
const KEEP_DAYS = 30; // older days are dropped so storage stays small

// A date in the user's local time as "YYYY-MM-DD".
export function dateStr(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// The last n dates ending today, oldest first.
export function lastDates(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(dateStr(d));
  }
  return out;
}

// Read all days. Also moves a meal list saved by an older version into the new shape.
export function loadDays() {
  let days = {};
  try {
    days = JSON.parse(localStorage.getItem(DAYS_KEY) || "{}") || {};
    const old = JSON.parse(localStorage.getItem(OLD_MEALS_KEY) || "null");
    if (old && old.date && Array.isArray(old.items) && !days[old.date]) {
      days[old.date] = old.items;
      localStorage.setItem(DAYS_KEY, JSON.stringify(days));
    }
    localStorage.removeItem(OLD_MEALS_KEY);
  } catch {
    // Storage blocked or corrupted: start empty.
  }
  return days;
}

// Return a copy of days with one day replaced, keeping only the newest KEEP_DAYS days.
export function withDay(days, date, meals) {
  const next = { ...days, [date]: meals };
  const keep = Object.keys(next).sort().slice(-KEEP_DAYS);
  return Object.fromEntries(keep.map((k) => [k, next[k]]));
}

export function saveDays(days) {
  try {
    localStorage.setItem(DAYS_KEY, JSON.stringify(days));
  } catch {}
}
