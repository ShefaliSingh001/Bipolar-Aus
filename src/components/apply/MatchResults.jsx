import React from "react";
import { Link } from "react-router-dom";
import StatusPill from "@/components/brand/StatusPill";

export default function MatchResults({ matches = [] }) {
  if (!matches.length) {
    return (
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        We don't have an open role that matches yet — our team will be in touch as soon as one opens.
      </p>
    );
  }
  return (
    <div className="divide-y divide-border">
      {matches.map((m) => (
        <div key={m.role_id} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <h3 className="font-heading text-xl">{m.role_title}</h3>
              {m.availability_fit && <StatusPill tone="neutral">Fits your times</StatusPill>}
            </div>
            {m.timings && <p className="mt-1.5 text-sm text-muted-foreground">{m.timings}</p>}
            {m.reason && <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{m.reason}</p>}
            {!!(m.matched_skills || []).length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {m.matched_skills.map((s) => (
                  <span key={s} className="ba-status-pill">{s}</span>
                ))}
              </div>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className="font-heading text-[34px] leading-none text-primary">{m.score}%</p>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">match</p>
          </div>
        </div>
      ))}
      <div className="pt-8">
        <Link to="/portal" className="ba-btn-primary">Go to your volunteer portal</Link>
      </div>
    </div>
  );
}