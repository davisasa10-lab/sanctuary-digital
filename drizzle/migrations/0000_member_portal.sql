CREATE TABLE public.user_media_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  media_id text NOT NULL,
  media_type text NOT NULL DEFAULT 'video',
  title text NOT NULL DEFAULT '',
  thumbnail_url text,
  media_url text,
  progress_seconds numeric NOT NULL DEFAULT 0,
  duration_seconds numeric NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, media_type, media_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_media_progress TO authenticated;
GRANT ALL ON public.user_media_progress TO service_role;
ALTER TABLE public.user_media_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own progress select" ON public.user_media_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own progress insert" ON public.user_media_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own progress update" ON public.user_media_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own progress delete" ON public.user_media_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Members read own donations" ON public.donations FOR SELECT TO authenticated
  USING (email IS NOT NULL AND lower(email) = lower(auth.jwt() ->> 'email'));
GRANT SELECT ON public.donations TO authenticated;