// Red-flag check, run BEFORE any AI call.
// RiseFit is not a medical tool: if the text sounds like a medical emergency
// or disordered eating, we stop and point to real help instead of estimating.

const MEDICAL = [
  /chest\s*(pain|paining|tight|pressure)/i,
  /pain(ing)?\s+in\s+(my\s+)?chest/i,
  /\b(faint(ed|ing)?|passed out|pass out|blacked? out|blackout)\b/i,
  /\b(dizzy|dizziness)\b/i,
  /(can'?t|cannot|hard to|difficulty)\s+breathe?/i,
  /short(ness)?\s+of\s+breath/i,
  /\b(severe|extreme)\s+pain\b/i,
  /\b(heart attack|stroke|seizure|overdose)\b/i,
];

const EATING_DISORDER = [
  /\bstarv(e|ing|ation)\b/i,
  /(not|no|without)\s+eat(ing)?\s+(for\s+)?(\d+|several|few|many)\s+days?/i,
  /(make|made|making|force|forced)\s+(myself\s+)?(throw up|vomit|puke)/i,
  /\b(purge|purging|binge and purge)\b/i,
  /laxatives?\s+(to|for)\s+(lose|weight)/i,
  /(hate|disgusted by)\s+(my\s+)?(body|myself)\s+.*(eat|food)/i,
];

// Returns null if fine, or { kind, message } if we must stop.
export function checkRedFlags(text) {
  if (MEDICAL.some((re) => re.test(text))) {
    return {
      kind: "medical",
      message:
        "What you describe could need medical attention. Please stop and contact a doctor now. If it is severe or getting worse, call emergency services (112 in India).",
    };
  }
  if (EATING_DISORDER.some((re) => re.test(text))) {
    return {
      kind: "eating",
      message:
        "Skipping food for days or making yourself throw up is not something RiseFit can help with safely. Please talk to a doctor or a mental health professional. You deserve proper support.",
    };
  }
  return null;
}
