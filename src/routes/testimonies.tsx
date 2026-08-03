import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Quote } from "lucide-react";
import { toast } from "sonner";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { testimonies } from "@/data/church";

export const Route = createFileRoute("/testimonies")({
  component: TestimoniesPage,
  head: () => ({
    meta: [
      { title: "Testimonies — Stories of Changed Lives | Grace Cathedral" },
      {
        name: "description",
        content:
          "Written and video testimonies from members of Grace Cathedral, plus an invitation to share your own story.",
      },
      { property: "og:title", content: "Testimonies" },
      { property: "og:description", content: "Real stories from our church family." },
    ],
  }),
});

const filters = ["All", "Written", "Video"];

function TestimoniesPage() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const shown = testimonies.filter((t) => filter === "All" || t.type === filter);
  const featured = testimonies[0]!;

  return (
    <>
      <PageHero
        eyebrow="Testimonies"
        title="What God has done, said out loud"
        description="Stories carry hope further than statistics ever will. These are a few from our family."
      >
        <Button
          className="h-12 rounded-full bg-gold px-8 text-gold-foreground hover:bg-gold/90"
          onClick={() => setOpen(true)}
        >
          Share your story
        </Button>
      </PageHero>

      <Section>
        <Reveal>
          <figure className="rounded-[2rem] border border-border bg-card p-10 shadow-lift sm:p-14">
            <Quote className="size-8 text-gold" />
            <blockquote className="mt-6 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
              "{featured.quote}"
            </blockquote>
            <figcaption className="mt-8 text-sm">
              <span className="font-semibold">{featured.name}</span>
              <span className="block text-muted-foreground">{featured.role}</span>
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      <div className="bg-surface">
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionTitle eyebrow="All stories" title="Browse testimonies" />
            </Reveal>
            <Reveal delay={80}>
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="rounded-full">
                  {filters.map((f) => (
                    <TabsTrigger key={f} value={f} className="rounded-full px-4">
                      {f}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </Reveal>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {shown.map((t, i) => (
              <Reveal as="li" key={t.name} delay={i * 80}>
                <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-soft card-lift">
                  <Badge variant="secondary" className="w-fit rounded-full">
                    {t.type}
                  </Badge>
                  <blockquote className="mt-4 flex-1 text-base leading-relaxed">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between gap-4 text-sm">
                    <span>
                      <span className="font-semibold">{t.name}</span>
                      <span className="block text-muted-foreground">{t.role}</span>
                    </span>
                    {t.type === "Video" ? (
                      <span className="grid size-11 place-items-center rounded-full bg-gold text-gold-foreground">
                        <Play className="ml-0.5 size-5 fill-current" />
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </Section>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Share your testimony</DialogTitle>
            <DialogDescription>
              Tell us what God has done. We'll reach out before publishing anything.
            </DialogDescription>
          </DialogHeader>
          <form
            id="testimony-form"
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you for sharing", {
                description: "Our team will be in touch soon.",
              });
              setOpen(false);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="testimony-name">Your name</Label>
              <Input id="testimony-name" required className="h-11 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="testimony-story">Your story</Label>
              <Textarea id="testimony-story" required rows={5} className="rounded-xl" />
            </div>
          </form>
          <DialogFooter>
            <Button type="submit" form="testimony-form" className="rounded-full">
              Submit story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}