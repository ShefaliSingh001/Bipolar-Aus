import React, { useState } from "react";
import SkillChips from "@/components/apply/SkillChips";
import { creativeSkills } from "@/lib/creativeSkills";

export default function CollaboratorsPanel({ project, user, onJoin }) {
  const collaborators = project.collaborators || [];
  const joined = collaborators.some((c) => c.email === user?.email) || project.creator_email === user?.email;
  const [skills, setSkills] = useState(user?.creative_skills || []);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h2 className="font-heading text-2xl">Collaborators</h2>
      <div className="mt-4 divide-y divide-border">
        <div className="py-3">
          <p className="text-[15px]">{project.creator_name} <span className="text-sm text-muted-foreground">· started this</span></p>
        </div>
        {collaborators.map((c, i) => (
          <div key={c.email + i} className="py-3">
            <p className="text-[15px]">{c.name}</p>
            {!!(c.skills || []).length && (
              <div className="mt-1.5 flex flex-wrap gap-2">{c.skills.map((s) => <span key={s} className="ba-status-pill">{s}</span>)}</div>
            )}
          </div>
        ))}
      </div>

      {!joined && (
        <div className="mt-5">
          {!open ? (
            <button className="ba-btn-primary" onClick={() => setOpen(true)}>Join this project</button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">What will you bring?</p>
              <SkillChips options={creativeSkills} selected={skills} onToggle={(s) => setSkills((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])} />
              <button className="ba-btn-primary" disabled={!skills.length} onClick={() => onJoin(skills)}>Confirm and join</button>
            </div>
          )}
        </div>
      )}
      {joined && <p className="mt-5 ba-status-pill">You're on this project</p>}
    </div>
  );
}