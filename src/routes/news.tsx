import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncements } from "@/lib/church-db";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "News & Announcements | Next Gen Church" },
      {
        name: "description",
        content:
          "The latest announcements, church news and family updates from Next Gen Church.",
      },
      { property: "og:title", content: "Next Gen Church news" },
      {
        property: "og:description",
        content: "Announcements and updates from the Next Gen Church family.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function NewsPage() {
  const { data, isLoading, isError } = useAnnouncements();

  return (
    <>
      <PageHero
        eyebrow="News"
        title="What's happening"
        description="Announcements, updates and stories from across the Next Gen Church family."
      />

      <Section>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-72 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-sm text-muted-foreground">
            We couldn&apos;t load the news right now. Please try again shortly.
          </p>
        ) : (data ?? []).length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No announcements have been published yet — check back soon.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(data ?? []).map((n, i) => (
              <Reveal as="li" key={n.id} delay={i * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft card-lift">
                  {n.featured_image ? (
                    <img
                      src={n.featured_image}
                      alt={n.title}
                      loading="lazy"
                      className="aspect-video w-full object-cover"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <Badge className="w-fit rounded-full">{n.category}</Badge>
                    <h2 className="mt-3 font-bold leading-snug tracking-tight">{n.title}</h2>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.excerpt}</p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      {formatDate(n.publish_date)}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
