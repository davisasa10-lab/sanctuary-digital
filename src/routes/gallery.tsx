import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import { PageHero, Section } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import bandImg from "@/assets/worship-band.jpg";
import kidsImg from "@/assets/kids.jpg";
import outreachImg from "@/assets/outreach.jpg";
import communityImg from "@/assets/community.jpg";
import heroImg from "@/assets/hero-worship.jpg";
import pastorImg from "@/assets/pastor.jpg";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — Moments from Next Gen Church" },
      {
        name: "description",
        content:
          "Photo albums and video highlights from Sunday worship, kids ministry, outreach weekends and church life.",
      },
      { property: "og:title", content: "Next Gen Church gallery" },
      { property: "og:description", content: "Life together, in pictures and video." },
    ],
  }),
});

type Item = { src: string; alt: string; album: string; video?: boolean; tall?: boolean };

const items: Item[] = [
  { src: heroImg, alt: "Sunday worship at golden hour", album: "Worship", tall: true },
  { src: kidsImg, alt: "Grace Kids craft morning", album: "Kids" },
  { src: outreachImg, alt: "Food outreach volunteers", album: "Outreach" },
  { src: bandImg, alt: "Worship collective on stage", album: "Worship", video: true },
  { src: communityImg, alt: "Members greeting after service", album: "Community", tall: true },
  { src: pastorImg, alt: "Pastor Daniel Mensah portrait", album: "Community" },
  { src: outreachImg, alt: "Packing grocery boxes at dawn", album: "Outreach", video: true },
  { src: kidsImg, alt: "Children learning together", album: "Kids" },
];

const albums = ["All", "Worship", "Kids", "Outreach", "Community"];

function GalleryPage() {
  const [album, setAlbum] = useState("All");
  const [lightbox, setLightbox] = useState<Item | null>(null);
  const shown = items.filter((i) => album === "All" || i.album === album);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments worth keeping"
        description="Sundays, camps, baptisms and ordinary Tuesdays — the life of this family, one frame at a time."
      />

      <Section>
        <Reveal>
          <Tabs value={album} onValueChange={setAlbum}>
            <TabsList className="rounded-full">
              {albums.map((a) => (
                <TabsTrigger key={a} value={a} className="rounded-full px-4">
                  {a}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Reveal>

        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {shown.map((item, i) => (
            <Reveal key={`${item.alt}-${i}`} delay={i * 60} className="break-inside-avoid">
              <button
                onClick={() => setLightbox(item)}
                className="group relative block w-full overflow-hidden rounded-3xl"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    item.tall ? "aspect-3/4" : "aspect-4/3"
                  }`}
                />
                <span className="absolute inset-0 bg-[oklch(0.16_0.03_262/0)] transition-colors duration-300 group-hover:bg-[oklch(0.16_0.03_262/0.35)]" />
                {item.video ? (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-14 place-items-center rounded-full bg-gold text-gold-foreground">
                      <Play className="ml-0.5 size-6 fill-current" />
                    </span>
                  </span>
                ) : null}
                <span className="absolute bottom-4 left-4 rounded-full bg-card/90 px-3 py-1 text-xs font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.album}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-3xl border-0 p-0">
          <DialogTitle className="sr-only">{lightbox?.alt ?? "Gallery image"}</DialogTitle>
          {lightbox ? (
            <img src={lightbox.src} alt={lightbox.alt} className="w-full object-contain" />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}