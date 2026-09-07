import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/podcasts")({
  component: () => (
    <ResourceManager
      table="podcasts"
      title="Podcasts"
      description="Upload audio episodes and publish them to the public media page."
      orderBy={{ column: "sort_order", ascending: true }}
      columns={[
        { key: "title", label: "Episode" },
        { key: "show", label: "Show" },
        { key: "host", label: "Host" },
        {
          key: "publish_date",
          label: "Published",
          render: (r) => (r["publish_date"] ? formatDate(String(r["publish_date"])) : "—"),
        },
        { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
      ]}
      fields={[
        { key: "title", label: "Episode title" },
        { key: "show", label: "Show name" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "host", label: "Host" },
        { key: "audio_url", label: "Audio file", type: "media" },
        { key: "cover_image", label: "Cover image", type: "media" },
        { key: "duration", label: "Duration", placeholder: "38 min" },
        { key: "publish_date", label: "Publish date", type: "datetime" },
        { key: "sort_order", label: "Order", type: "number" },
        { key: "published", label: "Published", type: "switch" },
      ]}
      defaults={{
        title: "",
        show: "",
        description: "",
        host: "",
        audio_url: "",
        cover_image: "",
        duration: "",
        publish_date: new Date().toISOString(),
        sort_order: 0,
        published: true,
      }}
    />
  ),
});
