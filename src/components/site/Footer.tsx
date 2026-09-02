import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { church, services } from "@/data/church";
import logo from "@/assets/nxg-logo.png";

const columns = [
  {
    title: "Church",
    links: [
      { to: "/about", label: "About" },
      { to: "/vision", label: "Vision & Mission" },
      { to: "/leadership", label: "Leadership" },
      { to: "/ministries", label: "Ministries" },
    ],
  },
  {
    title: "Media",
    links: [
      { to: "/sermons", label: "Sermons" },
      { to: "/media", label: "Media & live" },
      { to: "/gallery", label: "Gallery" },
      { to: "/testimonies", label: "Testimonies" },
    ],
  },
  {
    title: "Connect",
    links: [
      { to: "/events", label: "Events" },
      { to: "/prayer", label: "Prayer request" },
      { to: "/give", label: "Give" },
      { to: "/contact", label: "Contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={logo}
                alt={`${church.name} logo`}
                className="size-10 rounded-xl object-cover"
              />
              <span className="text-lg font-extrabold tracking-tight">{church.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {church.tagline}. Join us in person or online any week of the year.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                {church.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-gold" />
                {church.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-gold" />
                {church.email}
              </li>
            </ul>
            <div className="mt-6 flex gap-2">
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

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-sm font-semibold">Service times</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {services.map((s) => (
                  <li key={s.name}>
                    <span className="block text-foreground">{s.day}</span>
                    {s.time}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Stay close to the family</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                One thoughtful email each week: the sermon, upcoming events and a short devotional.
              </p>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("You're subscribed", {
                  description: "Look out for our next note this Friday.",
                });
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-12 rounded-full px-5"
              />
              <Button type="submit" className="h-12 rounded-full px-7">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {church.name}. All rights reserved.
          </p>
          <p>Built with reverence, care and open doors.</p>
        </div>
      </div>
    </footer>
  );
}