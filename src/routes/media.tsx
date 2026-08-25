import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Headphones, Play, Radio, Send, Video } from "lucide-react";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mediaVideos, podcasts, services, sermons } from "@/data/church";
import heroImg from "@/assets/hero-worship.jpg";

export const Route = createFileRoute("/media")({
  component: MediaPage,
  head: () => ({
    meta: [
      { title: "Media — Live, Videos & Podcasts | Next Gen Church" },
      {
        name: "description",
        content:
          "Watch Next Gen Church live, catch up on video highlights and listen to our podcasts wherever you are.",
      },
      { property: "og:title", content: "Next Gen Church media" },
      {
        property: "og:description",
        content: "Live broadcasts, video highlights and podcasts from Next Gen Church.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const chat = [
  { name: "Ama", text: "Watching from London this morning 🙌" },
  { name: "Kojo", text: "That line about anchors — needed it." },
  { name: "Efua", text: "Praying for everyone joining today." },
  { name: "Yaw", text: "First time here. Feels warm already." },
];

function MediaPage() {
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
        eyebrow="Media"
        title="Live broadcasts, videos and podcasts"
        description="One home for everything you can watch and listen to — the Sunday stream, story-led films and conversations for the week ahead."
      />

      <Section>
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="mx-auto flex h-auto w-full max-w-xl flex-wrap justify-center gap-1 rounded-full p-1.5">
            <TabsTrigger value="live" className="gap-1.5 rounded-full px-5 py-2">
              <Radio className="size-4" /> Live
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-1.5 rounded-full px-5 py-2">
              <Video className="size-4" /> Videos
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="gap-1.5 rounded-full px-5 py-2">
              <Headphones className="size-4" /> Podcasts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-10">
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
                    <Button
                      type="submit"
                      size="icon"
                      aria-label="Send message"
                      className="size-11 rounded-full"
                    >
                      <Send className="size-4" />
                    </Button>
                  </form>
                </div>
              </Reveal>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-10">
            <Reveal>
              <SectionTitle
                eyebrow="Watch"
                title="Video highlights"
                description="Short films, worship moments and stories from across the church."
              />
            </Reveal>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mediaVideos.map((v, i) => (
                <Reveal as="li" key={v.id} delay={i * 80}>
                  <article className="h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft card-lift">
                    <div className="relative">
                      <img
                        src={heroImg}
                        alt={v.title}
                        loading="lazy"
                        className="aspect-video w-full object-cover"
                      />
                      <div className="absolute inset-0 grid place-items-center bg-[oklch(0.16_0.03_262/0.35)]">
                        <span className="grid size-12 place-items-center rounded-full bg-gold text-gold-foreground">
                          <Play className="ml-0.5 size-5 fill-current" />
                        </span>
                      </div>
                      <Badge className="absolute left-4 top-4 rounded-full">{v.kind}</Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold leading-snug tracking-tight">{v.title}</h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {v.date} · {v.duration}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="podcasts" className="mt-10">
            <Reveal>
              <SectionTitle
                eyebrow="Listen"
                title="Podcasts"
                description="Conversations, teaching and guided prayer for the commute, the gym or the kitchen."
              />
            </Reveal>
            <ul className="mt-8 grid gap-5 lg:grid-cols-2">
              {podcasts.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 80}>
                  <article className="flex h-full items-start gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft card-lift">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <Headphones className="size-6" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gold">{p.show}</p>
                      <h3 className="mt-1 font-bold leading-snug tracking-tight">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {p.host} · {p.date} · {p.duration}
                      </p>
                      <Button size="sm" variant="outline" className="mt-4 rounded-full">
                        <Play className="mr-1.5 size-4" /> Play episode
                      </Button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
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
                    <li
                      key={s.name}
                      className="border-b border-border pb-4 last:border-0 last:pb-0"
                    >
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
