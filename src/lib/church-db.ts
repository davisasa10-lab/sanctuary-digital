import { useQuery } from "@tanstack/react-query";
import { db } from "./db-client";

export type EventRow = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
  image_url: string | null;
  published: boolean;
};

export type SermonRow = {
  id: string;
  title: string;
  speaker: string;
  series: string;
  scripture: string;
  sermon_date: string;
  duration: string;
  category: string;
  summary: string;
  video_url: string | null;
  audio_url: string | null;
  published: boolean;
};

export type GalleryRow = {
  id: string;
  title: string;
  media_type: string;
  url: string;
  category: string;
  sort_order: number;
  published: boolean;
};

export type LeaderRow = {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

export type MinistryRow = {
  id: string;
  name: string;
  schedule: string;
  leader: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

export type CampaignRow = {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  active: boolean;
};

export type TestimonyRow = {
  id: string;
  name: string;
  role: string;
  type: string;
  quote: string;
  video_url: string | null;
  status: string;
  created_at: string;
};

export type LiveSettingsRow = {
  id: string;
  youtube_video_id: string | null;
  youtube_channel_id: string | null;
  is_live: boolean;
  title: string;
  description: string;
  scheduled_at: string | null;
};

export const useEvents = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await db
        .from("events")
        .select("*")
        .eq("published", true)
        .order("event_date", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as EventRow[];
    },
  });

export const useSermons = () =>
  useQuery({
    queryKey: ["sermons"],
    queryFn: async () => {
      const { data, error } = await db
        .from("sermons")
        .select("*")
        .eq("published", true)
        .order("sermon_date", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as SermonRow[];
    },
  });

export const useGallery = () =>
  useQuery({
    queryKey: ["gallery_items"],
    queryFn: async () => {
      const { data, error } = await db
        .from("gallery_items")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as GalleryRow[];
    },
  });

export const useLeaders = () =>
  useQuery({
    queryKey: ["leaders"],
    queryFn: async () => {
      const { data, error } = await db
        .from("leaders")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as LeaderRow[];
    },
  });

export const useMinistries = () =>
  useQuery({
    queryKey: ["ministries"],
    queryFn: async () => {
      const { data, error } = await db
        .from("ministries")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as MinistryRow[];
    },
  });

export const useCampaigns = () =>
  useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await db
        .from("campaigns")
        .select("*")
        .eq("active", true);
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as CampaignRow[];
    },
  });

export const useTestimonies = () =>
  useQuery({
    queryKey: ["testimonies", "approved"],
    queryFn: async () => {
      const { data, error } = await db
        .from("testimonies")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as TestimonyRow[];
    },
  });

export const useLiveSettings = () =>
  useQuery({
    queryKey: ["live_settings"],
    queryFn: async () => {
      const { data, error } = await db.from("live_settings").select("*").limit(1);
      if (error) throw new Error(error.message);
      return ((data ?? [])[0] ?? null) as unknown as LiveSettingsRow | null;
    },
  });
export type VideoRow = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  video_url: string;
  provider: string;
  external_id: string | null;
  duration: string;
  category: string;
  placement: string;
  sort_order: number;
  published_at: string | null;
  published: boolean;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featured_image: string | null;
  category: string;
  seo_title: string;
  seo_description: string;
  publish_date: string;
  published: boolean;
};

export type AlbumRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string | null;
  sort_order: number;
  published: boolean;
};

export const useVideos = () =>
  useQuery({
    queryKey: ["videos", "published"],
    queryFn: async () => {
      const { data, error } = await db
        .from("videos")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as VideoRow[];
    },
  });

export const useAnnouncements = () =>
  useQuery({
    queryKey: ["announcements", "published"],
    queryFn: async () => {
      const { data, error } = await db
        .from("announcements")
        .select("*")
        .eq("published", true)
        .order("publish_date", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as AnnouncementRow[];
    },
  });

export const useAlbums = () =>
  useQuery({
    queryKey: ["gallery_albums", "published"],
    queryFn: async () => {
      const { data, error } = await db
        .from("gallery_albums")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as AlbumRow[];
    },
  });

export type PodcastRow = {
  id: string;
  show: string;
  title: string;
  description: string;
  host: string;
  audio_url: string;
  cover_image: string | null;
  duration: string;
  publish_date: string;
  sort_order: number;
  published: boolean;
};

export const usePodcasts = () =>
  useQuery({
    queryKey: ["podcasts", "published"],
    queryFn: async () => {
      const { data, error } = await db
        .from("podcasts")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as PodcastRow[];
    },
  });

export async function submitPrayerRequest(input: {
  name: string | null;
  email: string | null;
  phone: string | null;
  category: string;
  body: string;
  anonymous: boolean;
}) {
  const { error } = await db.from("prayer_requests").insert(input);
  if (error) throw new Error(error.message);
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}) {
  const { error } = await db.from("contact_messages").insert(input);
  if (error) throw new Error(error.message);
}

export async function submitTestimony(input: {
  name: string;
  role: string;
  type: string;
  quote: string;
}) {
  const { error } = await db.from("testimonies").insert({ ...input, status: "pending" });
  if (error) throw new Error(error.message);
}
