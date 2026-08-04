
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;

drop policy "anyone can submit prayer" on public.prayer_requests;
create policy "anyone can submit prayer" on public.prayer_requests for insert to anon, authenticated
  with check (length(body) between 5 and 4000 and status = 'new');

drop policy "anyone can send message" on public.contact_messages;
create policy "anyone can send message" on public.contact_messages for insert to anon, authenticated
  with check (length(message) between 5 and 4000 and length(name) between 1 and 120 and length(email) between 3 and 255 and status = 'new');

drop policy "public read live settings" on public.live_settings;
create policy "public read live settings" on public.live_settings for select to anon, authenticated using (true);
