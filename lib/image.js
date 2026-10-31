// Browser-only: shrink a photo before upload so it is small and fast to send.
// Longest side is at most 1024 px and the result is a JPEG at quality 0.7.

const MAX_SIDE = 1024;
const QUALITY = 0.7;

// Draw any image-like source (bitmap or video frame) onto a small canvas.
// Returns { dataUrl, data, mimeType }: dataUrl for the preview, data (base64) for the API.
function toJpeg(source, width, height) {
  if (!width || !height) throw new Error("Empty image");
  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
  return { dataUrl, data: dataUrl.split(",")[1], mimeType: "image/jpeg" };
}

// A picked or uploaded file.
export async function resizeImage(file) {
  const bitmap = await createImageBitmap(file); // throws if the format can't be read
  const result = toJpeg(bitmap, bitmap.width, bitmap.height);
  bitmap.close?.();
  return result;
}

// A still taken from the live camera <video>.
export function frameToJpeg(video) {
  return toJpeg(video, video.videoWidth, video.videoHeight);
}
