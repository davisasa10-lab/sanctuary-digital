CREATE TABLE public.podcasts (
  id uuid primary key default gen_random_uuid(),
  show text not null default '',
  title text not null default '',
  description text not null default '',
  host text not null default '',
  audio_url text not null default '',
  cover_image text,
  duration text not null default '',
  publish_date timestamptz not null default now(),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.podcasts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.podcasts TO authenticated;
GRANT ALL ON public.podcasts TO service_role;

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published podcasts are public" ON public.podcasts
  FOR SELECT USING (published = true OR public.is_staff(auth.uid()));

CREATE POLICY "Staff manage podcasts" ON public.podcasts
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER touch_podcasts BEFORE UPDATE ON public.podcasts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.podcasts (show, title, description, host, audio_url, duration, sort_order, published) VALUES
('The Next Gen Podcast', 'Anchored in a restless world', 'A conversation about staying grounded when everything around you keeps moving.', 'Pastor Daniel', 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', '32 min', 1, true),
('Morning Prayer', 'Five minutes to start your day', 'A short guided prayer for the commute, the gym or the kitchen.', 'Sister Adjoa', 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3', '6 min', 2, true),
('Youth Talks', 'Faith, friendships and pressure', 'Honest talk with our youth leaders about navigating pressure at school.', 'Kwame & Efua', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3', '24 min', 3, true);