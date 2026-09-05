import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/lib/db-client";
import { logActivity } from "@/lib/activity";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useIsAdmin } from "@/routes/_authenticated/dashboard";

export const Route = createFileRoute("/_authenticated/dashboard/users")({
  component: UsersPage,
});

type Profile = { id: string; email: string | null; full_name: string | null };
type RoleRow = { user_id: string; role: string };

function UsersPage() {
  const qc = useQueryClient();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();

  const profiles = useQuery({
    queryKey: ["cms-profiles"],
    queryFn: async () => {
      const { data, error } = await db
        .from("profiles")
        .select("id, email, full_name")
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Profile[];
    },
    enabled: !!isAdmin,
  });

  const roles = useQuery({
    queryKey: ["cms-user-roles"],
    queryFn: async () => {
      const { data, error } = await db.from("user_roles").select("user_id, role");
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as RoleRow[];
    },
    enabled: !!isAdmin,
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "admin" | "editor" | null }) => {
      const { error: delErr } = await db.from("user_roles").delete().eq("user_id", userId);
      if (delErr) throw new Error(delErr.message);
      if (role) {
        const { error } = await db.from("user_roles").insert({ user_id: userId, role });
        if (error) throw new Error(error.message);
      }
      return { userId, role };
    },
    onSuccess: ({ userId, role }) => {
      void logActivity({
        action: "update",
        entity: "user_roles",
        entityId: userId,
        summary: role ? `Granted ${role} access` : "Removed dashboard access",
      });
      toast.success("Access updated");
      void qc.invalidateQueries({ queryKey: ["cms-user-roles"] });
      void qc.invalidateQueries({ queryKey: ["staff-role"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (roleLoading) return <Skeleton className="h-40 w-full" />;
  if (!isAdmin) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-14 text-center">
        <h1 className="text-xl font-bold">Admins only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only administrators can manage who has dashboard access.
        </p>
      </div>
    );
  }

  const roleOf = (id: string) => roles.data?.find((r) => r.user_id === id)?.role ?? null;

  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight">Users &amp; roles</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Give team members admin or editor access to the dashboard.
      </p>

      {profiles.isLoading ? (
        <Skeleton className="h-40 w-full rounded-3xl" />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Access</th>
                <th className="p-4 text-right font-semibold">Change</th>
              </tr>
            </thead>
            <tbody>
              {(profiles.data ?? []).map((p) => {
                const role = roleOf(p.id);
                return (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-4">{p.full_name || "—"}</td>
                    <td className="p-4 text-muted-foreground">{p.email ?? "—"}</td>
                    <td className="p-4">
                      {role ? (
                        <Badge className="rounded-full capitalize">{role}</Badge>
                      ) : (
                        <span className="text-muted-foreground">No access</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        {(["admin", "editor"] as const).map((r) => (
                          <Button
                            key={r}
                            size="sm"
                            variant={role === r ? "default" : "outline"}
                            className="rounded-full capitalize"
                            disabled={setRole.isPending}
                            onClick={() => setRole.mutate({ userId: p.id, role: r })}
                          >
                            {r}
                          </Button>
                        ))}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full"
                          disabled={setRole.isPending || !role}
                          onClick={() => setRole.mutate({ userId: p.id, role: null })}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(profiles.data ?? []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No accounts yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
