import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, MapPin, Play, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { Section, SectionTitle } from "@/components/site/PageHero";
import { church, events, ministries, services, sermons, stats, testimonies } from "@/data/church";
import heroImg from "@/assets/hero-worship.jpg";
import pastorImg from "@/assets/pastor.jpg";
import communityImg from "@/assets/community.jpg";
import bandImg from "@/assets/worship-band.jpg";
import kidsImg from "@/assets/kids.jpg";
import outreachImg from "@/assets/outreach.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Next Gen Church — A Church in Accra to Belong, Believe, Become" },
      {
        name: "description",
        content:
          "Sunday services at 7:30 and 9:30 AM in Accra. Watch sermons, join a ministry, request prayer and give — online or in person.",
      },
      { property: "og:title", content: "Next Gen Church — Belong, Believe, Become" },
      {
        property: "og:description",
        content: "Modern worship, deep teaching and a family that will know your name.",
      },
    ],
  }),
});

const featured = sermons[0]!;

function Index() {
  return (
    <>
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Congregation worshipping at Next Gen Church during golden hour"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[oklch(0.12_0.03_262)] via-[oklch(0.12_0.03_262/0.82)] to-[oklch(0.12_0.03_262/0.45)]" />
        <div className="pointer-events-none absolute -right-20 top-24 size-96 rounded-full bg-gold/15 blur-3xl float-slow" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-40 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl text-hero-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-md">
              Welcome home
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.03] tracking-tight text-shadow-hero sm:text-6xl lg:text-7xl">
              A place to belong,
              <br />
              believe and <span className="text-gradient-gold">become</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-hero-foreground/80 sm:text-lg">
              {church.name} is a family in the heart of Accra learning to love God and our city
              well. Whoever you are, whatever you carry — there is a seat here for you.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-13 rounded-full px-8 text-base">
                <Link to="/live">
                  Watch this Sunday <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-full border-white/30 bg-white/10 px-8 text-base text-hero-foreground backdrop-blur-md hover:bg-white/20 hover:text-hero-foreground"
              >
                <Link to="/about">Plan your visit</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={200} className="mt-16">
            <div className="grid gap-px overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <div key={s.name} className="bg-white/5 p-6 text-hero-foreground">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                    {s.day}
                  </p>
                  <p className="mt-2 text-lg font-bold">{s.name}</p>
                  <p className="mt-1 text-sm text-hero-foreground/70">{s.time}</p>
                  <p className="mt-3 text-xs text-hero-foreground/60">{s.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Welcome */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionTitle
              eyebrow="Our welcome"
              title="You don't have to have it all together to walk through our doors."
              description="We are ordinary people encountering an extraordinary God. Expect honest teaching, unhurried worship, strong coffee and someone who will learn your name before you leave."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Come as you are", "No dress code, no pressure, no spotlight."],
                ["Real community", "Small groups in every neighbourhood of the city."],
                ["Kids are safe", "Checked-in, loved and taught at their level."],
                ["Rooted teaching", "Scripture opened clearly and applied to Monday."],
              ].map(([title, text], i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-soft card-lift">
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150} className="relative">
            <img
              src={communityImg}
              alt="Members greeting one another after a Sunday service"
              width={1280}
              height={960}
              loading="lazy"
              className="aspect-4/3 w-full rounded-[2rem] object-cover shadow-lift"
            />
            <div className="absolute -bottom-8 -left-4 hidden rounded-2xl border border-border bg-card p-5 shadow-lift sm:block">
              <p className="text-3xl font-extrabold text-royal">
                <Counter to={120} suffix="+" />
              </p>
              <p className="text-xs text-muted-foreground">people found a small group this year</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Latest sermon */}
      <div className="bg-surface">
        <Section>
          <Reveal>
            <SectionTitle
              eyebrow="Latest message"
              title="This week at Grace"
              description="Missed Sunday? Catch the full message, or browse the archive by series, speaker and scripture."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft lg:grid-cols-[1.3fr_1fr]">
              <div className="group relative">
                <img
                  src={bandImg}
                  alt="Worship team leading during a service"
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="aspect-video size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 grid place-items-center bg-[oklch(0.16_0.03_262/0.45)]">
                  <Link
                    to="/sermons"
                    aria-label={`Play ${featured.title}`}
                    className="grid size-20 place-items-center rounded-full bg-gold text-gold-foreground transition-transform duration-300 hover:scale-110"
                  >
                    <Play className="ml-1 size-8 fill-current" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-royal text-royal-foreground">
                    {featured.series}
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    {featured.scripture}
                  </Badge>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight">{featured.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {featured.speaker} · {featured.date} · {featured.duration}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  When the ground shifts beneath us, hope is not wishful thinking — it is an anchor
                  fastened to something that cannot move.
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Button asChild className="rounded-full">
                    <Link to="/sermons">Watch now</Link>
                  </Button>
                  <Button asChild variant="ghost" className="rounded-full">
                    <Link to="/sermons">All sermons</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </div>

      {/* Events */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionTitle eyebrow="What's coming" title="Upcoming events" />
          </Reveal>
          <Reveal delay={80}>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/events">View calendar</Link>
            </Button>
          </Reveal>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 100}>
              <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-soft card-lift">
                <Badge variant="secondary" className="w-fit rounded-full">
                  {e.category}
                </Badge>
                <h3 className="mt-4 text-xl font-bold tracking-tight">{e.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {e.description}
                </p>
                <dl className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-gold" />
                    {new Date(e.date).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-gold" />
                    {new Date(e.date).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-gold" />
                    {e.location}
                  </div>
                </dl>
                <Button asChild variant="ghost" className="mt-6 w-fit rounded-full px-0">
                  <Link to="/events">
                    Details <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Pastor */}
      <div className="bg-surface">
        <Section>
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <img
                src={pastorImg}
                alt="Portrait of Pastor Daniel Mensah"
                width={1024}
                height={1280}
                loading="lazy"
                className="aspect-4/5 w-full rounded-[2rem] object-cover shadow-lift"
              />
            </Reveal>
            <Reveal delay={120}>
              <SectionTitle
                eyebrow="Meet the pastor"
                title="Pastor Daniel Mensah"
                description="For fourteen years Daniel has taught this congregation with clarity and warmth. He and his wife Esi have three children, a stubborn love for Accra, and an open front door."
              />
              <blockquote className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-soft">
                <Quote className="size-6 text-gold" />
                <p className="mt-4 text-lg font-medium leading-relaxed">
                  "The church is not a building you visit. It is a family you are handed — imperfect,
                  praying, and stubbornly for you."
                </p>
              </blockquote>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="rounded-full">
                  <Link to="/leadership">Meet the team</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/prayer">Request prayer</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </Section>
      </div>

      {/* Ministries */}
      <Section>
        <Reveal>
          <SectionTitle
            eyebrow="Ministries"
            title="Find your people, find your place"
            description="Twenty-four teams serving across worship, care, kids, outreach and prayer. There is room for what you carry."
            align="center"
          />
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.slice(0, 6).map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 70}>
              <article className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft card-lift">
                <h3 className="text-lg font-bold tracking-tight">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
                <p className="mt-5 text-xs uppercase tracking-widest text-gold">{m.schedule}</p>
                <p className="mt-1 text-sm text-muted-foreground">Led by {m.leader}</p>
              </article>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-10 text-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/ministries">Explore all ministries</Link>
          </Button>
        </Reveal>
      </Section>

      {/* Stats */}
      <div className="gradient-hero relative overflow-hidden text-primary-foreground">
        <div className="pointer-events-none absolute -left-10 top-0 size-72 rounded-full bg-gold/15 blur-3xl float-slow" />
        <Section>
          <ul className="grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 90}>
                <p className="text-5xl font-extrabold tracking-tight text-gradient-gold">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-sm text-primary-foreground/70">{s.label}</p>
              </Reveal>
            ))}
          </ul>
        </Section>
      </div>

      {/* Testimonies */}
      <Section>
        <Reveal>
          <SectionTitle
            eyebrow="Testimonies"
            title="Stories from our family"
            align="center"
          />
        </Reveal>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonies.slice(0, 4).map((t, i) => (
            <Reveal as="li" key={t.name} delay={i * 80}>
              <figure className="h-full rounded-3xl border border-border bg-card p-8 shadow-soft card-lift">
                <Quote className="size-5 text-gold" />
                <blockquote className="mt-4 text-base leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="block text-muted-foreground">{t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Gallery preview */}
      <div className="bg-surface">
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionTitle eyebrow="Gallery" title="Life together, in pictures" />
            </Reveal>
            <Reveal delay={80}>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/gallery">Open gallery</Link>
              </Button>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { src: bandImg, alt: "Worship team on stage" },
              { src: kidsImg, alt: "Children in Grace Kids class" },
              { src: outreachImg, alt: "Volunteers packing food boxes" },
              { src: communityImg, alt: "Members greeting after service" },
            ].map((img, i) => (
              <Reveal key={img.alt} delay={i * 80}>
                <div className="group overflow-hidden rounded-2xl">
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      {/* Giving CTA */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] gradient-hero px-8 py-16 text-center text-primary-foreground sm:px-16">
            <div className="pointer-events-none absolute -right-10 -top-10 size-72 rounded-full bg-gold/20 blur-3xl float-slow" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Giving</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Every gift feeds a family, teaches a child, sends a team
              </h2>
              <p className="mt-4 text-primary-foreground/75">
                Generosity is how this church breathes. Give once or set a rhythm — securely, in
                under a minute.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="h-13 rounded-full bg-gold px-8 text-base text-gold-foreground hover:bg-gold/90">
                  <Link to="/give">Give today</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-13 rounded-full border-white/30 bg-white/10 px-8 text-base text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
                >
                  <Link to="/give">See our impact</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
