import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/lib/db-client";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard/inbox")({
  component: InboxPage,
});

type Row = Record<string, unknown>;

function useRows(table: string) {
  return useQuery({
    queryKey: [table, "admin"],
    queryFn: async () => {
      const { data, error } = await db
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });
}

function useStatus(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await db.from(table).update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Updated");
      void qc.invalidateQueries({ queryKey: [table, "admin"] });
      void qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (e: Error) => toast.error("Could not update", { description: e.message }),
  });
}

function InboxPage() {
  const [tab, setTab] = useState("prayer");
  const prayers = useRows("prayer_requests");
  const messages = useRows("contact_messages");
  const setPrayer = useStatus("prayer_requests");
  const setMessage = useStatus("contact_messages");

  const loading = tab === "prayer" ? prayers.isLoading : messages.isLoading;
  const rows = (tab === "prayer" ? prayers.data : messages.data) ?? [];

  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight">Prayer & messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Confidential requests and contact enquiries from the website.
      </p>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="prayer" className="rounded-full px-5">
            Prayer requests
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-full px-5">
            Contact messages
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing in this inbox yet.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {rows.map((r) => {
            const id = String(r["id"]);
            const status = String(r["status"] ?? "new");
            const isPrayer = tab === "prayer";
            const anonymous = Boolean(r["anonymous"]);
            return (
              <li key={id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {isPrayer && anonymous ? "Anonymous" : String(r["name"] ?? "Unknown")}
                      {r["email"] ? (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          {String(r["email"])}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(String(r["created_at"]))}
                      {isPrayer ? ` · ${String(r["category"] ?? "")}` : ""}
                    </p>
                  </div>
                  <Badge
                    variant={status === "new" ? "default" : "secondary"}
                    className="rounded-full capitalize"
                  >
                    {status}
                  </Badge>
                </div>
                {!isPrayer && r["subject"] ? (
                  <p className="mt-4 text-sm font-semibold">{String(r["subject"])}</p>
                ) : null}
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {String(r[isPrayer ? "body" : "message"] ?? "")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(isPrayer ? ["new", "praying", "answered"] : ["new", "read", "replied"]).map(
                    (s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={status === s ? "default" : "outline"}
                        className="rounded-full capitalize"
                        onClick={() =>
                          isPrayer
                            ? setPrayer.mutate({ id, status: s })
                            : setMessage.mutate({ id, status: s })
                        }
                      >
                        {s}
                      </Button>
                    ),
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}