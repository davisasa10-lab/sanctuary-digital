import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Headphones, Play, Radio, Video } from "lucide-react";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services } from "@/data/church";
import { usePodcasts, useLiveSettings, useSermons, useVideos } from "@/lib/church-db";
import { formatDate } from "@/lib/format";
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

function MediaPage() {
  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState<string | null>(null);
  const { data: dbVideos } = useVideos();
  const { data: live } = useLiveSettings();
  const { data: dbPodcasts } = usePodcasts();
  const { data: dbSermons } = useSermons();
  const podcasts = dbPodcasts ?? [];
  const replays = (dbSermons ?? []).slice(0, 4);

  const videoCards = (dbVideos ?? []).map((v) => ({
    id: v.id,
    title: v.title,
    kind: v.category || "Video",
    duration: v.duration,
    date: v.published_at ? formatDate(v.published_at) : "",
    thumbnail: v.thumbnail_url || heroImg,
    href: v.video_url || "#",
  }));

  useEffect(() => {
    setHost(window.location.hostname);
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
                        {live?.youtube_video_id ? (
                          <iframe
                            title={live.title || "Live stream"}
                            src={`https://www.youtube.com/embed/${live.youtube_video_id}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                            allowFullScreen
                            className="aspect-video w-full"
                          />
                        ) : (
                          <>
                            <img
                              src={heroImg}
                              alt="Live worship service stream"
                              width={1920}
                              height={1088}
                              className="aspect-video w-full object-cover"
                            />
                            <div className="absolute inset-0 grid place-items-center bg-[oklch(0.16_0.03_262/0.45)]">
                              <span className="grid size-20 place-items-center rounded-full bg-gold text-gold-foreground">
                                <Play className="ml-1 size-8 fill-current" />
                              </span>
                            </div>
                          </>
                        )}
                        {live?.is_live ? (
                          <Badge className="absolute left-5 top-5 gap-1.5 rounded-full bg-destructive text-destructive-foreground">
                            <Radio className="size-3.5" /> LIVE
                          </Badge>
                        ) : null}
                      </div>
                      <div className="p-7">
                        <h2 className="text-2xl font-extrabold tracking-tight">
                          {live?.title || "Sunday Second Service"}
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {live?.description ||
                            "Join us online every Sunday — the stream goes live just before the service starts."}
                        </p>
                      </div>
                    </>
                  )}

                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="flex h-full min-h-96 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                  <div className="border-b border-border p-5">
                    <h2 className="font-bold tracking-tight">Live chat</h2>
                    <p className="text-xs text-muted-foreground">
                      Chat happens on YouTube — sign in there to join in.
                    </p>
                  </div>
                  {live?.youtube_video_id && host ? (
                    <iframe
                      title="YouTube live chat"
                      src={`https://www.youtube.com/live_chat?v=${live.youtube_video_id}&embed_domain=${host}`}
                      className="min-h-96 flex-1 w-full border-0"
                    />
                  ) : (
                    <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
                      The live chat opens here as soon as a broadcast is on air.
                    </div>
                  )}
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
              {videoCards.map((v, i) => (
                <Reveal as="li" key={v.id} delay={i * 80}>
                  <article className="h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft card-lift">
                    <a
                      href={v.href}
                      target={v.href === "#" ? undefined : "_blank"}
                      rel="noreferrer"
                      className="block"
                    >
                      <div className="relative">
                        <img
                          src={v.thumbnail}
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
                          {v.date}
                          {v.duration ? ` · ${v.duration}` : ""}
                        </p>
                      </div>
                    </a>
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
            {podcasts.length === 0 ? (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                No episodes published yet — new ones land here as soon as they're uploaded.
              </p>
            ) : null}
            <ul className="mt-8 grid gap-5 lg:grid-cols-2">
              {podcasts.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 80}>
                  <article className="flex h-full items-start gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft">
                    {p.cover_image ? (
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        loading="lazy"
                        className="size-14 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <Headphones className="size-6" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-widest text-gold">{p.show}</p>
                      <h3 className="mt-1 font-bold leading-snug tracking-tight">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {[p.host, p.publish_date ? formatDate(p.publish_date) : "", p.duration]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {p.audio_url ? (
                        <audio controls preload="none" src={p.audio_url} className="mt-4 w-full">
                          Your browser does not support audio playback.
                        </audio>
                      ) : null}
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
                {replays.map((s2, i) => (
                  <Reveal as="li" key={s2.id} delay={i * 80}>
                    <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft card-lift">
                      <h3 className="font-bold leading-snug tracking-tight">{s2.title}</h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {[s2.speaker, s2.sermon_date ? formatDate(s2.sermon_date) : "", s2.duration]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {s2.video_url || s2.audio_url ? (
                        <Button asChild size="sm" variant="outline" className="mt-4 rounded-full">
                          <a
                            href={s2.video_url || s2.audio_url || "#"}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Play className="mr-1.5 size-4" /> Replay
                          </a>
                        </Button>
                      ) : null}
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
