import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/people")({
  component: PeoplePage,
});

function PeoplePage() {
  return (
    <div className="grid gap-14">
      <ResourceManager
        table="leaders"
        title="Leaders"
        description="Pastors, elders and staff shown on the leadership page."
        orderBy={{ column: "sort_order", ascending: true }}
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "email", label: "Email" },
          { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
        ]}
        fields={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "bio", label: "Bio", type: "textarea" },
          { key: "email", label: "Email" },
          { key: "image_url", label: "Photo URL" },
          { key: "sort_order", label: "Sort order", type: "number" },
          { key: "published", label: "Published", type: "switch" },
        ]}
        defaults={{
          name: "",
          role: "",
          bio: "",
          email: "",
          image_url: "",
          sort_order: 0,
          published: true,
        }}
      />

      <ResourceManager
        table="ministries"
        title="Ministries"
        description="Teams and serving opportunities."
        orderBy={{ column: "sort_order", ascending: true }}
        columns={[
          { key: "name", label: "Name" },
          { key: "leader", label: "Leader" },
          { key: "schedule", label: "Schedule" },
          { key: "published", label: "Live", render: (r) => (r["published"] ? "Yes" : "No") },
        ]}
        fields={[
          { key: "name", label: "Name" },
          { key: "schedule", label: "Schedule" },
          { key: "leader", label: "Leader" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "image_url", label: "Image URL" },
          { key: "sort_order", label: "Sort order", type: "number" },
          { key: "published", label: "Published", type: "switch" },
        ]}
        defaults={{
          name: "",
          schedule: "",
          leader: "",
          description: "",
          image_url: "",
          sort_order: 0,
          published: true,
        }}
      />
    </div>
  );
}