"use client";

import { useEffect, useState } from "react";

const SEGMENTS = 14;
const CX = 178;
const CY = 176;
const R = 150;

// A half-circle made of 14 rounded segments that light up one by one.
// value/max sets how many are lit; over = true lights all of them in amber.
export default function SegArc({ value, max, over = false, children }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 60); // lets the CSS fade-in play
    return () => clearTimeout(t);
  }, []);

  const fraction = Math.min(Math.max(value / max, 0), 1);
  const lit = over ? SEGMENTS : value > 0 ? Math.max(1, Math.round(fraction * SEGMENTS)) : 0;
  const glow = over ? "rgba(251,191,36,0.6)" : "rgba(16,185,129,0.65)";

  const segs = Array.from({ length: SEGMENTS }, (_, i) => {
    const a = Math.PI * (1 - (i + 0.5) / SEGMENTS); // from the left (pi) to the right (0)
    const x = CX + R * Math.cos(a);
    const y = CY - R * Math.sin(a);
    const deg = -(a * 180) / Math.PI + 90;
    const props = { x: x - 17, y: y - 13, width: 34, height: 26, rx: 12, transform: `rotate(${deg} ${x} ${y})` };
    return (
      <g key={i}>
        <rect {...props} fill="rgba(255,255,255,0.09)" />
        <rect
          {...props}
          fill={over ? "url(#segAmber)" : "url(#segEm)"}
          style={{
            opacity: drawn && i < lit ? 1 : 0,
            transition: "opacity 0.35s ease",
            transitionDelay: `${i * 45}ms`,
            filter: `drop-shadow(0 0 8px ${glow})`,
          }}
        />
      </g>
    );
  });

  return (
    <div
      className="relative"
      role="progressbar"
      aria-valuenow={Math.round(fraction * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg viewBox="0 0 356 196" className="w-full overflow-visible">
        <defs>
          <linearGradient id="segEm" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6ee7b7" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="segAmber" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fcd34d" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {segs}
      </svg>
      <div className="absolute inset-x-0 top-[47%] text-center">{children}</div>
    </div>
  );
}
