import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: () => (
    <ResourceManager
      table="events"
      title="Events"
      description="Conferences, outreach weekends, worship nights and camps."
      orderBy={{ column: "event_date", ascending: true }}
      columns={[
        { key: "title", label: "Title" },
        {
          key: "event_date",
          label: "Date",
          render: (r) => formatDate(String(r["event_date"])),
        },
        { key: "category", label: "Category" },
        { key: "location", label: "Location" },
        { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
      ]}
      fields={[
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "event_date", label: "Date & time", type: "datetime" },
        { key: "location", label: "Location" },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: ["Worship", "Conference", "Outreach", "Youth", "General"],
        },
        { key: "image_url", label: "Image URL", placeholder: "https://…" },
        { key: "published", label: "Published", type: "switch" },
      ]}
      defaults={{
        title: "",
        description: "",
        event_date: "",
        location: "",
        category: "Worship",
        image_url: "",
        published: true,
      }}
    />
  ),
});