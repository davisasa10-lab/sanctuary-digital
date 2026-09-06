# Grant admin access to both accounts

## Context
Nobody currently has a dashboard role — the `user_roles` table is empty, so even signed-in users see "Dashboard access required". Two accounts exist:
- davisasa10@gmail.com (Davis)
- davisasa99@gmail.com (Davis)

The user chose to make **both** administrators.

## Change (data only, no schema or code changes)
Insert one `admin` role row per account into `public.user_roles`:
- user_id `d8751a5e-048b-4e4d-88a4-cf0737226b90` (davisasa10@gmail.com) → admin
- user_id `f4f15524-8add-4355-9832-c7940b7299f9` (davisasa99@gmail.com) → admin

Use `INSERT ... ON CONFLICT (user_id, role) DO NOTHING` so it's safe to re-run.

## Result
Both accounts can sign in at `/auth` and access the full `/dashboard`, including admin-only sections (Giving, Users & roles, Activity log). Editors can later be added from the Users & roles screen.
