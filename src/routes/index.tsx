import { createFileRoute, Link } from "@tanstack/react-router";
import { EditorialHeader } from "@/components/EditorialHeader";
import { EVENTS, computeHealth, fmtDate } from "@/lib/oncue-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OnCue — Events" },
      {
        name: "description",
        content:
          "Your live events at a glance. Plan, recalculate, and execute with confidence.",
      },
      { property: "og:title", content: "OnCue — Events" },
      {
        property: "og:description",
        content: "The timeline that adapts with you.",
      },
    ],
  }),
  component: EventsPage,
});

const typeLabel: Record<string, string> = {
  wedding: "Wedding",
  conference: "Conference",
  "corporate-summit": "Corporate Summit",
  production: "Production Day",
};

function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <EditorialHeader
        rightSlot={
          <button className="rounded-md bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold transition hover:opacity-95">
            + New Event
          </button>
        }
      >
        <div className="text-center">
          <div className="font-display text-sm italic text-[color:var(--obsidian)]/80">
            The timeline that adapts with you.
          </div>
        </div>
      </EditorialHeader>

      <main className="mx-auto max-w-[1200px] px-6 py-10 md:py-14">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">Events</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              When schedules shift, OnCue instantly recalculates your day, maps dependencies,
              and keeps every vendor aligned.
            </p>
          </div>
          <div className="hidden gap-1 rounded-full border border-border bg-card p-1 text-xs md:flex">
            <button className="rounded-full bg-gradient-gold px-4 py-1.5 font-medium text-primary-foreground">
              Upcoming
            </button>
            <button className="rounded-full px-4 py-1.5 text-muted-foreground">Past</button>
          </div>
        </div>

        <div className="rule-gold mb-8" />

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* ⚠️ DEMO ONLY: EVENTS is hard-coded mock data and computeHealth is a frontend heuristic. */}
          {EVENTS.map((evt) => {
            const health = computeHealth(evt.id);
            const day = fmtDate(evt.date, { day: "2-digit", weekday: undefined, month: undefined, year: undefined });
            const mo = fmtDate(evt.date, { month: "short", weekday: undefined, day: undefined, year: undefined }).toUpperCase();
            const wk = fmtDate(evt.date, { weekday: "short", month: undefined, day: undefined, year: undefined }).toUpperCase();
            const statusColor =
              evt.health === "good"
                ? "status-on-track"
                : evt.health === "watch"
                  ? "status-shifting"
                  : "status-anchor";
            return (
              <li key={evt.id}>
                <Link
                  to="/events/$eventId/timeline"
                  params={{ eventId: evt.id }}
                  className="group block rounded-2xl border border-border bg-card p-6 transition hover:border-gold/60 hover:shadow-elegant"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-blush/15 py-3 text-center">
                      <span className="font-display text-xs uppercase tracking-widest text-gold">
                        {mo}
                      </span>
                      <span className="font-display text-3xl text-foreground">{day}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {wk}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-gold">
                        {typeLabel[evt.type]}
                      </div>
                      <h3 className="font-display text-xl text-foreground group-hover:text-gold">
                        {evt.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{evt.location}</p>
                      <div className="mt-4 flex items-center gap-3 text-xs">
                        <span className={`inline-flex items-center gap-1.5 ${statusColor}`}>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                          {evt.status === "on-track"
                            ? "On Track"
                            : evt.status === "planning"
                              ? "Planning"
                              : "Draft"}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          {health.criticalCompleted}/{health.criticalTotal} critical
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
