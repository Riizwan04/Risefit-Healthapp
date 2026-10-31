// A small message that floats at the bottom of the screen for a moment.
export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[90%] rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-lg"
    >
      {message}
    </div>
  );
}
