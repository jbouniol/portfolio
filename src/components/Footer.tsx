"use client";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted font-mono">
          Jonathan Bouniol &mdash; {new Date().getFullYear()}
        </p>
        <p className="text-xs text-muted/50 font-mono">
          Designed for clarity
        </p>
      </div>
    </footer>
  );
}
