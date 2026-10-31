// A small fixed library of friendly tips, one shown per day. Written by hand,
// general and non-medical (no health claims, no numbers to chase).
const TIPS = [
  "A short walk after a meal is an easy way to add movement.",
  "Photos are the quickest way to log. Snap before the first bite.",
  "Home food is hard to measure. A rough estimate you keep logging beats a perfect one you skip.",
  "Not sure about the oil or ghee? Tap + or - on the item to adjust the portion.",
  "Keep water nearby and tap the water tile whenever you finish a glass.",
  "You don't need a perfect day. A good week matters more.",
  "Try something different this week: cycling, badminton or a swim all count as a workout.",
  "Tired today? An easy 10-minute walk still counts.",
  "Plan dinner when you log lunch. Heavy days are easy to balance that way.",
  "Dal, eggs, paneer, curd and chicken are common sources of protein.",
  "Logging is easier when you sit down for meals.",
  "One logged meal is a good start. Small steps add up.",
  "Weekends count too. A long easy walk makes a great weekend workout.",
  "Add RiseFit to your phone's home screen from the browser menu to open it like an app.",
];

// The same tip all day, a different one tomorrow.
export function tipOfDay(date = new Date()) {
  const dayNumber = Math.floor(date.getTime() / 86400000);
  return TIPS[dayNumber % TIPS.length];
}
