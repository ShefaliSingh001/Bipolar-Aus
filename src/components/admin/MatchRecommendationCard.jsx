import React, { useState } from "react";
import MatchScoreGrid from "@/components/admin/MatchScoreGrid";

const MEDALS = { 1: "🥇 Top Match", 2: "🥈 Second Match", 3: "🥉 Third Match" };

const STATUS_LABEL = {
  recommended: "Recommended",
  approved: "Approved",
  not_selected: "Not Selected",
  rejected: "Rejected",
  info_requested: "More info requested",
};

export default function MatchRecommendationCard({ match, decided, onApprove, approving }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="brand-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {MEDALS[match.rank] || `Rank ${match.rank}`}
          </p>
          <h4 className="mt-1.5 font-heading text-xl">{match.job_role_title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {Math.round(match.overall_match_score || 0)}% overall · {match.match_category || "—"} fit ·{" "}
            {STATUS_LABEL[match.recommendation_status] || match.recommendation_status}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="ba-btn-secondary py-2" onClick={() => setOpen(!open)}>
            {open ? "Hide details" : "View details"}
          </button>
          <button
            className="ba-btn-primary py-2"
            disabled={decided || approving}
            onClick={() => onApprove(match)}
          >
            {match.recommendation_status === "approved" ? "Approved" : approving ? "Approving…" : "Approve this role"}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-6 space-y-6 border-t border-border pt-6">
          <MatchScoreGrid match={match} />

          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Why this role matches</p>
            <p className="mt-1.5 text-[15px] leading-relaxed">{match.ai_explanation || "—"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Evidence from the resume</p>
            {(match.supporting_evidence || []).length ? (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
                {match.supporting_evidence.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            ) : (
              <p className="mt-1.5 text-[15px] text-muted-foreground">No supporting evidence was identified in the resume.</p>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Missing requirements</p>
            {(match.missing_requirements || []).length ? (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
                {match.missing_requirements.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            ) : (
              <p className="mt-1.5 text-[15px] text-muted-foreground">None identified.</p>
            )}
          </div>

          {match.admin_notes && (
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Admin notes</p>
              <p className="mt-1.5 text-[15px]">{match.admin_notes}</p>
            </div>
          )}
          {match.decision_timestamp && (
            <p className="text-sm text-muted-foreground">
              Decision recorded {new Date(match.decision_timestamp).toLocaleString()}
              {match.admin_decision ? ` by ${match.admin_decision}` : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}