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
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as MinistryRow[];
    },
  });

export const useCampaigns = () =>
  useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await db.from("campaigns").select("*");
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