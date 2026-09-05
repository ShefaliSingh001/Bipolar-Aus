import React, { useState } from "react";
import StatusPill from "@/components/brand/StatusPill";

export default function TaskCard({ task, onUpdate }) {
  const [hours, setHours] = useState(task.hours_logged || 0);

  return (
    <div className="border-b border-border py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <h3 className="font-heading text-xl">{task.title}</h3>
          {task.description && (
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{task.description}</p>
          )}
          {task.space_url && (
            <a href={task.space_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-primary underline underline-offset-4">
              Open the shared space
            </a>
          )}
        </div>
        <StatusPill status={task.status} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          type="number"
          min="0"
          step="0.5"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-24 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-primary/50"
        />
        <button className="ba-btn-secondary py-2" onClick={() => onUpdate(task, { hours_logged: hours })}>
          Log hours
        </button>
        {task.status !== "in_progress" && task.status !== "completed" && (
          <button className="ba-btn-secondary py-2" onClick={() => onUpdate(task, { status: "in_progress" })}>
            Start task
          </button>
        )}
        {task.status !== "completed" && (
          <button className="ba-btn-primary py-2" onClick={() => onUpdate(task, { status: "completed", hours_logged: hours })}>
            Mark complete
          </button>
        )}
      </div>
    </div>
  );
}