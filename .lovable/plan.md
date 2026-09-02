# Finish the CMS + fix the logo

## 1. Logo not showing outside the Lovable editor

The header and footer logo is referenced through a CDN pointer file (`nxg-logo.png.asset.json`) rather than a real image in the project. It loads inside the editor preview, but it is the only image on the site served that way — every other image is bundled with the app.

Fix: bundle the logo like the other images. The original PNG is still in the project (`src/assets/nxg-logo-D0uXWpuf.png`); it gets renamed to `src/assets/nxg-logo.png` and imported normally in the nav and footer, so it ships with the app and shows in any browser. The CDN pointer is removed. The favicon already works and stays as-is.

## 2. Finish the Media page switch

- Nav "Live" item and the footer "Live stream" link point to `/media`.
- `/live` becomes a redirect to `/media` so old links keep working.

## 3. Remaining dashboard modules

The dashboard shell, roles and the existing screens (Events, Sermons, Gallery, Inbox, Testimonies, People, Giving, Live) are done. Still to build, using the tables already created in the migration:

- **Pages** — create/edit pages with slug, content, featured image, SEO fields and draft/published status.
- **Videos** — full video manager with category, placement, sort order and status; feeds the Media page.
- **Announcements / News** — title, body, image, publish date, category; surfaced publicly.
- **Gallery albums** — group gallery items into albums with ordering and publish state.
- **Media library** — upload, browse, search, rename and delete images in the `media` storage bucket; used by every image picker.
- **Users & roles** (admin only) — list staff, assign admin/editor, grant the giving-access permission.
- **Activity log** (admin only) — who changed what and when, written automatically on create/update/publish/delete.
- Search, filters and pagination on the longer lists.

## 4. YouTube importing

- Paste a YouTube link in the Videos, Sermons or Live forms: title, description and thumbnail are fetched automatically and previewed before saving (no API key needed).
- "Import from YouTube" panel listing recent uploads from the church channel for bulk import. This one needs a YouTube Data API key — I'll ask for it when I reach that step; single-link import works without it.

## 5. Public pages wired to the new content

Media, News/Announcements and Gallery read published rows from the new tables so publishing in the dashboard appears on the site immediately. No visual redesign.

## Technical notes

- Logo: replace the `.asset.json` import with a standard Vite image import in `Nav.tsx` and `Footer.tsx`; delete the pointer file and the stale `.webp` duplicate.
- `/live` route becomes `beforeLoad: () => { throw redirect({ to: "/media" }) }`.
- New dashboard screens reuse `ResourceManager` where it fits; Media library and Users need custom screens.
- Writes gated by RLS on `has_role(auth.uid(),'admin'|'editor')`; activity log written from a shared helper on every mutation.
- YouTube lookup runs in a server function (oEmbed for single links, Data API v3 with a server-held key for channel listing).
