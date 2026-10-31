// Demo / fallback parser: used when DEMO_MODE=1 or no API key is set.
// A tiny lookup of common Indian foods (approx. kcal per 1 serving).
// It is deliberately simple; the real AI handles messy descriptions better.

const FOODS = [
  { keys: ["paratha", "parantha"], name: "Paratha", kcal: 260, protein: 6 },
  { keys: ["roti", "chapati", "phulka"], name: "Roti", kcal: 100, protein: 3 },
  { keys: ["dal", "dahl"], name: "Dal (bowl)", kcal: 180, protein: 9 },
  { keys: ["rice", "chawal"], name: "Rice (cup)", kcal: 200, protein: 4 },
  { keys: ["dahi", "curd", "yogurt"], name: "Dahi (cup)", kcal: 100, protein: 5 },
  { keys: ["paneer"], name: "Paneer dish", kcal: 300, protein: 14 },
  { keys: ["biryani"], name: "Biryani (plate)", kcal: 850, protein: 28 },
  { keys: ["dosa"], name: "Dosa", kcal: 170, protein: 4 },
  { keys: ["idli"], name: "Idli", kcal: 60, protein: 2 },
  { keys: ["sambar"], name: "Sambar (bowl)", kcal: 120, protein: 5 },
  { keys: ["samosa"], name: "Samosa", kcal: 260, protein: 4 },
  { keys: ["poha"], name: "Poha (plate)", kcal: 250, protein: 5 },
  { keys: ["upma"], name: "Upma (plate)", kcal: 240, protein: 6 },
  { keys: ["sabzi", "bhindi", "aloo"], name: "Sabzi (bowl)", kcal: 150, protein: 3 },
  { keys: ["egg", "anda"], name: "Egg", kcal: 75, protein: 6 },
  { keys: ["chai", "tea"], name: "Chai (cup)", kcal: 90, protein: 2 },
  { keys: ["coffee"], name: "Coffee with milk", kcal: 80, protein: 3 },
  { keys: ["biscuit", "parle"], name: "Biscuit", kcal: 35, protein: 0 },
  { keys: ["banana", "kela"], name: "Banana", kcal: 105, protein: 1 },
  { keys: ["apple"], name: "Apple", kcal: 95, protein: 0 },
  { keys: ["chicken"], name: "Chicken curry (bowl)", kcal: 300, protein: 25 },
  { keys: ["burger"], name: "Burger", kcal: 500, protein: 20 },
  { keys: ["pizza"], name: "Pizza slice", kcal: 285, protein: 12 },
  { keys: ["maggi", "noodles"], name: "Instant noodles", kcal: 380, protein: 8 },
];

export function demoParse(text) {
  const lower = text.toLowerCase();
  const items = [];

  for (const food of FOODS) {
    // Biryani already includes the chicken/paneer, so don't count it twice.
    if (lower.includes("biryani") && ["chicken", "paneer", "rice"].includes(food.keys[0])) continue;
    const key = food.keys.find((k) => lower.includes(k));
    if (!key) continue;
    // Look for a number right before the food word, e.g. "2 parathas". Default 1.
    const m = lower.match(new RegExp(`(\\d+)\\s*(?:x\\s*)?\\w*\\s*${key}`));
    const qty = m ? Math.min(Number(m[1]), 20) : 1;
    items.push({
      name: qty > 1 ? `${qty} x ${food.name}` : food.name,
      kcal: food.kcal * qty,
      protein_g: food.protein * qty,
    });
  }

  const total = items.reduce((s, i) => s + i.kcal, 0);
  return {
    items,
    total_kcal: items.length ? total : null,
    note: items.length
      ? "Demo estimate from a small food list. Please check and edit."
      : "Demo mode could not recognise this meal. Enter the kcal yourself.",
  };
}
