import { db } from "@/lib/db-client";
import { supabase } from "@/integrations/supabase/client";

/** Best-effort audit trail entry. Never blocks the action that triggered it. */
export async function logActivity(input: {
  action: "create" | "update" | "delete" | "publish" | "upload";
  entity: string;
  entityId?: string | null;
  summary: string;
}) {
  try {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;
    await db.from("activity_log").insert({
      user_id: user.id,
      user_email: user.email ?? "unknown",
      action: input.action,
      entity: input.entity,
      entity_id: input.entityId ?? null,
      summary: input.summary,
    });
  } catch (error) {
    console.error("activity log failed", error);
  }
}
