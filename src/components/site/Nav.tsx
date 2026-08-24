import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme";
import { church } from "@/data/church";
import logo from "@/assets/nxg-logo.png.asset.json";
import { cn } from "@/lib/utils";

const primary = [
  { to: "/", label: "Home" },
  { to: "/sermons", label: "Sermons" },
  { to: "/events", label: "Events" },
  { to: "/live", label: "Live" },
];

const megaGroups = [
  {
    heading: "Our Church",
    links: [
      { to: "/about", label: "About us", desc: "Story, beliefs and what to expect" },
      { to: "/vision", label: "Vision & Mission", desc: "Where we are going" },
      { to: "/leadership", label: "Leadership", desc: "Meet the pastors and elders" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { to: "/ministries", label: "Ministries", desc: "Find your place to serve" },
      { to: "/prayer", label: "Prayer request", desc: "We will pray with you" },
      { to: "/testimonies", label: "Testimonies", desc: "Stories of changed lives" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { to: "/gallery", label: "Gallery", desc: "Moments from our life together" },
      { to: "/contact", label: "Contact & visit", desc: "Directions, hours, FAQ" },
      { to: "/give", label: "Give", desc: "Support the mission" },
    ],
  },
] as const;

const allLinks = [
  ...primary,
  ...megaGroups.flatMap((g) => g.links.map((l) => ({ to: l.to, label: l.label }))),
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border/60 py-2"
          : "bg-linear-to-b from-[oklch(0.16_0.03_262/0.55)] to-transparent py-4 text-[oklch(0.97_0.005_250)]",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logo.url}
            alt={`${church.name} logo`}
            className={cn(
              "size-10 shrink-0 rounded-xl object-cover transition-shadow",
              !scrolled && "ring-1 ring-white/30",
            )}
          />
          <span className="truncate text-lg font-extrabold tracking-tight">{church.name}</span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {primary.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                scrolled
                  ? "text-muted-foreground hover:bg-accent hover:text-foreground data-[status=active]:text-foreground"
                  : "text-[oklch(0.97_0.005_250/0.8)] hover:bg-white/10 hover:text-[oklch(0.97_0.005_250)] data-[status=active]:text-gold",
              )}
            >
              {l.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={cn(
                "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                scrolled
                  ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                  : "text-[oklch(0.97_0.005_250/0.8)] hover:bg-white/10 hover:text-[oklch(0.97_0.005_250)]",
              )}
            >
              Explore
              <ChevronDown
                className={cn("size-4 transition-transform", open && "rotate-180")}
              />
            </button>
            <div
              className={cn(
                "absolute right-0 top-full w-[46rem] pt-3 transition-all duration-200",
                open
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0",
              )}
            >
              <div className="grid grid-cols-3 gap-6 rounded-3xl border border-border bg-popover p-6 shadow-lift">
                {megaGroups.map((group) => (
                  <div key={group.heading}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
                      {group.heading}
                    </p>
                    <ul className="space-y-1">
                      {group.links.map((l) => (
                        <li key={l.to}>
                          <Link
                            to={l.to}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl px-3 py-2 transition-colors hover:bg-accent"
                          >
                            <span className="block text-sm font-semibold">{l.label}</span>
                            <span className="block text-xs text-muted-foreground">{l.desc}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <ThemeToggle />
          <Button
            asChild
            className={cn(
              "hidden rounded-full sm:inline-flex",
              !scrolled && "bg-gold text-gold-foreground hover:bg-gold/90",
            )}
          >
            <Link to="/give">Give</Link>
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="min-h-11 min-w-11 rounded-full lg:hidden"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto">
              <SheetTitle className="px-4 pt-4 text-base">Menu</SheetTitle>
              <ul className="grid gap-1 p-4">
                {allLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Button asChild className="w-full rounded-full">
                    <Link to="/give" onClick={() => setMobileOpen(false)}>
                      Give
                    </Link>
                  </Button>
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}