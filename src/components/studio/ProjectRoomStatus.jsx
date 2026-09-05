import React, { useState } from "react";
import { Link } from "react-router-dom";
import { landmarks } from "@/lib/landmarks";
import { STAGES } from "@/components/studio/ProgressBar";
import { Loader2 } from "lucide-react";

export default function ProjectRoomStatus({ project, onStage, onPublish }) {
  const stage = project.stage || "idea";
  const index = Math.max(0, STAGES.indexOf(stage));
  const percent = Math.round(((index + 1) / STAGES.length) * 100);
  const nextStage = STAGES[index + 1];
  const [landmark, setLandmark] = useState(project.explore_landmark || landmarks[0].id);
  const [publishing, setPublishing] = useState(false);

  return (
    <div className="w-full md:w-[280px]">
      <div className="flex items-baseline justify-between text-[13px]">
        <span className="capitalize text-muted-foreground">{stage}</span>
        <span className="text-muted-foreground">{percent}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>

      {nextStage && nextStage !== "published" && (
        <button onClick={() => onStage(nextStage)} className="ba-btn-secondary mt-4 w-full">
          Move to next stage
        </button>
      )}

      {stage === "published" ? (
        <div className="mt-6">
          <p className="text-[13px] text-muted-foreground">
            Published at {landmarks.find((l) => l.id === project.explore_landmark)?.name || "the map"}.
          </p>
          <Link to={`/explore?landmark=${project.explore_landmark}`} className="ba-btn-secondary mt-3 w-full">
            See it on the map
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <label className="mb-2 block text-[13px] text-muted-foreground">Choose an Explore landmark</label>
          <select
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-2.5 text-[15px] outline-none focus:border-primary/50"
          >
            {landmarks.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <button
            className="ba-btn-primary mt-4 w-full"
            disabled={publishing}
            onClick={async () => { setPublishing(true); await onPublish(landmark); setPublishing(false); }}
          >
            {publishing && <Loader2 className="h-4 w-4 animate-spin" />} Publish to Explore
          </button>
        </div>
      )}
    </div>
  );
}