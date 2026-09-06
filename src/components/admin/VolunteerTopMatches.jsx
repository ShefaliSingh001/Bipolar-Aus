import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import MatchRecommendationCard from "@/components/admin/MatchRecommendationCard";

export default function VolunteerTopMatches({ volunteer, matches, adminName, onChanged }) {
  const [busy, setBusy] = useState(null);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [error, setError] = useState(null);

  const top3 = [...matches].sort((a, b) => (a.rank || 99) - (b.rank || 99)).slice(0, 3);
  const decided = top3.some((m) => ["approved", "not_selected", "rejected"].includes(m.recommendation_status));
  const approved = top3.find((m) => m.recommendation_status === "approved");

  const generate = async () => {
    setBusy("generate");
    setError(null);
    try {
      await base44.functions.invoke("rankVolunteerRoles", { volunteer_id: volunteer.id });
      await onChanged();
    } catch (e) {
      setError(e?.response?.data?.error || "Could not generate recommendations.");
    }
    setBusy(null);
  };

  const stamp = () => ({ admin_decision: adminName, admin_notes: notes || undefined, decision_timestamp: new Date().toISOString() });

  const approve = async (match) => {
    setBusy(match.id);
    await base44.entities.VolunteerJobMatch.update(match.id, { recommendation_status: "approved", ...stamp() });
    await Promise.all(
      top3.filter((m) => m.id !== match.id).map((m) =>
        base44.entities.VolunteerJobMatch.update(m.id, { recommendation_status: "not_selected", ...stamp() })
      )
    );
    await base44.entities.Volunteer.update(volunteer.id, { status: "active" });
    const application = await base44.entities.Application.create({
      volunteer_id: volunteer.id,
      volunteer_name: volunteer.name,
      volunteer_email: volunteer.email_id,
      volunteer_phone: volunteer.phone,
      role_id: match.job_role_id,
      role_title: match.job_role_title,
      status: "accepted",
      applied_date: new Date().toISOString(),
      hours_required: match.hours_required,
    });
    try {
      await base44.functions.invoke("sendShiftApprovalEmail", { application_id: application.id });
    } catch (e) {
      setError("Approved, but the approval email could not be sent.");
    }
    setBusy(null);
    await onChanged();
  };

  const bulk = async (status) => {
    setBusy(status);
    await Promise.all(top3.map((m) => base44.entities.VolunteerJobMatch.update(m.id, { recommendation_status: status, ...stamp() })));
    setBusy(null);
    await onChanged();
  };

  return (
    <div className="py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl">{volunteer.name || "Volunteer"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {volunteer.email_id || "—"}
            {approved ? ` · Approved for ${approved.job_role_title}` : top3.length ? " · Awaiting your decision" : " · No recommendations yet"}
            {!volunteer.resume && " · no resume on file"}
          </p>
        </div>
        <button className="ba-btn-secondary py-2" disabled={busy === "generate"} onClick={generate}>
          {busy === "generate" ? "Analysing resume…" : top3.length ? "Re-run matching" : "Generate top 3"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {!!top3.length && (
        <div className="mt-6 space-y-4">
          {top3.map((m) => (
            <MatchRecommendationCard
              key={m.id}
              match={m}
              decided={decided}
              approving={busy === m.id}
              onApprove={approve}
            />
          ))}

          {!decided && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button className="brand-btn-destructive" disabled={!!busy} onClick={() => bulk("rejected")}>Reject all</button>
              <button className="ba-btn-secondary py-2" onClick={() => setShowNotes(!showNotes)}>Request more information</button>
            </div>
          )}

          {showNotes && !decided && (
            <div className="brand-card">
              <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">What information do you need?</label>
              <textarea
                className="mt-2 w-full rounded-[var(--radius)] border border-border bg-card p-3 text-[15px] outline-none focus:border-primary/50"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button className="ba-btn-primary mt-4 py-2" disabled={!notes.trim() || !!busy} onClick={() => bulk("info_requested")}>
                Save request
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}