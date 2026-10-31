// Browser-only: shrink a photo before upload so it is small and fast to send.
// Longest side is at most 1024 px and the result is a JPEG at quality 0.7.

const MAX_SIDE = 1024;
const QUALITY = 0.7;

// Returns { dataUrl, data, mimeType }: dataUrl for the preview, data (base64) for the API.
export async function resizeImage(file) {
  const bitmap = await createImageBitmap(file); // throws if the format can't be read
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
  return { dataUrl, data: dataUrl.split(",")[1], mimeType: "image/jpeg" };
}
