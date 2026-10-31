// Server-side only: one small helper for calling the Gemini REST API.
// The key is read from an env var and sent in a header, so it never reaches the
// browser and never appears in a URL or a log.

// Google retires model names over time, so we try a short list in order:
// GEMINI_MODEL first (it can hold one name or a comma-separated list), then these.
// "gemini-flash-latest" is an alias that follows Google's newest Flash model.
// Lighter models are last: less accurate, but usually less busy.
const DEFAULT_MODELS = [
  "gemini-flash-latest",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash-lite",
];

// Statuses where a DIFFERENT model may still work: not found (404), bad request for this
// model (400), over its quota (429) and Google-side trouble or overload (500, 502, 503, 504).
// A refused key (401, 403) would fail the same way on every model, so we stop there.
const TRY_NEXT = new Set([400, 404, 429, 500, 502, 503, 504]);

let workingModel = null; // remembers the model that last worked, for this server instance

// An error that carries the HTTP status, so callers can tell "model gone" from "bad key".
export class GeminiError extends Error {
  constructor(status) {
    super(`Gemini HTTP ${status}`);
    this.status = status;
  }
}

// One request to one model. Returns the reply as plain text.
async function askModel(model, { system, parts, json, maxTokens, timeoutMs }) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts }],
        generationConfig: {
          ...(json && { responseMimeType: "application/json" }), // ask for JSON back
          maxOutputTokens: maxTokens,
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(timeoutMs), // don't hang the user
    }
  );
  if (!res.ok) throw new GeminiError(res.status);
  const data = await res.json();
  return (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
}

// Returns the model's reply as plain text. Throws on any HTTP or network problem.
// All attempts together stay inside one time budget, so the user never waits long.
export async function callGemini({ system, parts, json = false, maxTokens = 2048, timeoutMs = 15000 }) {
  const configured = (process.env.GEMINI_MODEL || "").split(",").map((m) => m.trim()).filter(Boolean);
  const candidates = [...new Set([workingModel, ...configured, ...DEFAULT_MODELS].filter(Boolean))];
  const deadline = Date.now() + timeoutMs + 8000;

  let lastError;
  for (const model of candidates) {
    const left = deadline - Date.now();
    if (left < 2000) break; // out of time: give up and let the caller use its fallback
    try {
      const text = await askModel(model, { system, parts, json, maxTokens, timeoutMs: Math.min(timeoutMs, left) });
      workingModel = model;
      return text;
    } catch (err) {
      lastError = err;
      if (model === workingModel) workingModel = null;
      // A timeout or network error has no status: try the next model too.
      if (err.status !== undefined && !TRY_NEXT.has(err.status)) throw err;
    }
  }
  throw lastError || new Error("No time left");
}
