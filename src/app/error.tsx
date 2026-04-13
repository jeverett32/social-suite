"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-panel border border-border rounded-lg p-6">
        <p className="text-[11px] uppercase tracking-widest text-[#625d58] font-medium">Something broke</p>
        <h1 className="mt-2 text-xl font-semibold text-ink tracking-tight">Unexpected error</h1>
        <p className="mt-2 text-sm text-[#625d58]">
          Try again. If it keeps happening, the demo data may be in a bad state.
        </p>
        <button
          onClick={reset}
          className="mt-5 px-4 py-2 bg-warm text-paper rounded-md text-sm font-medium hover:bg-warm/90 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
