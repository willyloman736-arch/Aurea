"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  group: string;
  label: string;
  hint: string;
  href: string;
}

const ITEMS: Item[] = [
  { group: "Navigate",  label: "Home",              hint: "Landing page",                    href: "/" },
  { group: "Navigate",  label: "Services",          hint: "Express, freight, same-day",      href: "/services" },
  { group: "Navigate",  label: "Network",           hint: "How custody holds end-to-end",    href: "/network" },
  { group: "Navigate",  label: "Coverage",          hint: "Hubs, lanes, customs",            href: "/coverage" },
  { group: "Navigate",  label: "Customers",         hint: "Case studies",                    href: "/customers" },
  { group: "Navigate",  label: "FAQ",               hint: "Common questions",                href: "/faq" },
  { group: "Action",    label: "Get a quote",       hint: "Live rate calculator",            href: "/quote" },
  { group: "Action",    label: "Book a pickup",     hint: "Schedule a courier",              href: "/book" },
  { group: "Action",    label: "File a claim",      hint: "Damaged, lost, delayed",          href: "/claims" },
  { group: "Action",    label: "Live portal",       hint: "Real-time map + ticker",          href: "/portal" },
  { group: "Track",     label: "AUR-2847-JK3921",   hint: "Demo · In transit",               href: "/track/AUR-2847-JK3921" },
  { group: "Track",     label: "AUR-9931-LM7740",   hint: "Demo · Out for delivery",         href: "/track/AUR-9931-LM7740" },
  { group: "Account",   label: "Sign in",           hint: "Access your account",             href: "/sign-in" },
  { group: "Dashboard", label: "Dashboard home",    hint: "Operator console",                href: "/dashboard" },
  { group: "Dashboard", label: "New shipment",      hint: "Create a tracker",                href: "/dashboard/shipments/new" },
  { group: "Dashboard", label: "All shipments",     hint: "List + search",                   href: "/dashboard/shipments" },
  { group: "Dashboard", label: "Settings",          hint: "Env keys + webhooks",             href: "/dashboard/settings" },
  { group: "Company",   label: "Contact",           hint: "Email, offices, hours",           href: "/contact" },
  { group: "Company",   label: "Careers",           hint: "Open roles in every hub",         href: "/careers" },
  { group: "Legal",     label: "Privacy",           hint: "How we handle data",              href: "/privacy" },
  { group: "Legal",     label: "Terms",             hint: "Terms of service",                href: "/terms" },
  { group: "Legal",     label: "Insurance",         hint: "Cover terms",                     href: "/insurance" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query) return ITEMS;
    const q = query.toLowerCase();
    return ITEMS.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.hint.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q),
    );
  }, [query]);

  // Global hotkey
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reset selection during render when query/open changes. State-based
  // prev-tracking is the React-19-blessed alternative to setState-in-effect.
  const [prevQuery, setPrevQuery] = useState(query);
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevQuery !== query || prevOpen !== open) {
    setPrevQuery(query);
    setPrevOpen(open);
    setSelected(0);
  }

  const navigate = useCallback(
    (item: Item) => {
      router.push(item.href);
      setOpen(false);
      setQuery("");
    },
    [router],
  );

  // Arrow key + Enter navigation
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[selected];
        if (item) navigate(item);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selected, navigate]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  // Group the filtered items, but track flat index for keyboard nav
  const grouped: Array<{ group: string; items: Array<{ item: Item; flat: number }> }> = [];
  let flat = 0;
  for (const item of filtered) {
    const last = grouped[grouped.length - 1];
    if (last && last.group === item.group) {
      last.items.push({ item, flat: flat++ });
    } else {
      grouped.push({ group: item.group, items: [{ item, flat: flat++ }] });
    }
  }

  return (
    <div className="cmd-backdrop" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmd-palette" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-search">
          <Search size={15} strokeWidth={1.5} />
          <input
            autoFocus
            type="text"
            placeholder="Search, navigate, or type a tracking number…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>ESC</kbd>
        </div>

        <div className="cmd-list">
          {grouped.map(({ group, items }) => (
            <div key={group} className="cmd-group">
              <div className="cmd-group-label">{group}</div>
              {items.map(({ item, flat }) => (
                <button
                  key={item.label}
                  type="button"
                  className={cn("cmd-item", flat === selected && "selected")}
                  onClick={() => navigate(item)}
                  onMouseEnter={() => setSelected(flat)}
                >
                  <div className="cmd-item-text">
                    <div className="cmd-item-label">{item.label}</div>
                    <div className="cmd-item-hint">{item.hint}</div>
                  </div>
                  <ArrowRight size={13} strokeWidth={1.5} className="cmd-item-arrow" />
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="cmd-empty">No results for &ldquo;{query}&rdquo;</div>
          )}
        </div>

        <div className="cmd-foot">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
