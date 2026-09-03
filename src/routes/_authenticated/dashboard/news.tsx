import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard/news")({
  component: () => (
    <ResourceManager
      table="announcements"
      title="News & announcements"
      description="Church news, notices and stories for the public news feed."
      orderBy={{ column: "publish_date", ascending: false }}
      searchKeys={["title", "category", "slug"]}
      labelKey="title"
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        {
          key: "publish_date",
          label: "Publish date",
          render: (r) => formatDate(String(r["publish_date"])),
        },
        { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
      ]}
      fields={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug", placeholder: "easter-weekend" },
        { key: "excerpt", label: "Excerpt", type: "textarea" },
        { key: "body", label: "Body", type: "textarea" },
        { key: "featured_image", label: "Featured image", type: "media" },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: ["News", "Notice", "Story", "Outreach", "Youth"],
        },
        { key: "publish_date", label: "Publish date", type: "datetime" },
        { key: "seo_title", label: "SEO title" },
        { key: "seo_description", label: "SEO description", type: "textarea" },
        { key: "published", label: "Published", type: "switch" },
      ]}
      defaults={{
        title: "",
        slug: "",
        excerpt: "",
        body: "",
        featured_image: "",
        category: "News",
        publish_date: "",
        seo_title: "",
        seo_description: "",
        published: true,
      }}
    />
  ),
});
