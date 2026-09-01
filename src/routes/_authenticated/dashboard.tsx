import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  HandCoins,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mic,
  Quote,
  Radio,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/db-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Church Admin Dashboard | Next Gen Church" },
      {
        name: "description",
        content:
          "Manage events, sermons, gallery, testimonies, giving, prayer requests and the live stream.",
      },
      { property: "og:title", content: "Next Gen Church admin" },
      { property: "og:description", content: "Internal church management dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/events", label: "Events", icon: CalendarDays },
  { to: "/dashboard/sermons", label: "Sermons", icon: Mic },
  { to: "/dashboard/gallery", label: "Gallery", icon: Image },
  { to: "/dashboard/inbox", label: "Prayer & messages", icon: Inbox },
  { to: "/dashboard/testimonies", label: "Testimonies", icon: Quote },
  { to: "/dashboard/people", label: "Leaders & ministries", icon: Users },
  { to: "/dashboard/giving", label: "Giving", icon: HandCoins },
  { to: "/dashboard/live", label: "Live stream", icon: Radio },
] as const;

export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return false;
      const { data, error } = await db
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return Boolean(data);
    },
  });
}

function AdminLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: isAdmin, isLoading } = useIsAdmin();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-28 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="px-3 text-xs font-semibold uppercase tracking-widest text-gold">
          Church admin
        </p>
        <nav className="mt-4 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="mt-4 w-full justify-start gap-3 rounded-xl px-3 text-sm text-muted-foreground"
          onClick={() => void signOut()}
        >
          <LogOut className="size-4" /> Sign out
        </Button>
      </aside>

      <main className="min-w-0">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : isAdmin ? (
          <Outlet />
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-14 text-center">
            <h1 className="text-xl font-bold">Admin access required</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your account is signed in but has not been granted the admin role yet. Ask an
              existing administrator to add you.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}