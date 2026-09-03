import { createFileRoute } from "@tanstack/react-router";
import { MediaLibrary } from "@/components/admin/MediaPicker";

export const Route = createFileRoute("/_authenticated/dashboard/media")({
  component: () => (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight">Media library</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Upload images, audio and documents once, then reuse them anywhere in the CMS.
      </p>
      <MediaLibrary />
    </section>
  ),
});
