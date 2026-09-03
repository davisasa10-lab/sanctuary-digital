import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Youtube } from "lucide-react";
import { toast } from "sonner";
import { lookupYouTubeVideo, listChannelVideos, type YouTubeVideoInfo } from "@/lib/youtube.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function YouTubeImportPanel({ onPick }: { onPick: (info: YouTubeVideoInfo) => void }) {
  const lookup = useServerFn(lookupYouTubeVideo);
  const browse = useServerFn(listChannelVideos);
  const [url, setUrl] = useState("");
  const [channelId, setChannelId] = useState("");
  const [results, setResults] = useState<YouTubeVideoInfo[]>([]);
  const [busy, setBusy] = useState(false);

  async function handleFetch() {
    setBusy(true);
    try {
      const info = await lookup({ data: { url } });
      onPick(info);
      toast.success("Details pulled from YouTube", { description: info.title });
    } catch (e) {
      toast.error("Could not read that video", { description: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function handleBrowse() {
    setBusy(true);
    try {
      const res = await browse({ data: { channelId } });
      setResults(res.videos);
      if (res.error) toast.info(res.error);
      else if (res.videos.length === 0) toast.info("No videos found for that channel");
    } catch (e) {
      toast.error("Channel lookup failed", { description: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-muted/40 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Youtube className="size-4 text-destructive" /> Import from YouTube
      </p>
      <div className="grid gap-2">
        <Label htmlFor="yt-url">Video link</Label>
        <div className="flex gap-2">
          <Input
            id="yt-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="h-11 rounded-xl"
          />
          <Button
            type="button"
            variant="secondary"
            className="h-11 shrink-0 rounded-xl"
            onClick={() => void handleFetch()}
            disabled={busy || !url.trim()}
          >
            Fetch
          </Button>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="yt-channel">Or browse a channel</Label>
        <div className="flex gap-2">
          <Input
            id="yt-channel"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="Channel ID e.g. UC…"
            className="h-11 rounded-xl"
          />
          <Button
            type="button"
            variant="outline"
            className="h-11 shrink-0 rounded-xl"
            onClick={() => void handleBrowse()}
            disabled={busy || !channelId.trim()}
          >
            Browse
          </Button>
        </div>
      </div>
      {results.length > 0 ? (
        <ul className="grid max-h-64 gap-2 overflow-y-auto">
          {results.map((v) => (
            <li key={v.videoId}>
              <button
                type="button"
                onClick={() => {
                  onPick(v);
                  toast.success("Details filled in", { description: v.title });
                }}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-accent"
              >
                <img src={v.thumbnailUrl} alt="" className="h-12 w-20 rounded-lg object-cover" />
                <span className="line-clamp-2 text-sm font-medium">{v.title}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
