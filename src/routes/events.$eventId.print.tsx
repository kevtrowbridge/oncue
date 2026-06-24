import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import {
  fmtDate,
  fmtTime,
  getActivities,
  getEvent,
  getMasterChecklist,
  generatePhotoGroups,
} from "@/lib/oncue-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/events/$eventId/print")({
  component: PrintPage,
});

const views = [
  { id: "full", label: "Full Run Sheet" },
  { id: "photographer", label: "Photographer" },
  { id: "planner", label: "Planner" },
  { id: "dj", label: "DJ" },
  { id: "vendor", label: "All Vendors" },
] as const;

type ViewId = (typeof views)[number]["id"];

// Permission levels — prototype; not wired to real auth in Phase 2.
const PERMISSION_LEVELS = [
  { value: "view-only", label: "View Only" },
  { value: "acknowledge", label: "View + Acknowledge" },
  { value: "suggest-changes", label: "Suggest Changes" },
  { value: "request-changes", label: "Request Changes" },
  { value: "full-edit", label: "Full Edit" },
  { value: "co-owner", label: "Co-Owner" },
] as const;

type PermissionLevel = (typeof PERMISSION_LEVELS)[number]["value"];

// ⚠️ DEMO ONLY — static prototype data; Phase 3 loads from Supabase.
const DEMO_PARTICIPANTS: Array<{
  id: string;
  role: string;
  name: string;
  defaultPermission: PermissionLevel;
}> = [
  { id: "1", role: "Planner", name: "Sophie Laurent", defaultPermission: "full-edit" },
  { id: "2", role: "Videographer", name: "Lumen Films", defaultPermission: "view-only" },
  { id: "3", role: "DJ", name: "Resonance Audio", defaultPermission: "acknowledge" },
  { id: "4", role: "Couple", name: "Sarah & Daniel", defaultPermission: "suggest-changes" },
  { id: "5", role: "Catering Lead", name: "Marigold Events", defaultPermission: "view-only" },
];

// ⚠️ DEMO ONLY — static data for print backup sections.
const DEMO_PEOPLE_PRINT = [
  { name: "Sarah Chen", role: "Bride", side: "Side A", phone: "" },
  { name: "Daniel Okonkwo", role: "Groom", side: "Side B", phone: "" },
  { name: "Margaret Chen", role: "Bride's Mother", side: "Side A", phone: "+1 555-0201" },
  { name: "James Chen", role: "Bride's Father", side: "Side A", phone: "+1 555-0202" },
  { name: "Patricia Okonkwo", role: "Groom's Mother", side: "Side B", phone: "+1 555-0211" },
  { name: "Charles Okonkwo", role: "Groom's Father", side: "Side B", phone: "+1 555-0212" },
  { name: "Eleanor Voss", role: "Bride's Grandmother", side: "Side A", phone: "+1 555-0221" },
  { name: "Sophie Laurent", role: "Maid of Honor", side: "Side A", phone: "+1 555-0182" },
  { name: "Jordan Blake", role: "Best Man", side: "Side B", phone: "+1 555-0192" },
];

const DEMO_VENDORS_PRINT = [
  { role: "Photographer", name: "You", phone: "", arrival: "13:00", departure: "22:00" },
  { role: "Videographer", name: "Lumen Films", phone: "+1 555-0191", arrival: "14:00", departure: "22:00" },
  { role: "Planner", name: "Sophie Laurent", phone: "+1 555-0182", arrival: "11:00", departure: "23:00" },
  { role: "DJ", name: "Resonance Audio", phone: "+1 555-0100", arrival: "15:00", departure: "23:00" },
  { role: "Florist", name: "Bloom & Co.", phone: "+1 555-0145", arrival: "09:00", departure: "16:00" },
  { role: "Hair & Makeup", name: "Studio Glow", phone: "+1 555-0133", arrival: "08:00", departure: "14:00" },
  { role: "Caterer", name: "Marigold Events", phone: "+1 555-0166", arrival: "14:00", departure: "23:00" },
];

