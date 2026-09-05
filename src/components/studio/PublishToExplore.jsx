import React, { useState } from "react";
import { Link } from "react-router-dom";
import { landmarks } from "@/lib/landmarks";
import { Loader2 } from "lucide-react";

export default function PublishToExplore({ project, onPublish }) {
  const [landmark, setLandmark] = useState(landmarks[0].id);
  const [publishing, setPublishing] = useState(false);

  if (project.stage === "published") {
    return (
      <div className="brand-learncard">
        <h2 className="font-heading text-xl">Published to Explore</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          This artwork lives at {landmarks.find((l) => l.id === project.explore_landmark)?.name || "the map"}.
        </p>
        <Link to={`/explore?landmark=${project.explore_landmark}`} className="ba-btn-secondary mt-4">See it on the map</Link>
      </div>
    );
  }

  return (
    <div className="brand-learncard">
      <h2 className="font-heading text-xl">Publish to Explore</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        When it's ready, give it a place on the Sydney map so the community can find it.
      </p>
      <select value={landmark} onChange={(e) => setLandmark(e.target.value)} className="mt-4 w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50">
        {landmarks.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>
      <button
        className="ba-btn-primary mt-4"
        disabled={publishing}
        onClick={async () => { setPublishing(true); await onPublish(landmark); setPublishing(false); }}
      >
        {publishing && <Loader2 className="h-4 w-4 animate-spin" />} Publish artwork
      </button>
    </div>
  );
}