import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/dashboard/videos")({
  component: () => (
    <ResourceManager
      table="videos"
      title="Videos"
      description="Highlight reels, worship sets and teaching clips pulled from YouTube."
      orderBy={{ column: "sort_order", ascending: true }}
      searchKeys={["title", "category"]}
      labelKey="title"
      youtube={{
        urlKey: "video_url",
        titleKey: "title",
        descriptionKey: "description",
        thumbnailKey: "thumbnail_url",
        durationKey: "duration",
        externalIdKey: "external_id",
        publishedAtKey: "published_at",
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "placement", label: "Placement" },
        { key: "duration", label: "Duration" },
        { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
      ]}
      fields={[
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "video_url", label: "Video URL" },
        { key: "external_id", label: "YouTube ID" },
        { key: "thumbnail_url", label: "Thumbnail", type: "media" },
        { key: "duration", label: "Duration", placeholder: "12:45" },
        {
          key: "provider",
          label: "Provider",
          type: "select",
          options: ["youtube", "vimeo", "upload"],
        },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: ["Highlights", "Worship", "Teaching", "Testimony", "Podcast", "Kids"],
        },
        {
          key: "placement",
          label: "Placement",
          type: "select",
          options: ["media", "home", "sermons", "hidden"],
        },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "published_at", label: "Published at", type: "datetime" },
        { key: "published", label: "Published", type: "switch" },
      ]}
      defaults={{
        title: "",
        description: "",
        video_url: "",
        external_id: "",
        thumbnail_url: "",
        duration: "",
        provider: "youtube",
        category: "Highlights",
        placement: "media",
        sort_order: 0,
        published_at: "",
        published: true,
      }}
    />
  ),
});
