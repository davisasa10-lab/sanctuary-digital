import { supabase } from "@/integrations/supabase/client";

/** True when the signed-in user has an admin or editor role. */
export async function isStaffUser(): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  return (data ?? []).some((r) => r.role === "admin" || r.role === "editor");
}

/** Where a signed-in user should land: staff -> dashboard, members -> account. */
export async function homeForUser(): Promise<"/dashboard" | "/account"> {
  return (await isStaffUser()) ? "/dashboard" : "/account";
}

export type MediaProgressInput = {
  media_id: string;
  media_type: "video" | "podcast" | "sermon";
  title: string;
  thumbnail_url?: string | null;
  media_url?: string | null;
  progress_seconds?: number;
  duration_seconds?: number;
};

/** Save watch/listen progress for the signed-in user. Silently no-ops when signed out. */
export async function saveMediaProgress(input: MediaProgressInput) {
  const { data } = await supabase.auth.getSession();
  const uid = data.session?.user.id;
  if (!uid) return;
  const progress = Math.floor(input.progress_seconds ?? 0);
  const duration = Math.floor(input.duration_seconds ?? 0);
  await supabase.from("user_media_progress").upsert(
    {
      user_id: uid,
      media_id: input.media_id,
      media_type: input.media_type,
      title: input.title,
      thumbnail_url: input.thumbnail_url ?? null,
      media_url: input.media_url ?? null,
      progress_seconds: progress,
      duration_seconds: duration,
      completed: duration > 0 && progress >= duration - 5,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,media_type,media_id" },
  );
}
