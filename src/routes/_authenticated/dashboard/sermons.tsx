import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/sermons")({
  component: () => (
    <ResourceManager
      table="sermons"
      title="Sermons"
      description="The teaching archive, series and media links."
      orderBy={{ column: "sermon_date", ascending: false }}
      columns={[
        { key: "title", label: "Title" },
        { key: "speaker", label: "Speaker" },
        { key: "series", label: "Series" },
        { key: "sermon_date", label: "Date" },
        { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
      ]}
      fields={[
        { key: "title", label: "Title" },
        { key: "speaker", label: "Speaker" },
        { key: "series", label: "Series" },
        { key: "scripture", label: "Scripture" },
        { key: "sermon_date", label: "Date", type: "date" },
        { key: "duration", label: "Duration", placeholder: "41 min" },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: [
            "Faith",
            "Discipleship",
            "Community",
            "Stewardship",
            "Prayer",
            "Mission",
          ],
        },
        { key: "summary", label: "Summary", type: "textarea" },
        { key: "video_url", label: "YouTube URL" },
        { key: "audio_url", label: "Audio URL" },
        { key: "published", label: "Published", type: "switch" },
      ]}
      defaults={{
        title: "",
        speaker: "",
        series: "",
        scripture: "",
        sermon_date: "",
        duration: "",
        category: "Faith",
        summary: "",
        video_url: "",
        audio_url: "",
        published: true,
      }}
    />
  ),
});