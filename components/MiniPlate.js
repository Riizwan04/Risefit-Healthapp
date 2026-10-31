// A tiny drawn plate (rotis, dal, sabzi, dahi) used as the meal icon. Our own drawing, no photo.
export default function MiniPlate({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#cfd8d6" />
      <circle cx="20" cy="20" r="14.5" fill="#e8eeec" />
      <circle cx="13" cy="15" r="5.2" fill="#e6b422" />
      <circle cx="26" cy="14" r="5.2" fill="#4d7c0f" />
      <circle cx="22" cy="26" r="6.4" fill="#fafaf9" />
      <circle cx="12" cy="26" r="4.6" fill="#d6a566" />
    </svg>
  );
}
