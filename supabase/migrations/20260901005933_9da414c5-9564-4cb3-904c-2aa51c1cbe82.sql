
-- helper: staff = admin or editor
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','editor'))
$$;

create table public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role app_role not null,
  permission text not null,
  created_at timestamptz not null default now(),
  unique (role, permission)
);
grant select on public.role_permissions to authenticated;
grant all on public.role_permissions to service_role;
alter table public.role_permissions enable row level security;
create policy "staff read permissions" on public.role_permissions for select to authenticated using (public.is_staff(auth.uid()));
create policy "admins manage permissions" on public.role_permissions for all to authenticated using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));

create or replace function public.has_permission(_user_id uuid, _permission text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur
    join public.role_permissions rp on rp.role = ur.role
    where ur.user_id = _user_id and rp.permission = _permission
  ) or has_role(_user_id, 'admin')
$$;

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  featured_image text,
  seo_title text not null default '',
  seo_description text not null default '',
  og_image text,
  canonical_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.pages to anon;
grant select, insert, update, delete on public.pages to authenticated;
grant all on public.pages to service_role;
alter table public.pages enable row level security;
create policy "public read pages" on public.pages for select to anon, authenticated using (published = true);
create policy "staff read all pages" on public.pages for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff manage pages" on public.pages for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger touch_pages before update on public.pages for each row execute function public.touch_updated_at();

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  thumbnail_url text,
  video_url text not null,
  provider text not null default 'youtube',
  external_id text,
  duration text not null default '',
  category text not null default 'Highlight',
  placement text not null default 'media',
  sort_order integer not null default 0,
  published_at timestamptz,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.videos to anon;
grant select, insert, update, delete on public.videos to authenticated;
grant all on public.videos to service_role;
alter table public.videos enable row level security;
create policy "public read videos" on public.videos for select to anon, authenticated using (published = true);
create policy "staff read all videos" on public.videos for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff manage videos" on public.videos for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger touch_videos before update on public.videos for each row execute function public.touch_updated_at();

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  body text not null default '',
  featured_image text,
  category text not null default 'News',
  seo_title text not null default '',
  seo_description text not null default '',
  publish_date timestamptz not null default now(),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.announcements to anon;
grant select, insert, update, delete on public.announcements to authenticated;
grant all on public.announcements to service_role;
alter table public.announcements enable row level security;
create policy "public read announcements" on public.announcements for select to anon, authenticated using (published = true);
create policy "staff read all announcements" on public.announcements for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff manage announcements" on public.announcements for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger touch_announcements before update on public.announcements for each row execute function public.touch_updated_at();

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_image text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.gallery_albums to anon;
grant select, insert, update, delete on public.gallery_albums to authenticated;
grant all on public.gallery_albums to service_role;
alter table public.gallery_albums enable row level security;
create policy "public read albums" on public.gallery_albums for select to anon, authenticated using (published = true);
create policy "staff read all albums" on public.gallery_albums for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff manage albums" on public.gallery_albums for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger touch_gallery_albums before update on public.gallery_albums for each row execute function public.touch_updated_at();

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null,
  public_url text not null,
  alt_text text not null default '',
  mime_type text not null default '',
  size_bytes bigint not null default 0,
  uploaded_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.media_assets to authenticated;
grant all on public.media_assets to service_role;
alter table public.media_assets enable row level security;
create policy "staff manage media" on public.media_assets for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger touch_media_assets before update on public.media_assets for each row execute function public.touch_updated_at();

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_email text not null default '',
  action text not null,
  entity text not null default '',
  entity_id text,
  summary text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert on public.activity_log to authenticated;
grant all on public.activity_log to service_role;
alter table public.activity_log enable row level security;
create policy "admins read activity" on public.activity_log for select to authenticated using (has_role(auth.uid(),'admin'));
create policy "staff write activity" on public.activity_log for insert to authenticated with check (public.is_staff(auth.uid()) and user_id = auth.uid());

-- existing tables: staff (editor) access alongside admins
create policy "staff manage events" on public.events for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff manage sermons" on public.sermons for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff manage gallery_items" on public.gallery_items for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff manage leaders" on public.leaders for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff manage ministries" on public.ministries for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff manage testimonies" on public.testimonies for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff manage prayer_requests" on public.prayer_requests for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff manage contact_messages" on public.contact_messages for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "staff manage live_settings" on public.live_settings for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "permitted staff read donations" on public.donations for select to authenticated using (public.has_permission(auth.uid(), 'giving.read'));
create policy "permitted staff read campaigns" on public.campaigns for select to authenticated using (public.has_permission(auth.uid(), 'giving.read'));

-- new columns
alter table public.sermons add column if not exists thumbnail_url text;
alter table public.sermons add column if not exists tags text[] not null default '{}';
alter table public.events add column if not exists start_time text not null default '';
alter table public.events add column if not exists end_time text not null default '';
alter table public.events add column if not exists address text not null default '';
alter table public.events add column if not exists registration_url text;
alter table public.events add column if not exists featured boolean not null default false;
alter table public.gallery_items add column if not exists album_id uuid references public.gallery_albums(id) on delete set null;
alter table public.gallery_items add column if not exists caption text not null default '';
alter table public.prayer_requests add column if not exists phone text;
alter table public.contact_messages add column if not exists phone text;
