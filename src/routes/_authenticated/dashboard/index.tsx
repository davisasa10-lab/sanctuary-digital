import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db-client";
import { formatMoney } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: AdminOverview,
});

async function countOf(table: string, filter?: { column: string; value: string }) {
  let q = db.from(table).select("*", { count: "exact", head: true });
  if (filter) q = q.eq(filter.column, filter.value);
  const { count, error } = await q;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [events, sermons, prayers, messages, pending] = await Promise.all([
        countOf("events"),
        countOf("sermons"),
        countOf("prayer_requests", { column: "status", value: "new" }),
        countOf("contact_messages", { column: "status", value: "new" }),
        countOf("testimonies", { column: "status", value: "pending" }),
      ]);
      const { data: donations, error } = await db
        .from("donations")
        .select("amount, status");
      if (error) throw new Error(error.message);
      const total = (donations ?? [])
        .filter((d: Record<string, unknown>) => d["status"] === "completed")
        .reduce((sum: number, d: Record<string, unknown>) => sum + Number(d["amount"] ?? 0), 0);
      return { events, sermons, prayers, messages, pending, total };
    },
  });

  const cards = [
    { label: "Published events", value: data?.events ?? 0, to: "/dashboard/events" },
    { label: "Sermons in archive", value: data?.sermons ?? 0, to: "/dashboard/sermons" },
    { label: "New prayer requests", value: data?.prayers ?? 0, to: "/dashboard/inbox" },
    { label: "Unread messages", value: data?.messages ?? 0, to: "/dashboard/inbox" },
    { label: "Testimonies awaiting approval", value: data?.pending ?? 0, to: "/dashboard/testimonies" },
  ] as const;

  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything happening across the church site right now.
      </p>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft card-lift"
            >
              <p className="text-3xl font-extrabold tracking-tight text-royal">{c.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.label}</p>
            </Link>
          ))}
          <Link
            to="/dashboard/giving"
            className="rounded-2xl border border-border bg-card p-6 shadow-soft card-lift"
          >
            <p className="text-3xl font-extrabold tracking-tight text-gold">
              {formatMoney(data?.total ?? 0)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Completed giving recorded</p>
          </Link>
        </div>
      )}
    </section>
  );
}