import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Baby, Flame, Hand, HeartHandshake, Music, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHero, Section } from "@/components/site/PageHero";
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
import { ministries } from "@/data/church";
import bandImg from "@/assets/worship-band.jpg";
import kidsImg from "@/assets/kids.jpg";
import outreachImg from "@/assets/outreach.jpg";
import communityImg from "@/assets/community.jpg";

export const Route = createFileRoute("/ministries")({
  component: MinistriesPage,
  head: () => ({
    meta: [
      { title: "Ministries — Serve and Belong at Grace Cathedral" },
      {
        name: "description",
        content:
          "Worship, kids, youth, outreach, prayer and family ministries — meeting times, leaders and how to join a team this week.",
      },
      { property: "og:title", content: "Ministries at Grace Cathedral" },
      { property: "og:description", content: "Find your place to serve and belong." },
    ],
  }),
});

const icons = [Music, Baby, Flame, HeartHandshake, Hand, Users];
const images = [bandImg, kidsImg, communityImg, outreachImg, communityImg, kidsImg];

function MinistriesPage() {
  const [active, setActive] = useState<string | null>(null);
  const selected = ministries.find((m) => m.name === active);

  return (
    <>
      <PageHero
        eyebrow="Ministries"
        title="There is a team here shaped like you"
        description="Whether you sing, cook, code, count or simply show up early to open doors — your gift has a home."
      />

      <Section>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m, i) => {
            const Icon = icons[i % icons.length]!;
            return (
              <Reveal as="li" key={m.name} delay={i * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft card-lift">
                  <div className="relative overflow-hidden">
                    <img
                      src={images[i % images.length]}
                      alt={m.name}
                      width={1280}
                      height={960}
                      loading="lazy"
                      className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <span className="absolute left-5 top-5 grid size-11 place-items-center rounded-2xl bg-card text-royal shadow-soft">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="text-lg font-bold tracking-tight">{m.name}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {m.description}
                    </p>
                    <Badge variant="secondary" className="mt-5 w-fit rounded-full">
                      {m.schedule}
                    </Badge>
                    <p className="mt-3 text-sm text-muted-foreground">Led by {m.leader}</p>
                    <Button
                      className="mt-6 w-full rounded-full"
                      onClick={() => setActive(m.name)}
                    >
                      Join this ministry
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join {selected?.name}</DialogTitle>
            <DialogDescription>
              {selected?.leader} will reach out within a few days with next steps and the current
              rhythm of the team ({selected?.schedule}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setActive(null)}>
              Not yet
            </Button>
            <Button
              className="rounded-full"
              onClick={() => {
                toast.success("Request sent", {
                  description: `We've let ${selected?.leader} know you're interested.`,
                });
                setActive(null);
              }}
            >
              Count me in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}