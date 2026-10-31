"use client";

import { useEffect, useRef, useState } from "react";
import { frameToJpeg } from "@/lib/image";

// Full-screen camera inside the page (works on phones AND laptops with a webcam).
// Needs HTTPS or localhost, which Vercel and `npm run dev` both provide.
export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  // Start the camera when the screen opens, and always stop it when it closes.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } }, // rear camera on phones
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setReady(true);
      } catch {
        setError(
          "I couldn't open the camera. Please allow camera access in your browser, or use Upload instead."
        );
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    try {
      onCapture(frameToJpeg(videoRef.current));
    } catch {
      setError("I couldn't take that photo. Please try again or use Upload.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/5 p-3">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full rounded-xl bg-black ${ready ? "" : "hidden"}`}
        />
        {!ready && !error && (
          <p className="p-6 text-center text-sm text-slate-400">Opening camera...</p>
        )}
        {error && <p className="p-3 text-sm text-amber-300">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={capture}
            disabled={!ready}
            className="flex-1 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_22px_rgba(16,185,129,0.4)] px-4 py-2 text-sm font-semibold text-white disabled:bg-none disabled:bg-white/10 disabled:shadow-none"
          >
            Take photo
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
