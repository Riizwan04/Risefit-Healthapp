// "Good afternoon" plus today's date, or a warm welcome back after some days away.
// It never counts or mentions missed days.
export default function Greeting({ welcomeBack }) {
  const now = new Date();
  const hour = now.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const date = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mt-1">
      <h2 className="text-2xl font-bold text-slate-100">{hello}</h2>
      <p className="text-sm text-slate-400">
        {welcomeBack ? "Good to see you again. Pick up where you left off." : date}
      </p>
    </div>
  );
}
