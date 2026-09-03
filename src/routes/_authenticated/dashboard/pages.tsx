import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/dashboard/pages")({
  component: () => (
    <ResourceManager
      table="pages"
      title="Pages"
      description="Editable copy and SEO for the public pages."
      orderBy={{ column: "title", ascending: true }}
      searchKeys={["title", "slug"]}
      labelKey="title"
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "seo_title", label: "SEO title" },
        { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
      ]}
      fields={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug", placeholder: "about" },
        { key: "content", label: "Content", type: "textarea" },
        { key: "featured_image", label: "Featured image", type: "media" },
        { key: "seo_title", label: "SEO title", placeholder: "Under 60 characters" },
        { key: "seo_description", label: "SEO description", type: "textarea" },
        { key: "og_image", label: "Social share image", type: "media" },
        { key: "canonical_url", label: "Canonical URL" },
        { key: "published", label: "Published", type: "switch" },
      ]}
      defaults={{
        title: "",
        slug: "",
        content: "",
        featured_image: "",
        seo_title: "",
        seo_description: "",
        og_image: "",
        canonical_url: "",
        published: true,
      }}
    />
  ),
});
