import { ImageResponse } from "next/og";

// The app icon (also the browser tab icon), drawn with plain shapes. No outside images.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #10b981, #047857)",
          color: "white",
          fontSize: 320,
          fontWeight: 800,
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
