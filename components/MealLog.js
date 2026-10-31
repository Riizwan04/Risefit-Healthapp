"use client";

import { useRef, useState } from "react";
import ItemChips from "@/components/ItemChips";
import CameraCapture from "@/components/CameraCapture";
import { resizeImage } from "@/lib/image";
import { MEAL_TYPES, TYPE_LABEL, guessMealType } from "@/lib/mealtype";
import {
  toMealItem,
  setItemQty,
  withQty,
  isEdited,
  sumKcal,
  sumProtein,
  mealRange,
  SOURCE_LABEL,
} from "@/lib/items";

// Describe a meal -> AI estimate -> preview (editable) -> add to today's list.
// The parent owns the meal data; this component only reports changes.
export default function MealLog({ meals, onAdd, onRemove, onUpdate }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // { items, kcal, note, source }
  const [alert, setAlert] = useState(null); // red-flag message (the only red in the app)
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null); // { dataUrl, data, mimeType } after resizing
  const [fileKey, setFileKey] = useState(0); // changing it resets the file input
  const [cameraOpen, setCameraOpen] = useState(false); // live in-page camera
  const cameraInput = useRef(null); // fallback: phone camera app via the file input

  const field = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";
  const photoBtn =
    "flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700";

  const PHOTO_ERROR = "I couldn't read that photo, please type what you ate.";

  // A photo was picked (or taken): shrink it, then keep it for the estimate.
  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      setPhoto(await resizeImage(file));
    } catch {
      setPhoto(null);
      setError(PHOTO_ERROR);
    }
  };

  // Take photo: use the live camera if the browser has one, else the file input's camera.
  const takePhoto = () => {
    if (navigator.mediaDevices?.getUserMedia) setCameraOpen(true);
    else cameraInput.current?.click();
  };

  const removePhoto = () => {
    setPhoto(null);
    setFileKey((k) => k + 1);
  };

  // Send the text (and photo, if any) to our server route for an estimate.
  const estimate = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !photo) || loading) return;
    setLoading(true);
    setError("");
    setAlert(null);
    setPreview(null);
    try {
      const res = await fetch("/api/parse-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          image: photo ? { mimeType: photo.mimeType, data: photo.data } : undefined,
        }),
      });
      const data = await res.json();
      if (data.safety) {
        setAlert(data.safety.message); // stop: nothing is logged
      } else if (data.photoFailed) {
        setError(data.message || PHOTO_ERROR);
      } else if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
      } else {
        setPreview({
          items: (data.items || []).map(toMealItem),
          type: guessMealType(new Date().getHours()), // user can change it
          kcal: "", // only used when nothing was recognised: user types it
          note: data.note || "",
          source: data.source,
        });
      }
    } catch {
      setError("Could not reach the server. Check your connection.");
    }
    setLoading(false);
  };

  // With items the total is their sum; otherwise the user types it.
  const hasItems = !!preview && preview.items.length > 0;
  const total = !preview ? 0 : hasItems ? sumKcal(preview.items) : Math.round(Number(preview.kcal));
  const canAdd = !!preview && total >= 1 && total <= 5000;

  const confirmAdd = () => {
    if (!canAdd) return;
    const names = preview.items.map((i) => i.name).join(", ");
    onAdd(
      hasItems
        ? {
            id: Date.now(),
            text: text.trim() || names,
            type: preview.type,
            note: preview.source === "ai" ? preview.note : "", // the AI's reason
            source: preview.source, // "ai" or "demo" (fallback)
            items: preview.items,
            kcal: total,
            protein_g: sumProtein(preview.items),
          }
        : { id: Date.now(), text: text.trim() || "Meal", type: preview.type, source: "manual", kcal: total }
    );
    setText("");
    removePhoto();
    setPreview(null);
  };

  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-slate-700">Log a meal</h2>

      <form onSubmit={estimate} className="mt-2">
        <div className="flex gap-2">
          <input
            className={`${field} min-w-0 flex-1`}
            placeholder={photo ? "Add words (optional)" : "e.g. 2 butter rotis, dal fry, dahi"}
            maxLength={300}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            disabled={(!text.trim() && !photo) || loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
          >
            {loading ? "..." : "Estimate"}
          </button>
        </div>

        {/* Two ways to add a photo. Both use the same handler. */}
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={takePhoto} className={photoBtn}>
            Take photo
          </button>
          {/* Fallback for browsers with no live camera: capture="environment"
              makes phones open their camera app */}
          <input
            ref={cameraInput}
            key={`cam-${fileKey}`}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={pickPhoto}
          />
          {/* No capture attribute: opens the gallery / file picker */}
          <label className={photoBtn}>
            Upload
            <input
              key={`up-${fileKey}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={pickPhoto}
            />
          </label>
        </div>
      </form>

      {cameraOpen && (
        <CameraCapture
          onCapture={(p) => {
            setPhoto(p);
            setError("");
            setCameraOpen(false);
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}

      {photo && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={photo.dataUrl}
            alt="Your meal"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <button onClick={removePhoto} className="text-sm text-slate-500 underline">
            Remove
          </button>
        </div>
      )}

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
          <label className="mb-2 flex items-center gap-2 text-sm text-slate-600">
            Meal
            <select
              className={field}
              value={preview.type}
              onChange={(e) => setPreview({ ...preview, type: e.target.value })}
            >
              {MEAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </label>
          {hasItems && (
            <ItemChips
              items={preview.items}
              onChange={(idx, qty) =>
                setPreview({ ...preview, items: setItemQty(preview.items, idx, qty) })
              }
            />
          )}
          {preview.note && (
            <p className="mt-2 text-xs text-slate-500">
              {preview.source === "ai" ? "Why: " : ""}
              {preview.note}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            {hasItems ? (
              <p className="text-sm text-slate-700">
                Total: <strong>{total} kcal</strong>
                {mealRange(preview.items) && (
                  <> (about {mealRange(preview.items).low}–{mealRange(preview.items).high})</>
                )}{" "}
                · {sumProtein(preview.items)} g protein
              </p>
            ) : (
              <>
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
              </>
            )}
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
            <li key={m.id} className="px-3 py-2">
              <div className="flex items-center justify-between">
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
              </div>
              {(TYPE_LABEL[m.type] || SOURCE_LABEL[m.source]) && (
                <p className="mt-0.5 text-xs text-slate-400">
                  {[TYPE_LABEL[m.type], SOURCE_LABEL[m.source], isEdited(m) && "edited"]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {m.items && mealRange(m.items) && (
                <p className="mt-0.5 text-xs text-slate-500">
                  About {mealRange(m.items).low}–{mealRange(m.items).high} kcal
                </p>
              )}
              {m.note && <p className="mt-0.5 text-xs text-slate-500">Why: {m.note}</p>}
              {m.items && (
                <div className="mt-2">
                  {/* Changing a quantity updates this meal and the daily budget at once */}
                  <ItemChips
                    items={m.items}
                    onChange={(idx, qty) => onUpdate(m.id, withQty(m, idx, qty))}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
