"use client";

import { useEffect, useState } from "react";

// A circular progress ring. The arc grows from empty on first show.
// value/max sets how full it is; strokeClass picks the colour (a Tailwind stroke-* class).
export default function Ring({ value, max, strokeClass, size = 168, stroke = 14, children }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 50); // lets the CSS transition play
    return () => clearTimeout(t);
  }, []);

  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const fraction = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference * (1 - (drawn ? fraction : 0));

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(fraction * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-white/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${strokeClass} transition-[stroke-dashoffset] duration-700 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
