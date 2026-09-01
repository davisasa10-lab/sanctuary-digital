import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db-client";
import { formatDate, formatMoney } from "@/lib/format";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/giving")({
  component: GivingAdmin,
});

type Row = Record<string, unknown>;

function GivingAdmin() {
  const { data, isLoading } = useQuery({
    queryKey: ["donations", "admin"],
    queryFn: async () => {
      const { data, error } = await db
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });

  const rows = data ?? [];
  const total = rows
    .filter((d) => d["status"] === "completed")
    .reduce((sum, d) => sum + Number(d["amount"] ?? 0), 0);

  return (
    <div className="grid gap-14">
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight">Offerings, tithes & giving</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every gift recorded through the website, newest first.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Total completed
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-gold">
            {formatMoney(total)}
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="mt-6 h-40 rounded-2xl" />
        ) : rows.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No gifts recorded yet.
          </p>
        ) : (
          <ul className="mt-6 grid gap-3">
            {rows.map((d) => (
              <li
                key={String(d["id"])}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold">
                    {String(d["donor_name"] ?? "Anonymous")}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {String(d["fund"] ?? "General")}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(String(d["created_at"]))} · {String(d["method"] ?? "—")}
                    {d["reference"] ? ` · ${String(d["reference"])}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={d["status"] === "completed" ? "default" : "secondary"}
                    className="rounded-full capitalize"
                  >
                    {String(d["status"] ?? "pending")}
                  </Badge>
                  <span className="font-bold">
                    {formatMoney(Number(d["amount"] ?? 0), String(d["currency"] ?? "GHS"))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ResourceManager
        table="campaigns"
        title="Campaigns"
        description="Giving goals shown with progress bars on the Give page."
        orderBy={{ column: "created_at", ascending: true }}
        columns={[
          { key: "title", label: "Title" },
          { key: "raised", label: "Raised", render: (r) => formatMoney(Number(r["raised"] ?? 0)) },
          { key: "goal", label: "Goal", render: (r) => formatMoney(Number(r["goal"] ?? 0)) },
          { key: "active", label: "Active", render: (r) => (r["active"] ? "Yes" : "No") },
        ]}
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "raised", label: "Raised", type: "number" },
          { key: "goal", label: "Goal", type: "number" },
          { key: "active", label: "Active", type: "switch" },
        ]}
        defaults={{ title: "", description: "", raised: 0, goal: 0, active: true }}
      />
    </div>
  );
}