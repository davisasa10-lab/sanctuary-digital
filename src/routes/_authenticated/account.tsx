import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Headphones, HandCoins, LogOut, Play, Trash2, User, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "My Account | Next Gen Church" },
      { name: "description", content: "Your giving history and media you can continue watching." },
      { property: "og:title", content: "My Next Gen Church account" },
      { property: "og:description", content: "Giving history and continue watching." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function fmtTime(s: number) {
  const t = Math.max(0, Math.floor(s));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

function resumeUrl(url: string | null, seconds: number, type: string) {
  if (!url) return "/media";
  const s = Math.floor(seconds);
  if (s <= 0) return url;
  if (/youtu\.?be/.test(url)) return `${url}${url.includes("?") ? "&" : "?"}t=${s}`;
  if (type === "podcast") return `/media?tab=podcasts`;
  return `${url}#t=${s}`;
}

function AccountPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const user = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });
  const progress = useQuery({
    queryKey: ["my-progress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_media_progress")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const donations = useQuery({
    queryKey: ["my-donations", user.data?.email],
    enabled: !!user.data?.email,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .ilike("email", user.data!.email!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function remove(id: string) {
    await supabase.from("user_media_progress").delete().eq("id", id);
    void progress.refetch();
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  const gifts = donations.data ?? [];
  const total = gifts.reduce((n, d) => n + Number(d.amount), 0);
  const items = progress.data ?? [];
  const name = (user.data?.user_metadata?.["full_name"] as string | undefined) || user.data?.email;

  return (
    <Section className="min-h-[80vh]">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">My account</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Welcome back{name ? `, ${name}` : ""}</h1>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => void signOut()}>
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </div>

        <Tabs defaultValue="watching" className="mt-8">
          <TabsList className="rounded-full">
            <TabsTrigger value="watching" className="gap-1.5 rounded-full px-5"><Play className="size-4" /> Continue watching</TabsTrigger>
            <TabsTrigger value="giving" className="gap-1.5 rounded-full px-5"><HandCoins className="size-4" /> Giving</TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5 rounded-full px-5"><User className="size-4" /> Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="watching" className="mt-6">
            {progress.isLoading ? (
              <Skeleton className="h-40 w-full rounded-3xl" />
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">Nothing in progress yet.</p>
                <Button asChild className="mt-4 rounded-full"><Link to="/media">Browse media</Link></Button>
              </div>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((it) => {
                  const pct = it.duration_seconds > 0 ? Math.min(100, (Number(it.progress_seconds) / Number(it.duration_seconds)) * 100) : 0;
                  const Icon = it.media_type === "podcast" ? Headphones : Video;
                  return (
                    <li key={it.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                      {it.thumbnail_url ? (
                        <img src={it.thumbnail_url} alt={it.title} className="aspect-video w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="grid aspect-video place-items-center bg-primary/10 text-primary"><Icon className="size-8" /></div>
                      )}
                      <div className="p-5">
                        <h3 className="font-bold leading-snug tracking-tight">{it.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {it.completed ? "Finished" : Number(it.progress_seconds) > 0
                            ? `${fmtTime(Number(it.progress_seconds))}${it.duration_seconds > 0 ? ` / ${fmtTime(Number(it.duration_seconds))}` : ""}`
                            : `Opened ${formatDate(it.updated_at)}`}
                        </p>
                        {pct > 0 ? <Progress value={pct} className="mt-3 h-1.5" /> : null}
                        <div className="mt-4 flex gap-2">
                          <Button asChild size="sm" className="rounded-full">
                            <a href={resumeUrl(it.media_url, Number(it.progress_seconds), it.media_type)} target={it.media_type === "podcast" ? undefined : "_blank"} rel="noreferrer">
                              <Play className="mr-1.5 size-4" /> {it.completed ? "Watch again" : "Resume"}
                            </a>
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-full" aria-label="Remove" onClick={() => void remove(it.id)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="giving" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Total given</p>
                <p className="mt-2 text-3xl font-extrabold">₵{total.toLocaleString()}</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Gifts</p>
                <p className="mt-2 text-3xl font-extrabold">{gifts.length}</p>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
              {donations.isLoading ? (
                <Skeleton className="m-6 h-24" />
              ) : gifts.length === 0 ? (
                <p className="p-10 text-center text-sm text-muted-foreground">No transactions linked to your email yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                    <tr><th className="p-4">Date</th><th className="p-4">Fund</th><th className="p-4">Method</th><th className="p-4">Reference</th><th className="p-4">Status</th><th className="p-4 text-right">Amount</th></tr>
                  </thead>
                  <tbody>
                    {gifts.map((d) => (
                      <tr key={d.id} className="border-b border-border last:border-0">
                        <td className="p-4">{formatDate(d.created_at)}</td>
                        <td className="p-4">{d.fund}</td>
                        <td className="p-4">{d.method}</td>
                        <td className="p-4 text-muted-foreground">{d.reference || "—"}</td>
                        <td className="p-4 capitalize">{d.status}</td>
                        <td className="p-4 text-right font-semibold">{d.currency === "GHS" ? "₵" : `${d.currency} `}{Number(d.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <Button asChild className="mt-6 rounded-full"><Link to="/give">Give again</Link></Button>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div><dt className="text-muted-foreground">Name</dt><dd className="font-semibold">{(user.data?.user_metadata?.["full_name"] as string) || "—"}</dd></div>
                <div><dt className="text-muted-foreground">Email</dt><dd className="font-semibold">{user.data?.email}</dd></div>
                <div><dt className="text-muted-foreground">Member since</dt><dd className="font-semibold">{user.data?.created_at ? formatDate(user.data.created_at) : "—"}</dd></div>
              </dl>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  );
}
