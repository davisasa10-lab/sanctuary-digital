import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db-client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

type LogRow = {
  id: string;
  user_email: string;
  action: string;
  entity: string;
  summary: string;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/dashboard/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["activity_log"],
    queryFn: async () => {
      const { data, error } = await db
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as LogRow[];
    },
  });

  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight">Activity log</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Who changed what across the dashboard, newest first.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : (data ?? []).length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Who</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{formatDate(row.created_at)}</TableCell>
                  <TableCell className="max-w-40 truncate">{row.user_email}</TableCell>
                  <TableCell className="capitalize">{row.action}</TableCell>
                  <TableCell className="capitalize">{row.entity.replace(/_/g, " ")}</TableCell>
                  <TableCell className="max-w-sm truncate">{row.summary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
