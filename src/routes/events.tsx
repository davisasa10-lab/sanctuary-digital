import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events } from "@/data/church";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Events & Calendar — Grace Cathedral Accra" },
      {
        name: "description",
        content:
          "Conferences, outreach weekends, worship nights and youth camps. Browse the calendar, count down to the next gathering and register.",
      },
      { property: "og:title", content: "Upcoming events at Grace Cathedral" },
      { property: "og:description", content: "See what's coming and register in seconds." },
    ],
  }),
});

const categories = ["All", "Worship", "Conference", "Outreach", "Youth"];

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return null;
  const diff = Math.max(new Date(target).getTime() - now, 0);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Countdown({ date }: { date: string }) {
  const c = useCountdown(date);
  const cells: [string, number | null][] = [
    ["Days", c?.days ?? null],
    ["Hours", c?.hours ?? null],
    ["Mins", c?.minutes ?? null],
    ["Secs", c?.seconds ?? null],
  ];
  return (
    <ul className="grid max-w-md grid-cols-4 gap-3">
      {cells.map(([label, value]) => (
        <li
          key={label}
          className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-md"
        >
          <span className="block text-2xl font-extrabold tabular-nums">
            {value === null ? (
              <span className="mx-auto block h-7 w-10 animate-pulse rounded bg-white/20" />
            ) : (
              String(value).padStart(2, "0")
            )}
          </span>
          <span className="mt-1 block text-[0.65rem] uppercase tracking-widest text-primary-foreground/70">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function EventsPage() {
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const featured = events[0]!;
  const shown = events.filter((e) => filter === "All" || e.category === filter);
  const selected = events.find((e) => e.id === openId);

  return (
    <>
      <PageHero
        eyebrow="Events"
        title={featured.title}
        description={featured.description}
      >
        <Countdown date={featured.date} />
        <Button
          className="mt-8 h-12 rounded-full bg-gold px-8 text-gold-foreground hover:bg-gold/90"
          onClick={() => setOpenId(featured.id)}
        >
          Register free
        </Button>
      </PageHero>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionTitle eyebrow="Calendar" title="What's on at Grace" />
          </Reveal>
          <Reveal delay={80}>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="rounded-full">
                {categories.map((c) => (
                  <TabsTrigger key={c} value={c} className="rounded-full px-4">
                    {c}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </Reveal>
        </div>

        {shown.length === 0 ? (
          <Reveal className="mt-14">
            <div className="rounded-3xl border border-dashed border-border p-16 text-center">
              <p className="text-lg font-semibold">Nothing scheduled here yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another category — or check back after this Sunday.
              </p>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-10 grid gap-6 lg:grid-cols-2">
            {shown.map((e, i) => (
              <Reveal as="li" key={e.id} delay={i * 80}>
                <article className="flex h-full gap-6 rounded-3xl border border-border bg-card p-7 shadow-soft card-lift">
                  <div className="grid size-20 shrink-0 place-items-center rounded-2xl gradient-hero text-primary-foreground">
                    <span className="text-xs uppercase tracking-widest text-gold">
                      {new Date(e.date).toLocaleDateString(undefined, { month: "short" })}
                    </span>
                    <span className="text-2xl font-extrabold leading-none">
                      {new Date(e.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Badge variant="secondary" className="rounded-full">
                      {e.category}
                    </Badge>
                    <h3 className="mt-3 text-xl font-bold tracking-tight">{e.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {e.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-4 text-gold" />
                        {new Date(e.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-4 text-gold" />
                        {new Date(e.date).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-gold" />
                        {e.location}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-6 rounded-full"
                      onClick={() => setOpenId(e.id)}
                    >
                      Event details
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>{selected?.description}</DialogDescription>
          </DialogHeader>
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-gold" />
              {selected
                ? new Date(selected.date).toLocaleString(undefined, {
                    dateStyle: "full",
                    timeStyle: "short",
                  })
                : ""}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-gold" />
              {selected?.location}
            </div>
          </dl>
          <DialogFooter>
            <Button
              className="rounded-full"
              onClick={() => {
                toast.success("You're registered", {
                  description: `We've saved your spot for ${selected?.title}.`,
                });
                setOpenId(null);
              }}
            >
              Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}