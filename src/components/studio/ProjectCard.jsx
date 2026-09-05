import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import ProgressBar from "@/components/studio/ProgressBar";
import { skillMatchPercent } from "@/lib/creativeSkills";

export default function ProjectCard({ project, mySkills = [] }) {
  const match = skillMatchPercent(project.skills_wanted || [], mySkills);
  return (
    <Link to={`/studio/${project.id}`} className="group flex gap-6 border-b border-border py-7">
      {project.preview_url ? (
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[var(--radius)]">
          <Image src={project.preview_url} alt={project.title} className="h-28 w-28 transition-transform duration-500 group-hover:scale-105" fittingType="fill" />
        </div>
      ) : (
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[var(--radius)] bg-muted font-heading text-3xl text-primary">
          {project.title.charAt(0)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-heading text-xl transition-colors group-hover:text-primary">{project.title}</h3>
          <span className="text-sm text-primary">{match}% skill match</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.creator_name} · {(project.collaborators || []).length} {(project.collaborators || []).length === 1 ? "collaborator" : "collaborators"}
        </p>
        {project.story && (
          <p className="mt-2 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{project.story}</p>
        )}
        {!!(project.skills_wanted || []).length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.skills_wanted.map((s) => <span key={s} className="ba-status-pill">{s}</span>)}
          </div>
        )}
        <div className="mt-4 max-w-xs">
          <ProgressBar stage={project.stage || "idea"} />
        </div>
      </div>
    </Link>
  );
}