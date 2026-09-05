import React from "react";

export const STAGES = ["idea", "sketching", "creating", "review", "published"];

export default function ProgressBar({ stage }) {
  const index = Math.max(0, STAGES.indexOf(stage));
  return (
    <div>
      <div className="flex gap-1.5">
        {STAGES.map((s, i) => (
          <span key={s} className={`h-1 flex-1 rounded-full ${i <= index ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
      <p className="mt-2 text-xs capitalize text-muted-foreground">{stage}</p>
    </div>
  );
}