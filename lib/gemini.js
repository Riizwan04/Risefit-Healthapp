// Server-side only: one small helper for calling the Gemini REST API.
// The key is read from an env var and sent in a header, so it never reaches the
// browser and never appears in a URL or a log.

// Returns the model's reply as plain text. Throws on any HTTP or network problem.
export async function callGemini({ system, parts, json = false, maxTokens = 2048, timeoutMs = 15000 }) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"; // supports images too
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
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  return (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
}
