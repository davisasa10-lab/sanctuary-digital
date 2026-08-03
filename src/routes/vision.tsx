import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Eye, Heart } from "lucide-react";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/vision")({
  component: VisionPage,
  head: () => ({
    meta: [
      { title: "Vision & Mission — Grace Cathedral" },
      {
        name: "description",
        content:
          "Our mission, vision and core values, with the scriptures that shape them and the road we are walking to 2030.",
      },
      { property: "og:title", content: "Vision & Mission" },
      { property: "og:description", content: "Where Grace Cathedral is going, and why." },
    ],
  }),
});

const pillars = [
  {
    Icon: Compass,
    label: "Mission",
    text: "To help every person in our city meet Jesus, grow deep roots and serve with joy.",
    verse: "Matthew 28:19-20",
  },
  {
    Icon: Eye,
    label: "Vision",
    text: "A church so woven into Accra that the city would grieve its absence.",
    verse: "Jeremiah 29:7",
  },
  {
    Icon: Heart,
    label: "Heart",
    text: "Worship that is honest, community that is safe, generosity that is contagious.",
    verse: "Acts 2:42-47",
  },
];

const values = [
  { title: "Presence over programme", text: "We measure health by transformed people, not full calendars." },
  { title: "Everyone plays", text: "Ministry belongs to the whole church, not a professional few." },
  { title: "Truth with tenderness", text: "We refuse to choose between conviction and kindness." },
  { title: "Open hands", text: "What we hold, we hold loosely and share quickly." },
];

const roadmap = [
  { year: "2026", title: "Break ground", text: "Begin construction of the new sanctuary and community centre." },
  { year: "2027", title: "Ten new groups", text: "Plant neighbourhood groups in ten underserved districts." },
  { year: "2028", title: "Training school", text: "Launch a two-year lay leadership and counselling school." },
  { year: "2030", title: "Send a church", text: "Commission a daughter congregation in the Northern Region." },
];

function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="Vision & Mission"
        title="A church for the city, not just in it"
        description="Clarity keeps a church kind. Here is exactly what we are for, what we are chasing, and how we intend to get there."
      />

      <Section>
        <ul className="grid gap-6 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.label} delay={i * 100}>
              <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-soft card-lift">
                <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal">
                  <p.Icon className="size-6" />
                </span>
                <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  {p.label}
                </h2>
                <p className="mt-3 flex-1 text-xl font-semibold leading-snug tracking-tight">
                  {p.text}
                </p>
                <p className="mt-6 text-sm text-muted-foreground">{p.verse}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <div className="bg-surface">
        <Section>
          <Reveal>
            <SectionTitle eyebrow="Core values" title="Four commitments we keep returning to" />
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft card-lift">
                  <h3 className="text-lg font-bold tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>
      </div>

      <Section>
        <Reveal>
          <SectionTitle eyebrow="The road ahead" title="Our 2030 journey" align="center" />
        </Reveal>
        <ol className="mt-14 grid gap-8 md:grid-cols-4">
          {roadmap.map((r, i) => (
            <Reveal as="li" key={r.year} delay={i * 90}>
              <div className="relative h-full rounded-3xl border border-border bg-card p-7 shadow-soft card-lift">
                <span className="text-4xl font-extrabold tracking-tight text-gradient-gold">
                  {r.year}
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/give">Help us get there</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  );
}