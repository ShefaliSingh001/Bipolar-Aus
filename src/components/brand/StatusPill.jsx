import React from "react";

const TONES = {
  neutral: "bg-muted text-primary",
  active: "bg-primary text-primary-foreground",
  warm: "bg-accent text-accent-foreground",
  quiet: "bg-transparent text-muted-foreground border border-border",
  alert: "bg-destructive text-destructive-foreground",
};

const MAP = {
  open: "active", filled: "neutral", closed: "quiet",
  applied: "neutral", reviewing: "warm", accepted: "active", rejected: "alert", withdrawn: "quiet",
  new: "neutral", screening: "warm", active: "active", inactive: "quiet",
  assigned: "neutral", in_progress: "warm", completed: "active",
  not_started: "quiet",
  idea: "quiet", sketching: "neutral", creating: "warm", review: "neutral", published: "active",
};

export default function StatusPill({ status, tone, children }) {
  const resolved = TONES[tone || MAP[status] || "neutral"];
  const label = children || String(status || "").replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${resolved}`}>
      {label}
    </span>
  );
}