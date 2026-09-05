import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import PageHeader from "@/components/brand/PageHeader";
import SkillChips from "@/components/apply/SkillChips";
import { creativeSkills } from "@/lib/creativeSkills";
import { getLandmark, landmarks } from "@/lib/landmarks";
import { Loader2 } from "lucide-react";

export default function CreateProject() {
  const navigate = useNavigate();
  const landmarkId = new URLSearchParams(window.location.search).get("landmark");
  const landmark = getLandmark(landmarkId) || landmarks[0];
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
      explore_landmark: landmark.id,
    });
    navigate(`/studio/${project.id}`);
  };

  return (
    <div className="min-h-screen">
      <StudioNav />
      <PageHeader
        eyebrow="New artwork"
        title="Start something and invite help"
        description={<>Creating for <span className="text-primary">{landmark.name}</span> on Explore</>}
        backTo="/studio"
        backLabel="Back to collaborations"
      />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <form onSubmit={submit} className="space-y-8">
          <div>
            <label className="mb-2 block text-sm">Artwork title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Morning After the Storm"
              className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none placeholder:text-muted-foreground/70 focus:border-primary/50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">The idea or story behind it</label>
            <textarea
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="What is this artwork about? What feeling or experience are you exploring?"
              className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none placeholder:text-muted-foreground/70 focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm">What help would you like?</label>
            <p className="mb-3 mt-1 text-sm text-muted-foreground">
              Volunteers with these creative skills will be matched to your project.
            </p>
            <SkillChips options={creativeSkills} selected={skills} onToggle={(s) => setSkills((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])} />
          </div>
          <button type="submit" disabled={saving || !title.trim()} className="ba-btn-primary">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Open the studio
          </button>
        </form>
      </main>
    </div>
  );
}