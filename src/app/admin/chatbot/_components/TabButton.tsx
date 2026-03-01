import type React from "react";

export default function TabButton({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`no-focus-outline inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
        active
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
      }`}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}