const DEMO_EMERGENCY_CONTACTS = [
  { name: "Sophie Laurent (Planner)", phone: "+1 555-0182", note: "Primary day-of contact" },
  { name: "Sarah Chen (Bride)", phone: "+1 555-0310", note: "" },
  { name: "Daniel Okonkwo (Groom)", phone: "+1 555-0320", note: "" },
  { name: "Margaret Chen (Bride's Mother)", phone: "+1 555-0201", note: "" },
  { name: "Charles Okonkwo (Groom's Father)", phone: "+1 555-0212", note: "" },
];

function PrintPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const evt = getEvent(eventId)!;
  const all = getActivities(eventId);
  const masterChecklist = getMasterChecklist(eventId);
  const photoGroups = generatePhotoGroups(eventId);

  const [view, setView] = useState<ViewId>("photographer");
  const [shareTab, setShareTab] = useState<"link" | "people">("link");
  const [copied, setCopied] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(true);
  const [showPrintOptions, setShowPrintOptions] = useState(true);

  // Permission levels per participant — defaults set per role
  const [permissions, setPermissions] = useState<Record<string, PermissionLevel>>(
    () => Object.fromEntries(DEMO_PARTICIPANTS.map((p) => [p.id, p.defaultPermission])),
  );

  // Section inclusions for print/export
  const [sections, setSections] = useState({
    timeline: true,
    checklist: true,
    photoGroups: false,
    peopleList: false,
    vendorContacts: true,
    emergencyContacts: false,
  });
  const toggleSection = (key: keyof typeof sections) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));

  const filtered =
    view === "full" || view === "planner"
      ? all
      : view === "photographer"
        ? all.filter((a) => a.ownerRole === "Photographer")
        : view === "dj"
          ? all.filter((a) => a.ownerRole === "DJ")
          : all.filter((a) => !a.isOptional);

  const date = fmtDate(evt.date);
  const demoLink = `https://app.oncue.day/share/${eventId}/demo`;

  const handleCopy = () => {
    navigator.clipboard.writeText(demoLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-6 md:px-8">
      {/* Screen controls — hidden when printing */}
      <div className="space-y-4 print:hidden">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-gold">Print & Share</div>
            <h1 className="font-display text-3xl text-foreground">Run Sheets & Backup</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Share a live link for online access or print a complete offline backup package.
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
            Print / Export
          </button>
        </div>

        {/* Share panel */}
        <CollapsibleControl
          title="Share"
          note="⚠️ Demo — sharing is not wired in Phase 2."
          open={showSharePanel}
          onToggle={() => setShowSharePanel((s) => !s)}
          right={
            <div className="flex gap-1 rounded-full border border-border bg-background p-0.5 text-xs">
              {(["link", "people"] as const).map((t) => (
                <button
                  key={t}
                  onClick={(e) => { e.stopPropagation(); setShareTab(t); }}
                  className={`rounded-full px-3 py-1 ${
                    shareTab === t ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t === "link" ? "Share Link" : "With People"}
                </button>
              ))}
            </div>
          }
        >
          {shareTab === "link" && (
            <div className="space-y-3">
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
                Set access levels for each person. Each receives a filtered view matching their role.
              </p>
              <div className="mb-2 grid grid-cols-[1fr,1fr,200px] gap-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Name</span>
                <span>Role</span>
                <span>Permission</span>
              </div>
              <ul className="space-y-1.5">
                {DEMO_PARTICIPANTS.map((p) => (
                  <li
                    key={p.id}
                    className="grid grid-cols-[1fr,1fr,200px] items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.role}</span>
                    <Select
                      value={permissions[p.id]}
                      onValueChange={(v) =>
                        setPermissions((s) => ({ ...s, [p.id]: v as PermissionLevel }))
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERMISSION_LEVELS.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-md bg-secondary/30 p-3 text-xs text-muted-foreground">
                <strong className="text-foreground">Permission levels:</strong>{" "}
                View Only sees the timeline. View + Acknowledge can confirm receipt. Suggest Changes can propose edits for review. Request Changes routes edits through approval. Full Edit modifies the timeline directly. Co-Owner has full control.
                <span className="ml-1 text-gold">Prototype — not active in Phase 2.</span>
              </div>
            </div>
          )}
        </CollapsibleControl>

        {/* Print options — section inclusions */}
        <CollapsibleControl
          title="What to include in this print / export"
          note="Select sections to include in the printed package."
          open={showPrintOptions}
          onToggle={() => setShowPrintOptions((s) => !s)}
        >
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {([
              { key: "timeline", label: "Day-of Timeline", desc: "Activity sequence by role" },
              { key: "checklist", label: "Master Checklist", desc: "All tasks by activity" },
              { key: "photoGroups", label: "Photo Groups", desc: "Family portrait sequence" },
              { key: "peopleList", label: "People List", desc: "Guests and wedding party" },
              { key: "vendorContacts", label: "Vendor Contacts", desc: "Roles, phones, arrival times" },
              { key: "emergencyContacts", label: "Emergency Contacts", desc: "Day-of key people" },
            ] as const).map(({ key, label, desc }) => (
              <label
                key={key}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border p-3 hover:bg-secondary/30"
              >
                <input
                  type="checkbox"
                  checked={sections[key]}
                  onChange={() => toggleSection(key)}
                  className="mt-0.5 h-4 w-4"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-[11px] text-muted-foreground">{desc}</div>
                </div>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            The printed package functions as a complete offline wedding-day backup. Include Vendor Contacts and Emergency Contacts for full redundancy.
          </p>
        </CollapsibleControl>
      </div>

      {/* Print document */}
      <article className="mt-6 rounded-xl border border-border bg-alabaster p-8 text-[color:var(--obsidian)] shadow-elegant print:mt-0 print:rounded-none print:border-0 print:shadow-none">
        {/* Document header */}
        <header className="flex items-center justify-between gap-4 border-b border-gold/40 pb-5">
          <div className="flex items-center gap-4">
            <Logo size={48} />
            <div>
              <div className="font-display text-xl">
                OnCue<span className="text-gold">.</span>
              </div>
              <div className="text-xs text-[color:var(--obsidian)]/60">
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

        {/* Section: Timeline */}
        {sections.timeline && (
          <section className="mt-6">
            <PrintSectionHeader>Day-of Timeline</PrintSectionHeader>
            <table className="mt-2 w-full text-sm">
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
          </section>
        )}

        {/* Section: Master Checklist */}
        {sections.checklist && (
          <section className="mt-8">
            <PrintSectionHeader>Master Checklist</PrintSectionHeader>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--obsidian)]/15 text-left text-[10px] uppercase tracking-widest text-[color:var(--obsidian)]/60">
                  <th className="py-2 pr-4" style={{ width: 20 }}></th>
                  <th className="py-2 pr-4">Task</th>
                  <th className="py-2 pr-4">Activity</th>
                  <th className="py-2">Owner</th>
                </tr>
              </thead>
              <tbody>
                {masterChecklist.map((c) => (
                  <tr key={c.id} className="border-b border-[color:var(--obsidian)]/10">
                    <td className="py-1.5 pr-4">
                      <div className="h-3.5 w-3.5 rounded border border-[color:var(--obsidian)]/40" />
                    </td>
                    <td className="py-1.5 pr-4">{c.label}</td>
                    <td className="py-1.5 pr-4 text-[color:var(--obsidian)]/60 text-xs">{c.activityTitle}</td>
                    <td className="py-1.5 text-[color:var(--obsidian)]/60 text-xs">{c.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Section: Photo Groups */}
        {sections.photoGroups && (
          <section className="mt-8">
            <PrintSectionHeader>Photo Groups — Portrait Sequence</PrintSectionHeader>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--obsidian)]/15 text-left text-[10px] uppercase tracking-widest text-[color:var(--obsidian)]/60">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-4">Group</th>
                  <th className="py-2 pr-4">People</th>
                  <th className="py-2">Est.</th>
                </tr>
              </thead>
              <tbody>
                {photoGroups.filter((g) => !g.deferred).map((g, i) => (
                  <tr key={g.id} className="border-b border-[color:var(--obsidian)]/10 align-top">
                    <td className="py-1.5 pr-3 text-[color:var(--obsidian)]/60">{i + 1}</td>
                    <td className="py-1.5 pr-4 font-medium">{g.name}</td>
                    <td className="py-1.5 pr-4 text-xs text-[color:var(--obsidian)]/70">{g.people.join(", ")}</td>
                    <td className="py-1.5 text-xs">{g.minutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Section: People List */}
        {sections.peopleList && (
          <section className="mt-8">
            <PrintSectionHeader>People List</PrintSectionHeader>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--obsidian)]/15 text-left text-[10px] uppercase tracking-widest text-[color:var(--obsidian)]/60">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Side</th>
                  <th className="py-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_PEOPLE_PRINT.map((p, i) => (
                  <tr key={i} className="border-b border-[color:var(--obsidian)]/10">
                    <td className="py-1.5 pr-4 font-medium">{p.name}</td>
                    <td className="py-1.5 pr-4">{p.role}</td>
                    <td className="py-1.5 pr-4 text-xs text-[color:var(--obsidian)]/60">{p.side}</td>
                    <td className="py-1.5 text-xs font-mono">{p.phone || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 text-[10px] text-[color:var(--obsidian)]/40">⚠️ Demo data</p>
          </section>
        )}

        {/* Section: Vendor Contacts */}
        {sections.vendorContacts && (
          <section className="mt-8">
            <PrintSectionHeader>Vendor Contacts</PrintSectionHeader>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--obsidian)]/15 text-left text-[10px] uppercase tracking-widest text-[color:var(--obsidian)]/60">
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Arrives</th>
                  <th className="py-2">Departs</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_VENDORS_PRINT.map((v, i) => (
                  <tr key={i} className="border-b border-[color:var(--obsidian)]/10">
                    <td className="py-1.5 pr-4 font-medium">{v.role}</td>
                    <td className="py-1.5 pr-4">{v.name}</td>
                    <td className="py-1.5 pr-4 font-mono text-xs">{v.phone || "—"}</td>
                    <td className="py-1.5 pr-4 text-xs">{v.arrival}</td>
                    <td className="py-1.5 text-xs">{v.departure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 text-[10px] text-[color:var(--obsidian)]/40">⚠️ Demo data</p>
          </section>
        )}

        {/* Section: Emergency Contacts */}
        {sections.emergencyContacts && (
          <section className="mt-8">
            <PrintSectionHeader>Emergency Contacts</PrintSectionHeader>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--obsidian)]/15 text-left text-[10px] uppercase tracking-widest text-[color:var(--obsidian)]/60">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_EMERGENCY_CONTACTS.map((c, i) => (
                  <tr key={i} className="border-b border-[color:var(--obsidian)]/10">
                    <td className="py-1.5 pr-4 font-medium">{c.name}</td>
                    <td className="py-1.5 pr-4 font-mono text-xs">{c.phone}</td>
                    <td className="py-1.5 text-xs text-[color:var(--obsidian)]/60">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 text-[10px] text-[color:var(--obsidian)]/40">⚠️ Demo data</p>
          </section>
        )}

        {/* Document footer */}
        <footer className="mt-8 flex items-center justify-between border-t border-gold/40 pt-4 text-[10px] uppercase tracking-[0.15em] text-[color:var(--obsidian)]/50">
          <span>Generated with OnCue</span>
          <span>oncue.day</span>
        </footer>
      </article>
    </div>
  );
}

// ─── Shared helpers ──────────────────────────────────────────

function CollapsibleControl({
  title,
  note,
  open,
  onToggle,
  right,
  children,
}: {
  title: string;
  note?: string;
  open: boolean;
  onToggle: () => void;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <div>
            <div className="text-sm font-medium text-foreground">{title}</div>
            {note && <div className="mt-0.5 text-[11px] text-muted-foreground">{note}</div>}
          </div>
        </div>
        {right && (
          <div onClick={(e) => e.stopPropagation()}>{right}</div>
        )}
      </button>
      {open && (
        <div className="border-t border-border/60 px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

function PrintSectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--obsidian)]/60 border-b border-[color:var(--obsidian)]/15 pb-1">
      {children}
    </h2>
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
