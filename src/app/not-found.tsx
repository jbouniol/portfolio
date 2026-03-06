import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <p className="font-mono text-sm text-accent mb-4">404</p>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
        Page not found
      </h1>
      <p className="text-muted text-center max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
        <Link
          href="/about"
          className="px-6 py-3 border border-border text-sm font-medium rounded-lg hover:bg-surface transition-colors"
        >
          About Me
        </Link>
      </div>
    </div>
  );
}
