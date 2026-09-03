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
  FileText,
  Newspaper,
  Video,
  FolderOpen,
  ImagePlus,
  ShieldCheck,
  History,
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

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  adminOnly?: boolean;
};

const navGroups: Array<{ heading: string; items: NavItem[] }> = [
  {
    heading: "Overview",
    items: [{ to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true }],
  },
  {
    heading: "Content",
    items: [
      { to: "/dashboard/pages", label: "Pages", icon: FileText },
      { to: "/dashboard/news", label: "News", icon: Newspaper },
      { to: "/dashboard/events", label: "Events", icon: CalendarDays },
      { to: "/dashboard/sermons", label: "Sermons", icon: Mic },
      { to: "/dashboard/videos", label: "Videos", icon: Video },
      { to: "/dashboard/albums", label: "Gallery albums", icon: FolderOpen },
      { to: "/dashboard/gallery", label: "Gallery items", icon: Image },
      { to: "/dashboard/media", label: "Media library", icon: ImagePlus },
      { to: "/dashboard/live", label: "Live stream", icon: Radio },
    ],
  },
  {
    heading: "People",
    items: [
      { to: "/dashboard/inbox", label: "Prayer & messages", icon: Inbox },
      { to: "/dashboard/testimonies", label: "Testimonies", icon: Quote },
      { to: "/dashboard/people", label: "Leaders & ministries", icon: Users },
      { to: "/dashboard/users", label: "Users & roles", icon: ShieldCheck, adminOnly: true },
    ],
  },
  {
    heading: "Admin",
    items: [
      { to: "/dashboard/giving", label: "Giving", icon: HandCoins, adminOnly: true },
      { to: "/dashboard/activity", label: "Activity log", icon: History, adminOnly: true },
    ],
  },
];

export type StaffRole = "admin" | "editor" | null;

/** Current user's CMS role, or null when they have none. */
export function useStaffRole() {
  return useQuery<StaffRole>({
    queryKey: ["staff-role"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return null;
      const { data, error } = await db.from("user_roles").select("role").eq("user_id", uid);
      if (error) return null;
      const roles = (data ?? []).map((r: Record<string, unknown>) => String(r["role"]));
      if (roles.includes("admin")) return "admin";
      if (roles.includes("editor")) return "editor";
      return null;
    },
  });
}

export function useIsAdmin() {
  const { data, ...rest } = useStaffRole();
  return { ...rest, data: data === "admin" } as const;
}

function AdminLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: role, isLoading } = useStaffRole();
  const isAdmin = role === "admin";
  const isStaff = role === "admin" || role === "editor";

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
          Church CMS{role ? ` · ${role}` : ""}
        </p>
        <nav className="mt-4 grid gap-4">
          {navGroups.map((group) => {
            const items = group.items.filter((i) => !i.adminOnly || isAdmin);
            if (items.length === 0) return null;
            return (
              <div key={group.heading} className="grid gap-1">
                <p className="px-3 pb-1 text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.heading}
                </p>
                {items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.exact ?? false }}
                    activeProps={{ className: "bg-primary text-primary-foreground" }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            );
          })}
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
        ) : isStaff ? (
          <Outlet />
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-14 text-center">
            <h1 className="text-xl font-bold">Dashboard access required</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your account is signed in but has not been granted an admin or editor role yet.
              Ask an existing administrator to add you.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}