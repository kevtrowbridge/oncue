import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { fmtDate, fmtTime, getActivities, getEvent } from "@/lib/oncue-data";

export const Route = createFileRoute("/events/$eventId/print")({
  component: PrintPage,
});

const views = [
  { id: "full", label: "Full Run Sheet" },
  { id: "photographer", label: "Photographer View" },
  { id: "planner", label: "Planner View" },
  { id: "dj", label: "DJ View" },
  { id: "vendor", label: "Vendor View" },
] as const;

type ViewId = (typeof views)[number]["id"];

function PrintPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const evt = getEvent(eventId)!;
  const all = getActivities(eventId);
  const [view, setView] = useState<ViewId>("photographer");

  const filtered =
    view === "full" || view === "planner"
      ? all
      : view === "photographer"
        ? all.filter((a) => a.ownerRole === "Photographer")
        : view === "dj"
          ? all.filter((a) => a.ownerRole === "DJ")
          : all.filter((a) => !a.isOptional);

  const date = fmtDate(evt.date);

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6 md:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Print & Share</div>
          <h1 className="font-display text-3xl text-foreground">Run Sheets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtered views print exactly what's on screen.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-border bg-card p-1 text-xs">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`rounded-full px-3 py-1.5 ${
                view === v.id
                  ? "bg-gradient-gold text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-md bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold"
        >
          Print
        </button>
      </div>

      {/* Print sheet */}
      <article className="rounded-xl border border-border bg-alabaster p-8 text-[color:var(--obsidian)] shadow-elegant print:rounded-none print:border-0 print:shadow-none">
        <header className="flex items-center justify-between gap-4 border-b border-gold/40 pb-5">
          <div className="flex items-center gap-4">
            <Logo size={56} />
            <div>
              <div className="font-display text-2xl">
                OnCue<span className="text-gold">.</span>
              </div>
              <div className="font-display text-xs italic text-[color:var(--obsidian)]/70">
                {views.find((v) => v.id === view)?.label}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-xl">{evt.name}</div>
            <div className="text-xs text-[color:var(--obsidian)]/70">{date}</div>
            <div className="text-xs text-[color:var(--obsidian)]/70">{evt.location}</div>
          </div>
        </header>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--obsidian)]/15 text-left text-[10px] uppercase tracking-widest text-[color:var(--obsidian)]/60">
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Activity</th>
              <th className="py-2 pr-4">Location</th>
              <th className="py-2 pr-4">Owner</th>
              <th className="py-2">Dur.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-[color:var(--obsidian)]/10 align-top">
                <td className="py-2 pr-4 font-mono">{fmtTime(a.start)}</td>
                <td className="py-2 pr-4">
                  <div className="font-medium">{a.title}</div>
                  {a.notes && (
                    <div className="text-xs italic text-[color:var(--obsidian)]/60">{a.notes}</div>
                  )}
                </td>
                <td className="py-2 pr-4">{a.location}</td>
                <td className="py-2 pr-4">{a.ownerRole}</td>
                <td className="py-2">{a.duration}m</td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="mt-6 flex items-center justify-between border-t border-gold/40 pt-4 text-[10px] uppercase tracking-[0.2em] text-[color:var(--obsidian)]/60">
          <span>Elegant. Refined. Intelligent.</span>
          <span>OnCue is Timeline Intelligence.</span>
        </footer>
      </article>
    </div>
  );
}
