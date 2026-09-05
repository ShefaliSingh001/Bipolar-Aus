import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import PageHeader from "@/components/brand/PageHeader";
import StatusPill from "@/components/brand/StatusPill";
import CanvasBoard from "@/components/studio/CanvasBoard";
import CollaboratorsPanel from "@/components/studio/CollaboratorsPanel";
import ContributionTimeline from "@/components/studio/ContributionTimeline";
import CommentsPanel from "@/components/studio/CommentsPanel";
import PublishToExplore from "@/components/studio/PublishToExplore";
import ProgressBar, { STAGES } from "@/components/studio/ProgressBar";

export default function ProjectRoom() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [p, c, cm] = await Promise.all([
      base44.entities.ArtProject.get(id),
      base44.entities.Contribution.filter({ project_id: id }, "-created_date"),
      base44.entities.ArtComment.filter({ project_id: id }, "-created_date"),
    ]);
    setProject(p);
    setContributions(c);
    setComments(cm);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    base44.auth.me().then(setUser);
    load();
  }, [load]);

  useEffect(() => {
    const unsubProject = base44.entities.ArtProject.subscribe(() => load());
    const unsubContrib = base44.entities.Contribution.subscribe(() => load());
    const unsubComments = base44.entities.ArtComment.subscribe(() => load());
    return () => { unsubProject(); unsubContrib(); unsubComments(); };
  }, [load]);

  const join = async (skills) => {
    const next = [...(project.collaborators || []), { name: user?.full_name || user?.email, email: user?.email, skills }];
    await base44.entities.ArtProject.update(project.id, { collaborators: next });
    load();
  };

  const logContribution = async (data) => {
    await base44.entities.Contribution.create({
      project_id: project.id,
      project_title: project.title,
      contributor_name: user?.full_name || user?.email || "Community member",
      contributor_email: user?.email,
      ...data,
    });
    load();
  };

  const addComment = async ({ text, kind }) => {
    await base44.entities.ArtComment.create({
      project_id: project.id,
      author_name: user?.full_name || user?.email || "Community member",
      author_email: user?.email,
      text,
      kind,
    });
    load();
  };

  const setStage = async (stage) => {
    await base44.entities.ArtProject.update(project.id, { stage });
    load();
  };

  const publish = async (landmarkId) => {
    await base44.entities.Creation.create({
      title: project.title,
      landmark: landmarkId,
      creator_name: project.creator_name,
      type: "artwork",
      description: project.story,
      image_url: project.preview_url,
      project_id: project.id,
    });
    await base44.entities.ArtProject.update(project.id, {
      stage: "published",
      explore_landmark: landmarkId,
      published_at: new Date().toISOString(),
      reach_count: (project.reach_count || 0) + 1,
    });
    load();
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Opening the project room…</div>;
  if (!project) {
    return (
      <div className="min-h-screen">
        <StudioNav />
        <PageHeader title="We couldn't find that project." backTo="/studio" backLabel="Back to Studio" />
        <div className="mx-auto max-w-3xl px-6 py-12"><Link to="/studio" className="ba-btn-primary">Browse projects</Link></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StudioNav />
      <PageHeader
        eyebrow="Project room"
        title={project.title}
        description={project.story}
        backTo="/studio"
        backLabel="Back to Studio"
        actions={<StatusPill status={project.stage} />}
      />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="max-w-md">
          <ProgressBar stage={project.stage || "idea"} />
          <div className="mt-4 flex flex-wrap gap-2">
            {STAGES.filter((s) => s !== "published").map((s) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition-colors ${project.stage === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-16">
            <CanvasBoard project={project} onSaved={load} />
            <ContributionTimeline contributions={contributions} onLog={logContribution} />
            <CommentsPanel comments={comments} onAdd={addComment} />
          </div>
          <aside className="space-y-14">
            <CollaboratorsPanel project={project} user={user} onJoin={join} />
            {!!(project.skills_wanted || []).length && (
              <div>
                <h2 className="font-heading text-2xl">Skills wanted</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.skills_wanted.map((s) => <span key={s} className="ba-status-pill">{s}</span>)}
                </div>
              </div>
            )}
            <PublishToExplore project={project} onPublish={publish} />
          </aside>
        </div>
      </main>
    </div>
  );
}