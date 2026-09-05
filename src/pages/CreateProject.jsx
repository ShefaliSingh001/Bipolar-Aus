import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import PageHeader from "@/components/brand/PageHeader";
import SkillChips from "@/components/apply/SkillChips";
import { creativeSkills } from "@/lib/creativeSkills";
import { Loader2 } from "lucide-react";

export default function CreateProject() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [skills, setSkills] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const project = await base44.entities.ArtProject.create({
      title,
      story,
      creator_name: user?.full_name || user?.email || "Community member",
      creator_email: user?.email,
      skills_wanted: skills,
      stage: "idea",
      collaborators: [],
      canvas: { strokes: [], items: [] },
      reach_count: 0,
    });
    navigate(`/studio/${project.id}`);
  };

  return (
    <div className="min-h-screen">
      <StudioNav />
      <PageHeader
        eyebrow="New project"
        title="Start with the idea."
        description="A sentence about what you want to make, and the skills you'd love someone to bring."
        backTo="/studio"
        backLabel="Back to Studio"
      />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <form onSubmit={submit} className="space-y-8">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">Project title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">The story behind it</label>
            <textarea rows={5} value={story} onChange={(e) => setStory(e.target.value)} className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="mb-3 block text-sm text-muted-foreground">Skills you're looking for</label>
            <SkillChips options={creativeSkills} selected={skills} onToggle={(s) => setSkills((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])} />
          </div>
          <button type="submit" disabled={saving || !title.trim()} className="ba-btn-primary">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Create project
          </button>
        </form>
      </main>
    </div>
  );
}