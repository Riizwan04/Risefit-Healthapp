// A drawn top-down thali: steel plate, dal, sabzi, dahi, rice, rotis and a lemon wedge.
// Our own illustration (no photo). A real photo can replace it later.
export default function Thali({ size = 250 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 236 236" role="img" aria-label="A drawn thali with rotis, dal, sabzi, dahi and rice">
      <defs>
        <radialGradient id="thSteel" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#f1f5f4" />
          <stop offset=".6" stopColor="#b9c4c1" />
          <stop offset="1" stopColor="#7f8d89" />
        </radialGradient>
        <radialGradient id="thDal" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#f6cf4a" />
          <stop offset="1" stopColor="#c9930f" />
        </radialGradient>
        <radialGradient id="thSab" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#6aa22a" />
          <stop offset="1" stopColor="#3a5f12" />
        </radialGradient>
        <radialGradient id="thRot" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ecc48a" />
          <stop offset="1" stopColor="#c58d4a" />
        </radialGradient>
        <radialGradient id="thShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(0,0,0,.55)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="128" rx="104" ry="100" fill="url(#thShadow)" />
      <circle cx="118" cy="118" r="98" fill="url(#thSteel)" />
      <circle cx="118" cy="118" r="86" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2" />
      <circle cx="118" cy="118" r="78" fill="#e4eae8" />
      {/* rotis */}
      <circle cx="86" cy="150" r="40" fill="url(#thRot)" />
      <circle cx="86" cy="150" r="40" fill="none" stroke="#a9702f" strokeOpacity=".35" strokeWidth="2" />
      <circle cx="72" cy="140" r="4" fill="#8a5a22" opacity=".6" />
      <circle cx="98" cy="158" r="5" fill="#8a5a22" opacity=".55" />
      <circle cx="84" cy="168" r="3.5" fill="#8a5a22" opacity=".6" />
      <circle cx="102" cy="138" r="3" fill="#8a5a22" opacity=".5" />
      <circle cx="140" cy="164" r="34" fill="url(#thRot)" opacity=".96" />
      <circle cx="130" cy="156" r="3.5" fill="#8a5a22" opacity=".55" />
      <circle cx="148" cy="172" r="4" fill="#8a5a22" opacity=".55" />
      {/* katoris: dal, sabzi, dahi */}
      <circle cx="70" cy="70" r="30" fill="url(#thSteel)" />
      <circle cx="70" cy="70" r="24" fill="url(#thDal)" />
      <path d="M52 66 q18 -10 34 2" stroke="#fff2b0" strokeWidth="3" fill="none" opacity=".7" />
      <circle cx="148" cy="66" r="30" fill="url(#thSteel)" />
      <circle cx="148" cy="66" r="24" fill="url(#thSab)" />
      <circle cx="140" cy="62" r="5" fill="#8bc34a" />
      <circle cx="154" cy="72" r="5.5" fill="#9ccc65" />
      <circle cx="152" cy="56" r="4" fill="#558b2f" />
      <circle cx="184" cy="128" r="26" fill="url(#thSteel)" />
      <circle cx="184" cy="128" r="20" fill="#fbfbf9" />
      <path d="M170 122 q14 -8 28 2" stroke="#e7e5e0" strokeWidth="3" fill="none" />
      {/* rice */}
      <g transform="translate(176 176)">
        <ellipse cx="0" cy="0" rx="26" ry="20" fill="#fbfbf9" />
        <ellipse cx="-6" cy="-6" rx="17" ry="11" fill="#fff" />
        <path d="M-14 -4 l5 -2 M-4 -10 l5 2 M6 -6 l5 3 M-10 4 l6 -2 M2 4 l6 -1 M10 -1 l4 2" stroke="#e2dfd6" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* lemon wedge */}
      <path d="M30 118 q14 -22 38 -8 q-10 24 -38 8z" fill="#d9e84a" />
      <path d="M34 116 q12 -14 28 -6" stroke="#f5fbc0" strokeWidth="2" fill="none" />
    </svg>
  );
}
