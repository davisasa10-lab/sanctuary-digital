import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { toast } from "sonner";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { church, faqs } from "@/data/church";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact & Visit — Grace Cathedral Accra" },
      {
        name: "description",
        content:
          "Find us on Independence Avenue in Accra: directions, office hours, phone, email and answers to common first-visit questions.",
      },
      { property: "og:title", content: "Contact Grace Cathedral" },
      { property: "og:description", content: "Directions, office hours and how to reach us." },
    ],
  }),
});

const hours = [
  ["Monday - Thursday", "9:00 AM - 5:00 PM"],
  ["Friday", "9:00 AM - 3:00 PM"],
  ["Saturday", "By appointment"],
  ["Sunday", "7:00 AM - 1:00 PM"],
];

function ContactPage() {
  const [sending, setSending] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Come and see — we'll save you a seat"
        description="Questions about faith, a visit, a wedding or a hard week? Someone real reads every message."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10">
              <SectionTitle eyebrow="Message us" title="Send a note" />
              <form
                className="mt-8 grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  setSending(true);
                  setTimeout(() => {
                    setSending(false);
                    toast.success("Message sent", {
                      description: "Our team replies within one working day.",
                    });
                    form.reset();
                  }, 900);
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="contact-name">Full name</Label>
                    <Input id="contact-name" required className="h-12 rounded-xl" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" required className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input id="contact-subject" className="h-12 rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-message">How can we help?</Label>
                  <Textarea id="contact-message" required rows={5} className="rounded-xl" />
                </div>
                <Button
                  type="submit"
                  disabled={sending}
                  className="h-12 w-fit rounded-full px-8"
                >
                  {sending ? "Sending…" : "Send message"}
                </Button>
              </form>
            </div>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={100}>
              <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
                <iframe
                  title="Map showing Grace Cathedral on Independence Avenue, Accra"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.211%2C5.545%2C-0.171%2C5.575&layer=mapnik"
                  className="h-72 w-full border-0"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                    {church.address}
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-gold" />
                    {church.phone}
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 shrink-0 text-gold" />
                    {church.email}
                  </li>
                </ul>
                <h3 className="mt-8 flex items-center gap-2 text-sm font-semibold">
                  <Clock className="size-4 text-gold" /> Office hours
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {hours.map(([day, time]) => (
                    <li key={day} className="flex justify-between gap-4">
                      <span>{day}</span>
                      <span className="text-foreground">{time}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex gap-2">
                  {[
                    { Icon: Facebook, label: "Facebook" },
                    { Icon: Instagram, label: "Instagram" },
                    { Icon: Youtube, label: "YouTube" },
                  ].map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                    >
                      <Icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <div className="bg-surface">
        <Section>
          <Reveal>
            <SectionTitle eyebrow="FAQ" title="Before you visit" align="center" />
          </Reveal>
          <Reveal delay={100} className="mx-auto mt-10 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </Section>
      </div>
    </>
  );
}