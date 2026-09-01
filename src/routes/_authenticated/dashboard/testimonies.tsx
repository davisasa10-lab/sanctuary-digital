import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/lib/db-client";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard/testimonies")({
  component: TestimoniesAdmin,
});

type Row = Record<string, unknown>;

function TestimoniesAdmin() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["testimonies", "admin"],
    queryFn: async () => {
      const { data, error } = await db
        .from("testimonies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await db.from("testimonies").update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Testimony updated");
      void qc.invalidateQueries({ queryKey: ["testimonies"] });
      void qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e: Error) => toast.error("Could not update", { description: e.message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("testimonies").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Deleted");
      void qc.invalidateQueries({ queryKey: ["testimonies"] });
    },
  });

  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight">Testimonies</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Approve stories before they appear on the public testimonies page.
      </p>

      {isLoading ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : (data ?? []).length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No testimonies submitted yet.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {(data ?? []).map((t) => {
            const id = String(t["id"]);
            const status = String(t["status"] ?? "pending");
            return (
              <li key={id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{String(t["name"] ?? "")}</p>
                    <p className="text-xs text-muted-foreground">
                      {String(t["role"] ?? "")} · {String(t["type"] ?? "Written")} ·{" "}
                      {formatDate(String(t["created_at"]))}
                    </p>
                  </div>
                  <Badge
                    variant={status === "approved" ? "default" : "secondary"}
                    className="rounded-full capitalize"
                  >
                    {status}
                  </Badge>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  "{String(t["quote"] ?? "")}"
                </blockquote>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={status === "approved"}
                    onClick={() => update.mutate({ id, status: "approved" })}
                  >
                    Approve & publish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    disabled={status === "pending"}
                    onClick={() => update.mutate({ id, status: "pending" })}
                  >
                    Unpublish
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-destructive"
                    onClick={() => {
                      if (confirm("Delete this testimony?")) remove.mutate(id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}