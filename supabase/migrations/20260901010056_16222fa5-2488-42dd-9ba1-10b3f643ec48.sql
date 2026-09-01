
create policy "media readable" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "staff upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "staff update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff(auth.uid())) with check (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "staff delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff(auth.uid()));
