// Web app manifest: lets people optionally add RiseFit to their phone's home screen.
// Nothing here is required to use the app (still no install, no signup).
export default function manifest() {
  return {
    name: "RiseFit",
    short_name: "RiseFit",
    description: "Say what you ate in your own words. We'll do the maths, without guilt.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b0a",
    theme_color: "#070b0a",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
