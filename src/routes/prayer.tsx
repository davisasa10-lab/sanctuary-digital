import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { PageHero, Section, SectionTitle } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/prayer")({
  component: PrayerPage,
  head: () => ({
    meta: [
      { title: "Prayer Request — We Will Pray With You | Grace Cathedral" },
      {
        name: "description",
        content:
          "Share a confidential prayer request, anonymously if you prefer. Our intercession team prays over every request within 24 hours.",
      },
      { property: "og:title", content: "Request prayer" },
      { property: "og:description", content: "Confidential, anonymous if you wish, always prayed over." },
    ],
  }),
});

const categories = ["Healing", "Family", "Provision", "Guidance", "Salvation", "Thanksgiving"];

function PrayerPage() {
  const [anonymous, setAnonymous] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Prayer"
        title="You don't have to carry it alone"
        description="Our intercession team prays over every request within 24 hours. Nothing is too small, too messy or too late."
      />

      <Section>
        <div className="mx-auto max-w-2xl">
          {done ? (
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-lift">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 className="size-8" />
                </span>
                <h2 className="mt-6 text-2xl font-extrabold tracking-tight">
                  Your request has been received
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  It is already in the hands of our prayer team. If you left contact details,
                  someone will follow up gently this week.
                </p>
                <Button className="mt-8 rounded-full" onClick={() => setDone(false)}>
                  Submit another request
                </Button>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-10">
                <SectionTitle eyebrow="Request prayer" title="Tell us how to pray" />
                <form
                  className="mt-8 grid gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSending(true);
                    setTimeout(() => {
                      setSending(false);
                      setDone(true);
                    }, 900);
                  }}
                >
                  <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                    <div className="min-w-0 pr-4">
                      <Label htmlFor="anon" className="text-sm font-semibold">
                        Submit anonymously
                      </Label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        We'll pray without knowing who you are.
                      </p>
                    </div>
                    <Switch id="anon" checked={anonymous} onCheckedChange={setAnonymous} />
                  </div>

                  {!anonymous && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="prayer-name">Name</Label>
                        <Input id="prayer-name" className="h-12 rounded-xl" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="prayer-email">Email (optional)</Label>
                        <Input id="prayer-email" type="email" className="h-12 rounded-xl" />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="prayer-category">Category</Label>
                    <Select defaultValue="Healing">
                      <SelectTrigger id="prayer-category" className="h-12 rounded-xl">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="prayer-body">Your request</Label>
                    <Textarea id="prayer-body" required rows={6} className="rounded-xl" />
                  </div>

                  <Alert className="rounded-2xl">
                    <Lock className="size-4" />
                    <AlertTitle>Kept in confidence</AlertTitle>
                    <AlertDescription>
                      Requests are seen only by our trained intercession team and are never shared
                      publicly without your written permission.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="h-12 w-full rounded-full text-base"
                  >
                    {sending ? "Sending…" : "Send prayer request"}
                  </Button>
                </form>
              </div>
            </Reveal>
          )}
        </div>
      </Section>
    </>
  );
}