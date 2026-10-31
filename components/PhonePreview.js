import Ring from "@/components/Ring";

// A small, clearly labelled EXAMPLE of the app inside a phone frame.
// Pure CSS and our own shapes: no screenshots or outside images.
export default function PhonePreview() {
  return (
    <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-white/5 p-3 shadow-xl">
      <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/10" />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <Ring value={1200} max={1875} strokeClass="stroke-emerald-500" size={110} stroke={10}>
          <p className="text-3xl font-bold text-emerald-400">675</p>
          <p className="text-[10px] text-slate-400">kcal left today</p>
        </Ring>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[10px]">
        <div className="rounded-lg bg-sky-500/10 p-1.5 text-sky-200">Protein <b>22 g</b></div>
        <div className="rounded-lg bg-teal-500/10 p-1.5 text-teal-200">Water <b>3</b></div>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 text-[10px]">
        <span className="text-base">🍛</span>
        <span className="flex-1 text-slate-200">2 rotis, dal, dahi</span>
        <b className="text-slate-100">480</b>
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-500">Example screen</p>
    </div>
  );
}
