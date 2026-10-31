// A calm, neutral reminder in the app (not a push notification).
// Slate colours only: no red, no streak or guilt wording.
export default function MissedMealNote({ note }) {
  if (!note) return null;
  return (
    <p className="mt-4 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700">
      {note}
    </p>
  );
}
