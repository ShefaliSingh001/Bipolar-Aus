import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import StatusPill from "@/components/brand/StatusPill";

export default function ApplicationsTab() {
  const [apps, setApps] = useState([]);
  const [openId, setOpenId] = useState(null);

  const load = async () => setApps(await base44.entities.Application.list("-created_date"));
  useEffect(() => { load(); }, []);

  const decide = async (app, status) => {
    await base44.entities.Application.update(app.id, { status });
    if (app.volunteer_id) {
      await base44.entities.Volunteer.update(app.volunteer_id, { status: status === "accepted" ? "active" : status === "rejected" ? "inactive" : "screening" });
    }
    if (status === "accepted" && app.role_id) {
      await base44.entities.JobRole.update(app.role_id, { status: "closed" });
    }
    load();
  };

  return (
    <div>
      <h2 className="font-heading text-2xl">Applications</h2>
      <div className="mt-6 divide-y divide-border">
        {apps.length === 0 && <p className="py-8 text-[15px] text-muted-foreground">No applications yet.</p>}
        {apps.map((a) => (
          <div key={a.id} className="py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-heading text-xl">{a.volunteer_name || "Volunteer"}</h3>
                  <StatusPill status={a.status} />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {a.role_title ? `Matched to ${a.role_title}` : "No role matched yet"}
                  {a.hours_required ? ` · ${a.hours_required}h` : ""}
                </p>
              </div>
              <button className="ba-btn-secondary py-2" onClick={() => setOpenId(openId === a.id ? null : a.id)}>
                {openId === a.id ? "Hide details" : "View details"}
              </button>
            </div>

            {openId === a.id && (
              <div className="brand-card mt-5">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div><dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Email</dt><dd className="mt-1 text-[15px]">{a.volunteer_email || "—"}</dd></div>
                  <div><dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Phone</dt><dd className="mt-1 text-[15px]">{a.volunteer_phone || "—"}</dd></div>
                  <div><dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Preferred area</dt><dd className="mt-1 text-[15px]">{a.preferred_area || "—"}</dd></div>
                  <div><dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Applied</dt><dd className="mt-1 text-[15px]">{a.applied_date ? new Date(a.applied_date).toLocaleDateString() : "—"}</dd></div>
                </dl>
                {!!(a.matched_skills || []).length && (
                  <div className="mt-5 flex flex-wrap gap-2">{a.matched_skills.map((s) => <span key={s} className="ba-status-pill">{s}</span>)}</div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="ba-btn-primary py-2" onClick={() => decide(a, "accepted")}>Accept</button>
                  <button className="ba-btn-secondary py-2" onClick={() => decide(a, "reviewing")}>Mark reviewing</button>
                  <button className="brand-btn-destructive" onClick={() => decide(a, "rejected")}>Reject</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}