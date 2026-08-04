
-- roles
create type public.app_role as enum ('admin','editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- content tables
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  event_date timestamptz not null,
  location text not null default '',
  category text not null default 'General',
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text not null default '',
  series text not null default '',
  scripture text not null default '',
  sermon_date date not null default current_date,
  duration text not null default '',
  category text not null default 'Faith',
  summary text not null default '',
  video_url text,
  audio_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  media_type text not null default 'photo',
  url text not null,
  category text not null default 'Worship',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  email text,
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  schedule text not null default '',
  leader text not null default '',
  description text not null default '',
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  goal numeric(12,2) not null default 0,
  raised numeric(12,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  type text not null default 'Written',
  quote text not null,
  video_url text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  category text not null default 'Healing',
  body text not null,
  anonymous boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text,
  email text,
  amount numeric(12,2) not null,
  currency text not null default 'GHS',
  fund text not null default 'Tithe',
  campaign_id uuid references public.campaigns(id) on delete set null,
  method text not null default 'Card',
  reference text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.live_settings (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text,
  youtube_channel_id text,
  is_live boolean not null default false,
  title text not null default 'Sunday Service',
  description text not null default '',
  scheduled_at timestamptz,
  updated_at timestamptz not null default now()
);

-- grants + rls
do $$
declare t text;
begin
  foreach t in array array['events','sermons','gallery_items','leaders','ministries','campaigns','testimonies','prayer_requests','contact_messages','donations','live_settings']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated;', t);
    execute format('grant all on public.%I to service_role;', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create trigger touch_%I before update on public.%I for each row execute function public.touch_updated_at();', t, t);
    execute format('create policy "admins manage %I" on public.%I for all to authenticated using (public.has_role(auth.uid(),''admin'')) with check (public.has_role(auth.uid(),''admin''));', t, t);
  end loop;
end $$;

-- public read on published content
do $$
declare t text;
begin
  foreach t in array array['events','sermons','gallery_items','leaders','ministries']
  loop
    execute format('grant select on public.%I to anon;', t);
    execute format('create policy "public read %I" on public.%I for select to anon, authenticated using (published = true);', t, t);
  end loop;
end $$;

grant select on public.campaigns to anon;
create policy "public read campaigns" on public.campaigns for select to anon, authenticated using (active = true);

grant select on public.testimonies to anon;
grant insert on public.testimonies to anon;
create policy "public read approved testimonies" on public.testimonies for select to anon, authenticated using (status = 'approved');
create policy "anyone can submit testimony" on public.testimonies for insert to anon, authenticated with check (status = 'pending');

grant select on public.live_settings to anon;
create policy "public read live settings" on public.live_settings for select to anon, authenticated using (true);

grant insert on public.prayer_requests to anon;
create policy "anyone can submit prayer" on public.prayer_requests for insert to anon, authenticated with check (true);

grant insert on public.contact_messages to anon;
create policy "anyone can send message" on public.contact_messages for insert to anon, authenticated with check (true);

grant insert on public.donations to anon;
create policy "anyone can record giving" on public.donations for insert to anon, authenticated with check (status = 'pending');

-- seed
insert into public.live_settings (youtube_channel_id, youtube_video_id, is_live, title, description)
values ('UCxxxxxxxxxxxxxxxxxxxxxx', 'jfKfPfyJRdk', false, 'Sunday Service — Live', 'Join us live every Sunday at 9:30 AM GMT.');

insert into public.events (title, description, event_date, location, category) values
('Night of Worship','An evening of unhurried worship, scripture and prayer with our collective and guest musicians.','2026-08-21T19:00:00Z','Main Sanctuary','Worship'),
('Family Life Conference','Three days of practical teaching on marriage, parenting and household faith.','2026-09-04T09:00:00Z','Grace Hall','Conference'),
('City Outreach Weekend','Serving 1,200 families with food, medical screening and prayer.','2026-09-19T08:00:00Z','Accra Central','Outreach'),
('Youth Encounter Camp','A weekend away for teens and young adults: worship, sport and discipleship.','2026-10-10T07:00:00Z','Aburi Retreat Centre','Youth');

insert into public.sermons (title, speaker, series, scripture, sermon_date, duration, category, summary) values
('Anchored in the Storm','Pastor Daniel Mensah','Unshaken','Hebrews 6:19','2026-08-02','41 min','Faith','Hope is not wishful thinking — it is an anchor fastened to something that cannot move.'),
('The Quiet Strength of Obedience','Pastor Adjoa Boateng','Unshaken','1 Samuel 15:22','2026-07-26','38 min','Discipleship','Obedience is the slow, quiet path to a life that holds.'),
('A Table of Grace','Pastor Daniel Mensah','Belong','Luke 14:15-24','2026-07-19','44 min','Community','Everyone is invited to the table God is setting.'),
('The Generous Life','Rev. Kofi Asare','Belong','2 Corinthians 9:7','2026-07-12','36 min','Stewardship','Generosity is worship with open hands.'),
('Prayer That Moves Mountains','Pastor Adjoa Boateng','Upper Room','James 5:16','2026-07-05','47 min','Prayer','The prayer of an ordinary person still moves heaven.'),
('Light of the City','Pastor Daniel Mensah','Upper Room','Matthew 5:14','2026-06-28','39 min','Mission','We were never meant to hide.');

insert into public.leaders (name, role, bio, email, sort_order) values
('Pastor Daniel Mensah','Lead Pastor','Daniel has shepherded Grace Cathedral for 14 years, teaching with clarity and warmth, and championing a church that is generous with its city.','daniel@gracecathedral.org',1),
('Pastor Adjoa Boateng','Associate Pastor, Discipleship','Adjoa leads our small groups and formation pathways, helping people move from curiosity to deep-rooted faith.','adjoa@gracecathedral.org',2),
('Rev. Kofi Asare','Pastor of Outreach','Kofi oversees our community partnerships, feeding programmes and medical outreach across the city.','kofi@gracecathedral.org',3),
('Naa Adjeley Quaye','Worship Director','Naa leads a collective of 60 musicians and creatives crafting worship that is both reverent and alive.','naa@gracecathedral.org',4),
('Emmanuel Tetteh','Youth & Young Adults','Emmanuel builds spaces where teenagers and students can ask honest questions and find real friendship.','emmanuel@gracecathedral.org',5),
('Dr. Serwaa Owusu','Elder, Care & Counselling','Serwaa coordinates pastoral care, hospital visitation and our licensed counselling team.','serwaa@gracecathedral.org',6);

insert into public.ministries (name, schedule, leader, description, sort_order) values
('Worship & Creative Arts','Rehearsals - Thursdays 7:00 PM','Naa Adjeley Quaye','Musicians, vocalists, media and production serving every gathering.',1),
('Grace Kids','Sundays - during both services','Abena Nyarko','Safe, joyful spaces where children ages 0-12 meet Jesus.',2),
('Youth & Students','Fridays - 5:30 PM','Emmanuel Tetteh','Teens and university students growing together in faith and friendship.',3),
('Outreach & Mercy','Saturdays - 8:00 AM','Rev. Kofi Asare','Food distribution, medical clinics and prison ministry across the city.',4),
('Prayer & Intercession','Daily - 5:30 AM (online)','Mama Efua Danso','A praying core holding up our church, city and nation.',5),
('Marriage & Family','2nd Sunday - 4:00 PM','Dr. Serwaa Owusu','Mentoring, counselling and community for couples and parents.',6);

insert into public.campaigns (title, description, goal, raised) values
('New Sanctuary Build','A 2,500-seat sanctuary with dedicated kids and counselling wings.',1200000,780000),
('Feed the City','Weekly hot meals and grocery boxes for 1,200 families.',120000,96000),
('Scholarship Fund','Tuition support for 180 students across senior high and university.',300000,210000);

insert into public.testimonies (name, role, type, quote, status) values
('Akosua M.','Member since 2019','Written','I walked in during the hardest year of my life and found people who prayed with me every single week. This became home.','approved'),
('Michael & Ruth','Married 2 years','Video','The marriage course rebuilt our communication. We came in exhausted and left with practical, hopeful tools.','approved'),
('Kwame D.','Young adults','Written','I had a lot of questions and nobody rushed me. A year later I was baptised, surrounded by friends who waited with me.','approved'),
('Sister Grace','Outreach volunteer','Video','Serving on the food team changed how I see my city. Every Saturday feels like church in motion.','approved');
