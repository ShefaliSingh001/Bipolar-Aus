import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import PageHeader from "@/components/brand/PageHeader";
import ProjectCard from "@/components/studio/ProjectCard";
import { STAGES } from "@/components/studio/ProgressBar";
import { skillMatchPercent } from "@/lib/creativeSkills";

export default function Studio() {
  const [projects, setProjects] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [stage, setStage] = useState("all");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      setMySkills(me?.creative_skills || []);
      setProjects(await base44.entities.ArtProject.list("-created_date"));
      setLoading(false);
    })();
  }, []);

  let visible = stage === "all" ? projects : projects.filter((p) => (p.stage || "idea") === stage);
  if (sort === "match") {
    visible = [...visible].sort(
      (a, b) => skillMatchPercent(b.skills_wanted || [], mySkills) - skillMatchPercent(a.skills_wanted || [], mySkills)
    );
  }

  return (
    <div className="min-h-screen">
      <StudioNav />
      <PageHeader
        eyebrow="Studio"
        title="Make something together."
        description="Open projects started by community members and volunteers. Join the ones where your skills fit."
        actions={<Link to="/studio/create" className="ba-btn-primary">Start a project</Link>}
      />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center gap-3">
          {["all", ...STAGES].map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`rounded-full border px-4 py-2 text-sm capitalize transition-colors ${stage === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}
            >
              {s}
            </button>
          ))}
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-auto rounded-full border border-border bg-card px-4 py-2 text-sm outline-none">
            <option value="recent">Most recent</option>
            <option value="match">Best skill match</option>
          </select>
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="py-10 text-muted-foreground">Loading projects…</p>
          ) : visible.length === 0 ? (
            <div className="py-14">
              <p className="text-[15px] leading-relaxed text-muted-foreground">No projects here yet.</p>
              <Link to="/studio/create" className="ba-btn-primary mt-6">Start the first one</Link>
            </div>
          ) : (
            visible.map((p) => <ProjectCard key={p.id} project={p} mySkills={mySkills} />)
          )}
        </div>
      </main>
    </div>
  );
}