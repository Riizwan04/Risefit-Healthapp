"use client";

import { useState } from "react";

// Describe a meal -> AI estimate -> preview (editable) -> add to today's list.
// The parent owns the meal data; this component only reports changes.
export default function MealLog({ meals, onAdd, onRemove }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // { items, kcal, note, source }
  const [alert, setAlert] = useState(null); // red-flag message (the only red in the app)
  const [error, setError] = useState("");

  const field = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  // Send the text to our server route for an estimate.
  const estimate = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setAlert(null);
    setPreview(null);
    try {
      const res = await fetch("/api/parse-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.safety) {
        setAlert(data.safety.message); // stop: nothing is logged
      } else if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
      } else {
        setPreview({
          items: data.items || [],
          kcal: data.total_kcal ?? "", // empty = user types it
          note: data.note || "",
          source: data.source,
        });
      }
    } catch {
      setError("Could not reach the server. Check your connection.");
    }
    setLoading(false);
  };

  const kcalNum = Math.round(Number(preview?.kcal));
  const canAdd = preview && kcalNum >= 1 && kcalNum <= 5000;

  const confirmAdd = () => {
    if (!canAdd) return;
    onAdd({ id: Date.now(), text: text.trim(), kcal: kcalNum });
    setText("");
    setPreview(null);
  };

  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-slate-700">Log a meal</h2>

      <form onSubmit={estimate} className="mt-2 flex gap-2">
        <input
          className={`${field} min-w-0 flex-1`}
          placeholder="e.g. 2 butter rotis, dal fry, dahi"
          maxLength={300}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
        >
          {loading ? "..." : "Estimate"}
        </button>
      </form>

      {/* Safety alert: red is reserved for this only */}
      {alert && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800"
        >
          {alert}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-amber-700">{error}</p>}

      {/* Estimate preview: user can correct the kcal before it is saved */}
      {preview && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3">
          {preview.items.length > 0 && (
            <ul className="space-y-1 text-sm text-slate-700">
              {preview.items.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{i.name}</span>
                  <span className="text-slate-500">{i.kcal} kcal</span>
                </li>
              ))}
            </ul>
          )}
          {preview.note && (
            <p className="mt-2 text-xs text-slate-500">{preview.note}</p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm text-slate-600" htmlFor="kcal">
              Total kcal
            </label>
            <input
              id="kcal"
              type="number"
              inputMode="numeric"
              min="1"
              max="5000"
              className={`${field} w-24`}
              value={preview.kcal}
              onChange={(e) => setPreview({ ...preview, kcal: e.target.value })}
            />
            <button
              onClick={confirmAdd}
              disabled={!canAdd}
              className="ml-auto rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
            >
              Add
            </button>
            <button
              onClick={() => setPreview(null)}
              className="text-sm text-slate-500 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {meals.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nothing logged yet today.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {meals.map((m) => (
            <li key={m.id} className="flex items-center justify-between px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-sm">{m.text}</span>
              <span className="ml-3 text-sm text-slate-600">{m.kcal} kcal</span>
              {/* Slate, not red: removing a meal isn't a danger action */}
              <button
                onClick={() => onRemove(m.id)}
                className="ml-3 text-sm text-slate-400"
                aria-label={`Remove ${m.text}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
