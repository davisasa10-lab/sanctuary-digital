import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Radio, Send } from "lucide-react";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { services, sermons } from "@/data/church";
import heroImg from "@/assets/hero-worship.jpg";

export const Route = createFileRoute("/live")({
  component: LivePage,
  head: () => ({
    meta: [
      { title: "Live Stream — Worship With Us Online | Next Gen Church" },
      {
        name: "description",
        content:
          "Join Sunday worship live from anywhere, chat with the online congregation, and catch up on previous broadcasts.",
      },
      { property: "og:title", content: "Next Gen Church live" },
      { property: "og:description", content: "Worship with us online, wherever you are." },
    ],
  }),
});

const chat = [
  { name: "Ama", text: "Watching from London this morning 🙌" },
  { name: "Kojo", text: "That line about anchors — needed it." },
  { name: "Efua", text: "Praying for everyone joining today." },
  { name: "Yaw", text: "First time here. Feels warm already." },
];

function LivePage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState(chat);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Live"
        title="Worship with us, wherever you are"
        description="The stream opens 15 minutes before each service. Sing along, take notes and say hello in the chat."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
              {loading ? (
                <div className="space-y-4 p-6">
                  <Skeleton className="aspect-video w-full rounded-2xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <img
                      src={heroImg}
                      alt="Live worship service stream"
                      width={1920}
                      height={1088}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-[oklch(0.16_0.03_262/0.45)]">
                      <button
                        aria-label="Play live stream"
                        className="grid size-20 place-items-center rounded-full bg-gold text-gold-foreground transition-transform duration-300 hover:scale-110"
                      >
                        <Play className="ml-1 size-8 fill-current" />
                      </button>
                    </div>
                    <Badge className="absolute left-5 top-5 gap-1.5 rounded-full bg-destructive text-destructive-foreground">
                      <Radio className="size-3.5" /> LIVE
                    </Badge>
                  </div>
                  <div className="p-7">
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Sunday Second Service
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      1,248 watching · Pastor Daniel Mensah · Unshaken series
                    </p>
                  </div>
                </>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full min-h-96 flex-col rounded-3xl border border-border bg-card shadow-soft">
              <div className="border-b border-border p-5">
                <h2 className="font-bold tracking-tight">Live chat</h2>
                <p className="text-xs text-muted-foreground">Be kind. Be encouraging.</p>
              </div>
              <ul className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.map((m, i) => (
                  <li key={`${m.name}-${i}`} className="text-sm">
                    <span className="font-semibold text-royal">{m.name}</span>
                    <p className="mt-0.5 text-muted-foreground">{m.text}</p>
                  </li>
                ))}
              </ul>
              <form
                className="flex gap-2 border-t border-border p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  setMessages((m) => [...m, { name: "You", text: draft.trim() }]);
                  setDraft("");
                }}
              >
                <label htmlFor="chat-input" className="sr-only">
                  Chat message
                </label>
                <Input
                  id="chat-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Say hello…"
                  className="h-11 rounded-full"
                />
                <Button type="submit" size="icon" aria-label="Send message" className="size-11 rounded-full">
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </Section>

      <div className="bg-surface">
        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Reveal>
                <SectionTitle eyebrow="Catch up" title="Previous broadcasts" />
              </Reveal>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {sermons.slice(1, 5).map((s, i) => (
                  <Reveal as="li" key={s.id} delay={i * 80}>
                    <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft card-lift">
                      <h3 className="font-bold leading-snug tracking-tight">{s.title}</h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {s.speaker} · {s.date} · {s.duration}
                      </p>
                      <Button size="sm" variant="outline" className="mt-4 rounded-full">
                        <Play className="mr-1.5 size-4" /> Replay
                      </Button>
                    </article>
                  </Reveal>
                ))}
              </ul>
            </div>
            <Reveal delay={120}>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
                <h2 className="text-xl font-bold tracking-tight">Upcoming broadcasts</h2>
                <ul className="mt-6 space-y-5">
                  {services.map((s) => (
                    <li key={s.name} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <p className="text-xs uppercase tracking-widest text-gold">{s.day}</p>
                      <p className="mt-1 font-semibold">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Section>
      </div>
    </>
  );
}