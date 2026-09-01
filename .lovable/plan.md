# Church CMS Dashboard

## What already exists

The project already has a working admin area at `/admin` (behind login + admin role) covering Events, Sermons, Gallery, Prayer & messages inbox, Testimonies, Leaders & ministries, Giving, and Live stream. Public pages read from the database, forms already write to it. So this is an **upgrade and expansion**, not a new system — no duplicate admin panel will be created.

## Plan

### 1. Move and rebrand to `/dashboard`
- Rename the admin area to `/dashboard` (old `/admin` URLs redirect there).
- New shell: collapsible sidebar, top bar with global search, notification bell (new prayer requests / inquiries / pending testimonies), profile menu with sign out, mobile drawer navigation.
- Overview page shows: total pages, published content, total videos, upcoming events, recent prayer requests, recent inquiries, recent giving, recent content updates (from the activity log).

### 2. Roles: admin + editor
The `editor` role already exists in the database but is unused. Enforcement happens in the database policies, not just the UI:
- Editors: manage pages, videos, sermons, events, announcements, gallery, media, prayer requests, inquiries.
- Editors cannot: manage users/roles, change CMS settings, or see giving records unless an admin grants them the giving permission.
- Admins: everything, plus a Users & Roles screen and the activity log.

### 3. New content types
- **Pages** — title, slug, content, featured image, status, SEO title/description, OG image, updated date. Public pages render live from these records; the existing designed layouts stay exactly as they are, with the editable text/images pulled from the CMS.
- **Videos** — title, description, thumbnail, YouTube/Vimeo URL, category, placement (which page/section), sort order, status. Wires into the existing Media page embeds.
  - **Pull from YouTube:** paste a YouTube link (or ID) and the dashboard fetches the video's title, description, channel and thumbnail automatically, shows a preview, and lets the editor accept or tweak the details before saving — no retyping.
  - **Browse the church channel:** a "Import from YouTube" panel lists the latest uploads from the Next Gen Church channel so an editor can tick videos and import them in one go. This needs a YouTube Data API key; I'll request it when we get there. Without the key, single-link import still works.
  - The same importer is reused when attaching a video to a sermon or a live broadcast.
- **Announcements** — title, body, featured image, publish date, category, SEO; surfaced on the public site.
- **Gallery albums** — albums containing images with captions, ordering, publish state; existing gallery items are migrated into a default album.
- **Media library** — a storage bucket plus a metadata table (filename, alt text, size, type), with upload, browse, search, rename, delete. Used by every image picker in the CMS.
- **Activity log** — user, action, item, timestamp; written automatically on create/update/publish/delete/status change, readable by admins.

### 4. Existing sections upgraded
- Sermons gain thumbnail and tags; Events gain start/end time, address, registration link, featured flag.
- Prayer requests get the New / In Progress / Prayed For / Archived workflow, admin+editor read only, never public.
- Inquiries get New / Contacted / Resolved / Archived.
- Giving stays read-only against the existing donation records — no payment system changes, no card data stored.
- Every list gets search, filters, sorting and pagination, with loading/empty/error states, confirm dialogs and toasts.

### 5. Public site
Untouched visually. Pages, videos, sermons, events, announcements and gallery all read published rows, so publishing in the dashboard shows up immediately on `/sermons`, `/events`, `/media`, `/gallery` and the page routes.

## Technical notes
- New tables: `pages`, `videos`, `announcements`, `gallery_albums`, `media_assets`, `activity_log`, plus a `role_permissions` table for the giving-access grant; new columns on `sermons`, `events`, `gallery_items`, `prayer_requests`, `contact_messages`.
- RLS on every table: public reads only published rows; writes gated by `has_role(auth.uid(),'admin')` or `'editor'`; prayer requests, inquiries, giving and the activity log have no public read policy at all.
- Storage bucket `media` with authenticated-write / public-read policies for images.
- Input validation with zod on every form; no `dangerouslySetInnerHTML` on CMS content.
- Work lands in stages: database migration first, then dashboard shell and roles, then the new content sections, then public wiring.
