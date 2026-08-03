import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Coffee, HeartHandshake, Sparkles } from "lucide-react";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { timeline } from "@/data/church";
import communityImg from "@/assets/community.jpg";
import outreachImg from "@/assets/outreach.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Grace Cathedral — Our Story, Beliefs and Welcome" },
      {
        name: "description",
        content:
          "From a living room in 1988 to a city-wide family: our history, core beliefs, values and exactly what to expect on your first Sunday.",
      },
      { property: "og:title", content: "About Grace Cathedral" },
      { property: "og:description", content: "Our story, beliefs and what to expect on a Sunday." },
    ],
  }),
});

const beliefs = [
  { title: "Scripture", text: "The Bible is God's trustworthy word, our guide for faith and life." },
  { title: "Jesus", text: "Fully God and fully human, crucified, risen and returning." },
  { title: "Grace", text: "We are saved by grace through faith — never by performance." },
  { title: "The Spirit", text: "God present with us, forming character and empowering mission." },
  { title: "The Church", text: "A global family, expressed locally in ordinary faithfulness." },
  { title: "Hope", text: "God is making all things new, and invites us into that work now." },
];

const expect = [
  { Icon: Coffee, title: "Arrive early", text: "Coffee from 7:00 AM. Hosts at every door to help you find a seat." },
  { Icon: Sparkles, title: "Worship", text: "About 30 minutes of sung worship — stand, sit, sing or simply listen." },
  { Icon: BookOpen, title: "Teaching", text: "A 35-minute message rooted in scripture and grounded in real life." },
  { Icon: HeartHandshake, title: "Stay after", text: "Prayer teams and a welcome desk for anyone new or curious." },
];

const values = [
  "Warm hospitality before polished performance",
  "Honesty about struggle, hope about healing",
  "Generosity as a habit, not an appeal",
  "Prayer as our first move, not our last resort",
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A living room prayer meeting that never stopped growing"
        description="For nearly four decades this church has been shaped by ordinary people who kept showing up for God and for one another."
      />

      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionTitle
              eyebrow="Our history"
              title="Founded in 1988 by twelve friends"
              description="They had no building, no budget and no band — just a conviction that Accra needed a church where honesty and hope could live in the same room. That conviction still runs the place."
            />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Today more than four thousand people call Grace Cathedral home across two Sunday
              gatherings, dozens of neighbourhood groups and a growing online congregation. The
              scale changed; the posture never has.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <img
              src={communityImg}
              alt="Church members greeting one another in the lobby"
              width={1280}
              height={960}
              loading="lazy"
              className="aspect-4/3 w-full rounded-[2rem] object-cover shadow-lift"
            />
          </Reveal>
        </div>
      </Section>

      <div className="bg-surface">
        <Section>
          <Reveal>
            <SectionTitle eyebrow="Journey" title="Milestones along the way" align="center" />
          </Reveal>
          <ol className="relative mx-auto mt-14 max-w-3xl border-l border-border pl-8">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 80} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[2.31rem] top-1 grid size-4 place-items-center rounded-full bg-gold ring-4 ring-background" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  {t.year}
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </Section>
      </div>

      <Section>
        <Reveal>
          <SectionTitle eyebrow="Core beliefs" title="What we hold to" align="center" />
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beliefs.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 70}>
              <article className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft card-lift">
                <h3 className="text-lg font-bold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <div className="bg-surface">
        <Section>
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <Reveal>
                <SectionTitle eyebrow="What to expect" title="Your first Sunday, minute by minute" />
              </Reveal>
              <ul className="mt-8 space-y-4">
                {expect.map((e, i) => (
                  <Reveal as="li" key={e.title} delay={i * 80}>
                    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal">
                        <e.Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold">{e.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{e.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
            <Reveal delay={140}>
              <img
                src={outreachImg}
                alt="Volunteers serving the community"
                width={1280}
                height={960}
                loading="lazy"
                className="aspect-4/3 w-full rounded-[2rem] object-cover shadow-lift"
              />
              <div className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-soft">
                <h3 className="text-xl font-bold tracking-tight">Our values</h3>
                <ul className="mt-4 space-y-3">
                  {values.map((v) => (
                    <li key={v} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                      {v}
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