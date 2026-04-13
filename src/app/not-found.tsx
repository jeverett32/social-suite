import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-panel border border-border rounded-lg p-6">
        <p className="text-[11px] uppercase tracking-widest text-[#625d58] font-medium">404</p>
        <h1 className="mt-2 text-xl font-semibold text-ink tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-[#625d58]">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-5 flex gap-2">
          <Link
            href="/"
            className="px-4 py-2 bg-warm text-paper rounded-md text-sm font-medium hover:bg-warm/90 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/overview"
            className="px-4 py-2 border border-border rounded-md text-sm font-medium text-ink hover:bg-shell transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
