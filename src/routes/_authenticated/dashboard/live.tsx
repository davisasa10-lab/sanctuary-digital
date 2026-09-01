import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/lib/db-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/admin/live")({
  component: LiveAdmin,
});

type Row = Record<string, unknown>;

function LiveAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Row>({
    youtube_video_id: "",
    youtube_channel_id: "",
    is_live: false,
    title: "",
    description: "",
    scheduled_at: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["live_settings", "admin"],
    queryFn: async () => {
      const { data, error } = await db.from("live_settings").select("*").limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      return (data ?? null) as Row | null;
    },
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      youtube_video_id: data["youtube_video_id"] ?? "",
      youtube_channel_id: data["youtube_channel_id"] ?? "",
      is_live: Boolean(data["is_live"]),
      title: data["title"] ?? "",
      description: data["description"] ?? "",
      scheduled_at:
        typeof data["scheduled_at"] === "string" ? data["scheduled_at"].slice(0, 16) : "",
    });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        youtube_video_id: form["youtube_video_id"] || null,
        youtube_channel_id: form["youtube_channel_id"] || null,
        is_live: Boolean(form["is_live"]),
        title: form["title"] || null,
        description: form["description"] || null,
        scheduled_at: form["scheduled_at"] || null,
        updated_at: new Date().toISOString(),
      };
      if (data?.["id"]) {
        const { error } = await db
          .from("live_settings")
          .update(payload)
          .eq("id", String(data["id"]));
        if (error) throw new Error(error.message);
      } else {
        const { error } = await db.from("live_settings").insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Live stream settings saved");
      void qc.invalidateQueries({ queryKey: ["live_settings"] });
    },
    onError: (e: Error) => toast.error("Could not save", { description: e.message }),
  });

  const videoId = String(form["youtube_video_id"] ?? "");

  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight">Live stream</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Point the Live page at a YouTube broadcast and toggle it on when you go live.
      </p>

      {isLoading ? (
        <Skeleton className="mt-6 h-72 rounded-2xl" />
      ) : (
        <form
          className="mt-6 grid gap-5 rounded-3xl border border-border bg-card p-8 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <Label htmlFor="is_live" className="text-sm font-semibold">
                We are live now
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Shows the live badge and player on the public Live page.
              </p>
            </div>
            <Switch
              id="is_live"
              checked={Boolean(form["is_live"])}
              onCheckedChange={(v) => setForm({ ...form, is_live: v })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="video">YouTube video ID</Label>
            <Input
              id="video"
              className="h-12 rounded-xl"
              placeholder="dQw4w9WgXcQ"
              value={videoId}
              onChange={(e) => setForm({ ...form, youtube_video_id: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="channel">YouTube channel ID (for auto-live embed)</Label>
            <Input
              id="channel"
              className="h-12 rounded-xl"
              value={String(form["youtube_channel_id"] ?? "")}
              onChange={(e) => setForm({ ...form, youtube_channel_id: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="live-title">Stream title</Label>
            <Input
              id="live-title"
              className="h-12 rounded-xl"
              value={String(form["title"] ?? "")}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="live-desc">Description</Label>
            <Textarea
              id="live-desc"
              rows={3}
              className="rounded-xl"
              value={String(form["description"] ?? "")}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sched">Next stream</Label>
            <Input
              id="sched"
              type="datetime-local"
              className="h-12 rounded-xl"
              value={String(form["scheduled_at"] ?? "")}
              onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
            />
          </div>

          {videoId ? (
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Live preview"
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          <Button type="submit" disabled={save.isPending} className="h-12 rounded-full">
            {save.isPending ? "Saving…" : "Save live settings"}
          </Button>
        </form>
      )}
    </section>
  );
}