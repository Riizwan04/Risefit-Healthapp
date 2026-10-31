import { ImageResponse } from "next/og";

// The icon iPhones use when RiseFit is added to the home screen.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 112,
          fontWeight: 800,
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
