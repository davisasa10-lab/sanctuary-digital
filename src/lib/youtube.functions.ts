import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type YouTubeVideoInfo = {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  author: string;
  publishedAt: string | null;
  duration: string;
  url: string;
};

export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1, 12) || null;
    const v = url.searchParams.get("v");
    if (v) return v.slice(0, 11);
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]!.slice(0, 11);
  } catch {
    return null;
  }
  return null;
}

function isoDurationToText(iso: string | undefined) {
  if (!iso) return "";
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return "";
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const s = Number(m[3] ?? 0);
  const mm = h > 0 ? `${min}`.padStart(2, "0") : `${min}`;
  return h > 0 ? `${h}:${mm}:${`${s}`.padStart(2, "0")}` : `${mm}:${`${s}`.padStart(2, "0")}`;
}

/** Look up a single video by link or id. Uses oEmbed (no key) and enriches with the Data API when a key is set. */
export const lookupYouTubeVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { url: string }) => {
    if (!data || typeof data.url !== "string") throw new Error("A YouTube link is required");
    return { url: data.url.slice(0, 500) };
  })
  .handler(async ({ data }): Promise<YouTubeVideoInfo> => {
    const videoId = parseYouTubeId(data.url);
    if (!videoId) throw new Error("That doesn't look like a YouTube link");

    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const info: YouTubeVideoInfo = {
      videoId,
      title: "",
      description: "",
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      author: "",
      publishedAt: null,
      duration: "",
      url: watchUrl,
    };

    const oembed = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl)}`,
    );
    if (oembed.ok) {
      const json = (await oembed.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
      info.title = json.title ?? "";
      info.author = json.author_name ?? "";
      if (json.thumbnail_url) info.thumbnailUrl = json.thumbnail_url;
    } else if (oembed.status === 404) {
      throw new Error("That video could not be found on YouTube");
    }

    const key = process.env["YOUTUBE_API_KEY"];
    if (key) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${key}`,
      );
      if (res.ok) {
        const json = (await res.json()) as {
          items?: Array<{
            snippet?: { title?: string; description?: string; publishedAt?: string; channelTitle?: string };
            contentDetails?: { duration?: string };
          }>;
        };
        const item = json.items?.[0];
        if (item) {
          info.title = item.snippet?.title ?? info.title;
          info.description = item.snippet?.description ?? "";
          info.publishedAt = item.snippet?.publishedAt ?? null;
          info.author = item.snippet?.channelTitle ?? info.author;
          info.duration = isoDurationToText(item.contentDetails?.duration);
        }
      }
    }

    return info;
  });

/** List recent uploads from a channel. Needs a YouTube Data API key. */
export const listChannelVideos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { channelId: string }) => {
    if (!data || typeof data.channelId !== "string" || !data.channelId.trim()) {
      throw new Error("A channel id is required");
    }
    return { channelId: data.channelId.trim().slice(0, 100) };
  })
  .handler(async ({ data }): Promise<{ videos: YouTubeVideoInfo[]; error?: string }> => {
    const key = process.env["YOUTUBE_API_KEY"];
    if (!key) {
      return { videos: [], error: "No YouTube API key is configured, so channel browsing is off. Paste a video link instead." };
    }
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&order=date&maxResults=24&type=video&channelId=${encodeURIComponent(
        data.channelId,
      )}&key=${key}`,
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`YouTube channel listing failed [${res.status}]: ${body}`);
      return { videos: [], error: `YouTube returned ${res.status}. Check the channel id and API key.` };
    }
    const json = (await res.json()) as {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: {
          title?: string;
          description?: string;
          publishedAt?: string;
          channelTitle?: string;
          thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
        };
      }>;
    };
    const videos = (json.items ?? [])
      .filter((i) => i.id?.videoId)
      .map((i) => ({
        videoId: i.id!.videoId!,
        title: i.snippet?.title ?? "",
        description: i.snippet?.description ?? "",
        thumbnailUrl:
          i.snippet?.thumbnails?.high?.url ??
          i.snippet?.thumbnails?.medium?.url ??
          `https://i.ytimg.com/vi/${i.id!.videoId!}/hqdefault.jpg`,
        author: i.snippet?.channelTitle ?? "",
        publishedAt: i.snippet?.publishedAt ?? null,
        duration: "",
        url: `https://www.youtube.com/watch?v=${i.id!.videoId!}`,
      }));
    return { videos };
  });
