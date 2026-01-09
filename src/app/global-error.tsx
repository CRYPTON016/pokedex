"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold text-red-500">Something went wrong!</h1>
          <p className="text-gray-400">An unexpected error occurred.</p>
          <button onClick={() => reset()} className="px-4 py-2 bg-[#00ff88] text-black rounded hover:opacity-90">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
