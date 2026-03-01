"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  MessageSquare,
  Search,
  Plus,
  Database,
  Globe,
  ArrowRight,
  Command,
  CornerDownLeft,
} from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ComponentType,
} from "react";

/* ── Types ─────────────────────────────────────────────────────── */

interface PaletteItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  href?: string;
  action?: () => void;
  group: "navigation" | "actions" | "projects" | "experiences";
  external?: boolean;
}

interface PortfolioProject {
  slug: string;
  title: string;
  company: string;
}

interface PortfolioExperience {
  slug: string;
  role: string;
  company: string;
}

/* ── Static entries ────────────────────────────────────────────── */

const STATIC_ITEMS: PaletteItem[] = [
  {
    id: "nav-dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    group: "navigation",
  },
  {
    id: "nav-projects",
    label: "Projects",
    sublabel: "Manage all projects",
    icon: FolderKanban,
    href: "/admin/projects",
    group: "navigation",
  },
  {
    id: "nav-experiences",
    label: "Experiences",
    sublabel: "Manage all experiences",
    icon: Briefcase,
    href: "/admin/experiences",
    group: "navigation",
  },
  {
    id: "nav-bob",
    label: "Bob",
    sublabel: "Personal chatbot",
    icon: MessageSquare,
    href: "/admin/chatbot",
    group: "navigation",
  },
  {
    id: "action-new-project",
    label: "New Project",
    sublabel: "Create a project from scratch",
    icon: Plus,
    href: "/admin/projects/new",
    group: "actions",
  },
  {
    id: "action-new-experience",
    label: "New Experience",
    sublabel: "Add a work experience",
    icon: Plus,
    href: "/admin/experiences/new",
    group: "actions",
  },
  {
    id: "action-preview-site",
    label: "Preview Site",
    sublabel: "Open the public portfolio",
    icon: Globe,
    href: "/",
    group: "actions",
    external: true,
  },
];

/* ── Group labels ──────────────────────────────────────────────── */

const GROUP_ORDER = ["navigation", "actions", "projects", "experiences"] as const;
const GROUP_LABELS: Record<string, string> = {
  navigation: "Navigation",
  actions: "Quick Actions",
  projects: "Projects",
  experiences: "Experiences",
};

/* ── Fuzzy match ───────────────────────────────────────────────── */

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

/* ── Component ─────────────────────────────────────────────────── */

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState<PaletteItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* Load projects + experiences once on first open */
  const hasFetched = useRef(false);

  const fetchPortfolioData = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      const [projRes, expRes] = await Promise.all([
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/experiences", { cache: "no-store" }),
      ]);

      const items: PaletteItem[] = [];

      if (projRes.ok) {
        const projects: PortfolioProject[] = await projRes.json();
        for (const p of projects) {
          items.push({
            id: `project-${p.slug}`,
            label: p.title,
            sublabel: p.company,
            icon: FolderKanban,
            href: `/admin/projects/${p.slug}`,
            group: "projects",
          });
        }
      }

      if (expRes.ok) {
        const experiences: PortfolioExperience[] = await expRes.json();
        for (const e of experiences) {
          items.push({
            id: `experience-${e.slug}`,
            label: e.role,
            sublabel: e.company,
            icon: Briefcase,
            href: `/admin/experiences/${e.slug}`,
            group: "experiences",
          });
        }
      }

      setPortfolioItems(items);
    } catch {
      // silently ignore – palette still works with static items
    }
  }, []);

  /* Keyboard shortcut: ⌘K / Ctrl+K */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* Focus input on open, fetch data */
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      fetchPortfolioData();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, fetchPortfolioData]);

  /* All items */
  const allItems = useMemo(
    () => [...STATIC_ITEMS, ...portfolioItems],
    [portfolioItems]
  );

  /* Filtered + grouped */
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    return allItems.filter(
      (item) =>
        fuzzyMatch(query, item.label) ||
        fuzzyMatch(query, item.sublabel || "") ||
        fuzzyMatch(query, item.group)
    );
  }, [allItems, query]);

  /* Grouped for display */
  const grouped = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.group) || [];
      arr.push(item);
      map.set(item.group, arr);
    }
    const result: { group: string; items: PaletteItem[] }[] = [];
    for (const g of GROUP_ORDER) {
      const items = map.get(g);
      if (items && items.length > 0) result.push({ group: g, items });
    }
    return result;
  }, [filtered]);

  /* Flat list for keyboard navigation */
  const flatFiltered = useMemo(
    () => grouped.flatMap((g) => g.items),
    [grouped]
  );

  /* Reset active index when results change */
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  /* Scroll active item into view */
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(
      `[data-index="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  /* Execute item */
  const execute = useCallback(
    (item: PaletteItem) => {
      setOpen(false);
      if (item.action) {
        item.action();
      } else if (item.href) {
        if (item.external) {
          window.open(item.href, "_blank", "noopener,noreferrer");
        } else {
          router.push(item.href);
        }
      }
    },
    [router]
  );

  /* Keyboard navigation inside palette */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatFiltered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatFiltered.length) % flatFiltered.length);
    } else if (e.key === "Enter" && flatFiltered[activeIndex]) {
      e.preventDefault();
      execute(flatFiltered[activeIndex]);
    }
  }

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-lg mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, projects, experiences..."
            className="no-focus-outline w-full py-3.5 bg-transparent text-sm text-white placeholder:text-zinc-600"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 bg-zinc-800 border border-zinc-700 rounded">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-72 overflow-y-auto py-2 scroll-smooth"
        >
          {flatFiltered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-600">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.group}>
                <p className="px-4 pt-3 pb-1.5 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                  {GROUP_LABELS[g.group] || g.group}
                </p>
                {g.items.map((item) => {
                  flatIndex++;
                  const idx = flatIndex;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onClick={() => execute(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      }`}
                    >
                      <item.icon
                        size={15}
                        className={
                          isActive ? "text-blue-400" : "text-zinc-600"
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.label}</p>
                        {item.sublabel && (
                          <p className="text-[11px] text-zinc-600 truncate">
                            {item.sublabel}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <CornerDownLeft size={12} className="text-zinc-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 text-[10px] text-zinc-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[9px] font-mono">
                ↑↓
              </kbd>{" "}
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[9px] font-mono">
                ↵
              </kbd>{" "}
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[9px] font-mono">
                esc
              </kbd>{" "}
              close
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command size={10} />K to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
