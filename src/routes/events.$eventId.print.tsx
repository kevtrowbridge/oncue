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

// ⚠️ DEMO ONLY — Share list is static; Phase 3 loads real participants from Supabase.
const DEMO_PARTICIPANTS = [
  { id: "1", role: "Planner", name: "Sophie Laurent", status: "Invited" },
  { id: "2", role: "Videographer", name: "Lumen Films", status: "Invited" },
  { id: "3", role: "DJ", name: "Resonance Audio", status: "Not invited" },
  { id: "4", role: "Couple", name: "Sarah & Daniel", status: "Invited" },
  { id: "5", role: "Catering Lead", name: "Marigold Events", status: "Not invited" },
];

function PrintPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const evt = getEvent(eventId)!;
  const all = getActivities(eventId);
  const [view, setView] = useState<ViewId>("photographer");
  const [shareTab, setShareTab] = useState<"link" | "people">("link");
  const [copied, setCopied] = useState(false);
  const [invited, setInvited] = useState<Set<string>>(
    new Set(DEMO_PARTICIPANTS.filter((p) => p.status === "Invited").map((p) => p.id)),
  );

  const filtered =
    view === "full" || view === "planner"
      ? all
      : view === "photographer"
        ? all.filter((a) => a.ownerRole === "Photographer")
        : view === "dj"
          ? all.filter((a) => a.ownerRole === "DJ")
          : all.filter((a) => !a.isOptional);

  const date = fmtDate(evt.date);
  const demoLink = `https://app.oncue.io/share/${eventId}/demo`;

  const handleCopy = () => {
    navigator.clipboard.writeText(demoLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleInvite = (id: string) => {
    setInvited((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6 md:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Print & Share</div>
          <h1 className="font-display text-3xl text-foreground">Run Sheets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtered views print exactly what's on screen. Share a live link so vendors always see the current version.
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

      {/* Share panel — prototype; not wired to real auth/invitations */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5 print:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[10px] uppercase tracking-widest text-gold">Share</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              ⚠️ Demo — sharing controls are prototypes only; not wired in Phase 2.
            </p>
          </div>
          <div className="flex gap-1 rounded-full border border-border bg-background p-0.5 text-xs">
            {(["link", "people"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setShareTab(t)}
                className={`rounded-full px-3 py-1 capitalize ${
                  shareTab === t ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {t === "link" ? "Share Link" : "With People"}
              </button>
            ))}
          </div>
        </div>

        {shareTab === "link" && (
          <div className="space-y-3">
            {/* Link copy */}
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={demoLink}
                className="min-w-0 flex-1 rounded-md border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary/50"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            {/* Quick share buttons */}
            <div className="flex flex-wrap gap-2">
              <ShareBtn
                label="Email"
                icon="✉"
                href={`mailto:?subject=${encodeURIComponent(`${evt.name} Timeline`)}&body=${encodeURIComponent(`Here is the OnCue timeline for ${evt.name}:\n\n${demoLink}`)}`}
              />
              <ShareBtn
                label="Text / SMS"
                icon="💬"
                href={`sms:?body=${encodeURIComponent(`OnCue timeline for ${evt.name}: ${demoLink}`)}`}
              />
              <ShareBtn
                label="Share…"
                icon="↑"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: evt.name, url: demoLink }).catch(() => {});
                  }
                }}
              />
            </div>
          </div>
        )}

        {shareTab === "people" && (
          <div>
            <p className="mb-3 text-xs text-muted-foreground">
              Choose who can see the live timeline. Each person receives a role-filtered view.
            </p>
            <ul className="space-y-2">
              {DEMO_PARTICIPANTS.map((p) => {
                const isInvited = invited.has(p.id);
                return (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                  >
                    <div>
                      <span className="font-medium text-foreground">{p.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{p.role}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleInvite(p.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        isInvited
                          ? "bg-[color:var(--on-track)]/15 text-[color:var(--on-track)] hover:bg-[color:var(--on-track)]/25"
                          : "border border-border text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {isInvited ? "✓ Invited" : "Invite"}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Invitations will send a notification and a filtered link when OnCue is live. Demo only in Phase 2.
            </p>
          </div>
        )}
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

function ShareBtn({
  label,
  icon,
  href,
  onClick,
}: {
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
}) {
  const cls =
    "flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary/50";
  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        <span>{icon}</span>
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      <span>{icon}</span>
      {label}
    </button>
  );
}
