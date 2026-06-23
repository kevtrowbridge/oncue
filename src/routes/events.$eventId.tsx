import { createFileRoute, Link, Outlet, useParams, useRouterState } from "@tanstack/react-router";
import { EditorialHeader } from "@/components/EditorialHeader";
import { fmtDate, getEvent } from "@/lib/oncue-data";

export const Route = createFileRoute("/events/$eventId")({
  component: EventLayout,
  notFoundComponent: () => <div className="p-10 text-foreground">Event not found.</div>,
  errorComponent: ({ error }) => (
    <div className="p-10 text-foreground" role="alert">
      {error.message}
    </div>
  ),
});

const tabs = [
  { to: "/events/$eventId/setup", label: "Setup" },
  { to: "/events/$eventId/timeline", label: "Timeline" },
  { to: "/events/$eventId/day-of", label: "Day-Of" },
  { to: "/events/$eventId/people", label: "People" },
  { to: "/events/$eventId/status", label: "Status" },
  { to: "/events/$eventId/print", label: "Print & Share" },
] as const;

function EventLayout() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const evt = getEvent(eventId);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!evt) {
    return (
      <div className="min-h-screen bg-background p-10 text-foreground">
        <p>Event not found.</p>
        <Link to="/" className="text-gold underline">
          Back to events
        </Link>
      </div>
    );
  }

  const date = fmtDate(evt.date);

  return (
    <div className="min-h-screen bg-background">
      <EditorialHeader
        rightSlot={
          <div className="hidden text-right md:block">
            <div className="font-display text-lg text-[color:var(--obsidian)]">{evt.name}</div>
            <div className="text-xs text-[color:var(--obsidian)]/70">
              {date} · {evt.location}
            </div>
          </div>
        }
      />

      <nav className="border-b border-border bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-4 py-2 md:px-8">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to.replace("$eventId", eventId));
            return (
              <Link
                key={t.to}
                to={t.to}
                params={{ eventId }}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition ${
                  active
                    ? "bg-gradient-gold text-primary-foreground shadow-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
