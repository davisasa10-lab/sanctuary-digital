
revoke execute on function public.is_staff(uuid) from anon, public;
revoke execute on function public.has_permission(uuid, text) from anon, public;
grant execute on function public.is_staff(uuid) to authenticated;
grant execute on function public.has_permission(uuid, text) to authenticated;
