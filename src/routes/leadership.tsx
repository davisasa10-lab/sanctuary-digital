import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { PageHero, Section } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { leaders } from "@/data/church";
import pastorImg from "@/assets/pastor.jpg";

export const Route = createFileRoute("/leadership")({
  component: LeadershipPage,
  head: () => ({
    meta: [
      { title: "Leadership Team — Next Gen Church Pastors and Elders" },
      {
        name: "description",
        content:
          "Meet the pastors, elders and directors who shepherd Next Gen Church — their stories, focus areas and how to reach them.",
      },
      { property: "og:title", content: "Meet our leadership" },
      { property: "og:description", content: "The pastors and elders who serve Next Gen Church." },
    ],
  }),
});

function initials(name: string) {
  return name
    .replace(/^(Pastor|Rev\.|Dr\.)\s+/, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="Shepherds, not celebrities"
        description="Our team is accountable, accessible and genuinely glad to hear from you. Reach out to any of them directly."
      />
      <Section>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {leaders.map((l, i) => (
            <Reveal as="li" key={l.name} delay={i * 80}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft card-lift">
                {i === 0 ? (
                  <img
                    src={pastorImg}
                    alt={`Portrait of ${l.name}`}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-4/5 w-full place-items-center gradient-hero">
                    <span className="text-5xl font-extrabold tracking-tight text-gradient-gold">
                      {initials(l.name)}
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-7">
                  <h2 className="text-lg font-bold tracking-tight">{l.name}</h2>
                  <p className="mt-1 text-sm font-medium text-gold">{l.role}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {l.bio}
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <Button asChild size="sm" className="rounded-full">
                      <a href={`mailto:${l.email}`}>
                        <Mail className="mr-1.5 size-4" /> Contact
                      </a>
                    </Button>
                    <div className="ml-auto flex gap-1">
                      {[
                        { Icon: Twitter, label: "X profile" },
                        { Icon: Instagram, label: "Instagram profile" },
                        { Icon: Facebook, label: "Facebook profile" },
                      ].map(({ Icon, label }) => (
                        <a
                          key={label}
                          href="#"
                          aria-label={`${l.name} ${label}`}
                          className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                        >
                          <Icon className="size-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}