import React from "react";

export default function LandmarkInfoCard({ landmark, count, onClear }) {
  return (
    <div className="border-b border-border pb-8">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected place</p>
      <h2 className="mt-3 font-heading text-3xl leading-tight">{landmark.name}</h2>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{landmark.blurb}</p>
      <div className="mt-5 flex items-center gap-4">
        <span className="ba-status-pill">{count} {count === 1 ? "creation" : "creations"}</span>
        <button className="text-sm text-muted-foreground hover:text-primary" onClick={onClear}>Clear selection</button>
      </div>
    </div>
  );
}