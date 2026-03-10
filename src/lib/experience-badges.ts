import { Award, type LucideIcon } from "lucide-react";

type ExperienceBadgeConfig = {
  icon: LucideIcon;
  label: string;
  className: string;
};

export function getExperienceBadgeConfig(
  badge: string | undefined
): ExperienceBadgeConfig | null {
  switch (badge) {
    case "Distinguished Ambassador":
      return {
        icon: Award,
        label: "Distinguished Ambassador",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      };
    default:
      return null;
  }
}
