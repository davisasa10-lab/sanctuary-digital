import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/dashboard/albums")({
  component: () => (
    <ResourceManager
      table="gallery_albums"
      title="Gallery albums"
      description="Group photos and clips into albums for the public gallery."
      orderBy={{ column: "sort_order", ascending: true }}
      searchKeys={["title", "slug"]}
      labelKey="title"
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "sort_order", label: "Order" },
        { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
      ]}
      fields={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "cover_image", label: "Cover image", type: "media" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "published", label: "Published", type: "switch" },
      ]}
      defaults={{
        title: "",
        slug: "",
        description: "",
        cover_image: "",
        sort_order: 0,
        published: true,
      }}
    />
  ),
});
