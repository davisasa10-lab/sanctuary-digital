import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/dashboard/gallery")({
  component: () => (
    <ResourceManager
      table="gallery_items"
      title="Gallery"
      description="Photos and video highlights shown on the public gallery."
      orderBy={{ column: "sort_order", ascending: true }}
      columns={[
        { key: "title", label: "Title" },
        { key: "media_type", label: "Type" },
        { key: "category", label: "Album" },
        { key: "sort_order", label: "Order" },
        { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
      ]}
      fields={[
        { key: "title", label: "Caption" },
        { key: "url", label: "Image or video URL", placeholder: "https://…" },
        { key: "media_type", label: "Type", type: "select", options: ["photo", "video"] },
        {
          key: "category",
          label: "Album",
          type: "select",
          options: ["Worship", "Kids", "Outreach", "Community"],
        },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "published", label: "Published", type: "switch" },
      ]}
      defaults={{
        title: "",
        url: "",
        media_type: "photo",
        category: "Worship",
        sort_order: 0,
        published: true,
      }}
    />
  ),
});