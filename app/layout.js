import "./globals.css";

export const metadata = {
  title: "RiseFit",
  description: "Say what you ate in your own words. We'll do the maths.",
};

// Colour of the phone's browser bar.
export const viewport = { themeColor: "#059669" };

// Root layout: wraps every page. Mobile-first, centred, ~448px wide.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased">
        <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
