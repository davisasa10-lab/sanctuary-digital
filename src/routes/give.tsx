import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CreditCard, Landmark, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { campaigns } from "@/data/church";

export const Route = createFileRoute("/give")({
  component: GivePage,
  head: () => ({
    meta: [
      { title: "Give — Support the Mission of Next Gen Church" },
      {
        name: "description",
        content:
          "Give securely by mobile money, card or bank transfer. See live campaign progress and the impact of every cedi.",
      },
      { property: "og:title", content: "Give to Next Gen Church" },
      { property: "og:description", content: "Fuel outreach, kids ministry and the new sanctuary." },
    ],
  }),
});

const methods = [
  { Icon: Smartphone, title: "Mobile money", text: "MTN, Telecel and AirtelTigo — merchant ID 445 219." },
  { Icon: CreditCard, title: "Card", text: "Visa and Mastercard, one-off or recurring." },
  { Icon: Landmark, title: "Bank transfer", text: "Standard Chartered · 0100 4429 8871." },
  { Icon: Building2, title: "In person", text: "Giving stations at both entrances every Sunday." },
];

const amounts = [50, 100, 250, 500];

function GivePage() {
  const [amount, setAmount] = useState(100);

  return (
    <>
      <PageHero
        eyebrow="Give"
        title="Generosity is how this church breathes"
        description="Your giving feeds families, keeps kids ministry free, funds counselling and is building a sanctuary for the next generation."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-10">
              <SectionTitle eyebrow="Quick give" title="Choose an amount" />
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {amounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    aria-pressed={amount === a}
                    className={`rounded-2xl border px-4 py-4 text-base font-semibold transition-all duration-300 ${
                      amount === a
                        ? "border-gold bg-gold/10 text-foreground"
                        : "border-border hover:border-gold/60"
                    }`}
                  >
                    ₵{a}
                  </button>
                ))}
              </div>
              <Button
                size="lg"
                className="mt-8 h-13 w-full rounded-full bg-gold text-base text-gold-foreground hover:bg-gold/90"
                onClick={() =>
                  toast.success("Thank you", {
                    description: `Your gift of ₵${amount} is being processed securely.`,
                  })
                }
              >
                Give ₵{amount} securely
              </Button>
              <Alert className="mt-6 rounded-2xl">
                <ShieldCheck className="size-4" />
                <AlertTitle>Secure and accountable</AlertTitle>
                <AlertDescription>
                  Payments are encrypted end to end, and our finances are independently audited each
                  year.
                </AlertDescription>
              </Alert>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {methods.map((m, i) => (
              <Reveal key={m.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft card-lift">
                  <span className="grid size-11 place-items-center rounded-2xl bg-royal/10 text-royal">
                    <m.Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <div className="bg-surface">
        <Section>
          <Reveal>
            <SectionTitle eyebrow="Campaigns" title="What we're building together" align="center" />
          </Reveal>
          <ul className="mt-12 grid gap-6 lg:grid-cols-3">
            {campaigns.map((c, i) => {
              const pct = Math.round((c.raised / c.goal) * 100);
              return (
                <Reveal as="li" key={c.title} delay={i * 90}>
                  <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-soft card-lift">
                    <h3 className="text-xl font-bold tracking-tight">{c.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                    <div className="mt-6">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="text-2xl font-extrabold">
                          ₵<Counter to={c.raised} />
                        </span>
                        <span className="text-muted-foreground">
                          of ₵{c.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={pct} className="mt-3 h-2" />
                      <p className="mt-2 text-xs text-muted-foreground">{pct}% funded</p>
                    </div>
                    <Button
                      className="mt-6 rounded-full"
                      onClick={() =>
                        toast.success("Thank you", { description: `Giving to ${c.title}.` })
                      }
                    >
                      Support this
                    </Button>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </Section>
      </div>

      <Section>
        <Reveal>
          <SectionTitle eyebrow="Impact" title="Where your giving went last year" align="center" />
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            ["62,400 meals", "served through the Feed the City programme"],
            ["180 students", "kept in school on full or partial scholarships"],
            ["1,100 hours", "of free professional counselling provided"],
          ].map(([stat, text], i) => (
            <Reveal as="li" key={stat} delay={i * 90}>
              <div className="h-full rounded-3xl border border-border bg-card p-8 text-center shadow-soft card-lift">
                <p className="text-3xl font-extrabold tracking-tight text-gradient-gold">{stat}</p>
                <p className="mt-3 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}