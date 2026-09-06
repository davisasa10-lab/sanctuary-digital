import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Headphones, Play, Search } from "lucide-react";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSermons } from "@/lib/church-db";
import { formatDate } from "@/lib/format";
import bandImg from "@/assets/worship-band.jpg";

export const Route = createFileRoute("/sermons")({
  component: SermonsPage,
  head: () => ({
    meta: [
      { title: "Sermons — Watch and Listen | Next Gen Church" },
      {
        name: "description",
        content:
          "Browse the full sermon archive by series, speaker, scripture and topic. Watch on video or listen on the go.",
      },
      { property: "og:title", content: "Sermon archive" },
      { property: "og:description", content: "Teaching from Next Gen Church, on demand." },
    ],
  }),
});

function SermonsPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("All");
  const { data } = useSermons();
  const sermons = (data ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    speaker: s.speaker,
    series: s.series,
    scripture: s.scripture,
    date: s.sermon_date ? formatDate(s.sermon_date) : "",
    duration: s.duration,
    category: s.category,
    videoUrl: s.video_url,
    audioUrl: s.audio_url,
  }));
  const featured = sermons[0];
  const series = ["All", ...Array.from(new Set(sermons.map((s) => s.series).filter(Boolean)))];

  const results = useMemo(
    () =>
      sermons.filter((s) => {
        const matchesTab = tab === "All" || s.series === tab;
        const needle = q.trim().toLowerCase();
        const matchesQ =
          !needle ||
          [s.title, s.speaker, s.scripture, s.category].some((f) =>
            f.toLowerCase().includes(needle),
          );
        return matchesTab && matchesQ;
      }),
    [q, tab, sermons],
  );

  return (
    <>
      <PageHero
        eyebrow="Sermons"
        title="Teaching you can carry into Monday"
        description="Every message from the last decade, searchable by speaker, series and scripture."
      />

      <Section>
        {featured ? (
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft lg:grid-cols-[1.3fr_1fr]">
            <div className="group relative">
              <img
                src={bandImg}
                alt={`Featured sermon: ${featured.title}`}
                width={1280}
                height={960}
                loading="lazy"
                className="aspect-video size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 grid place-items-center bg-[oklch(0.16_0.03_262/0.45)]">
                <a
                  href={featured.videoUrl || featured.audioUrl || "#"}
                  target={featured.videoUrl || featured.audioUrl ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={`Play ${featured.title}`}
                  className="grid size-20 place-items-center rounded-full bg-gold text-gold-foreground transition-transform duration-300 hover:scale-110"
                >
                  <Play className="ml-1 size-8 fill-current" />
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
              <Badge className="w-fit rounded-full bg-royal text-royal-foreground">Featured</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight">{featured.title}</h2>
              <p className="text-sm text-muted-foreground">
                {featured.speaker} · {featured.series} · {featured.scripture}
              </p>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center gap-3">
                  <Button size="icon" className="size-11 rounded-full" aria-label="Play audio">
                    <Headphones className="size-5" />
                  </Button>
                  <div className="min-w-0 flex-1">
                    <div className="h-1.5 w-full rounded-full bg-border">
                      <div className="h-1.5 w-1/3 rounded-full bg-gold" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      13:42 / {featured.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        ) : null}
      </Section>

      <div className="bg-surface">
        <Section>
          <Reveal>
            <SectionTitle eyebrow="Archive" title="Browse every message" />
          </Reveal>
          <Reveal delay={80} className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="sermon-search" className="sr-only">
                Search sermons
              </label>
              <Input
                id="sermon-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, speaker or scripture"
                className="h-12 rounded-full pl-11"
              />
            </div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="rounded-full">
                {series.map((s) => (
                  <TabsTrigger key={s} value={s} className="rounded-full px-4">
                    {s}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </Reveal>

          {results.length === 0 ? (
            <Reveal className="mt-12">
              <div className="rounded-3xl border border-dashed border-border p-16 text-center">
                <p className="text-lg font-semibold">No sermons match that search</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different word, speaker or book of the Bible.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => {
                    setQ("");
                    setTab("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </Reveal>
          ) : (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 70}>
                  <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft card-lift">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        {s.series}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        {s.category}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.scripture}</p>
                    <p className="mt-auto pt-6 text-xs text-muted-foreground">
                      {s.speaker} · {s.date} · {s.duration}
                    </p>
                    <div className="mt-4 flex gap-2">
                      {s.videoUrl ? (
                        <Button asChild size="sm" className="rounded-full">
                          <a href={s.videoUrl} target="_blank" rel="noreferrer">
                            <Play className="mr-1.5 size-4" /> Watch
                          </a>
                        </Button>
                      ) : null}
                      {s.audioUrl ? (
                        <Button asChild size="sm" variant="outline" className="rounded-full">
                          <a href={s.audioUrl} target="_blank" rel="noreferrer">
                            <Headphones className="mr-1.5 size-4" /> Listen
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}