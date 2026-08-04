import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Loosely typed handle so church tables can be queried without generated types.
export const db = supabase as unknown as SupabaseClient;