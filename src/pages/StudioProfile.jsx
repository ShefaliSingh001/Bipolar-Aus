import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import PageHeader from "@/components/brand/PageHeader";
import SkillChips from "@/components/apply/SkillChips";
import { creativeSkills } from "@/lib/creativeSkills";
import { Loader2, Check } from "lucide-react";

export default function StudioProfile() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      setUser(me);
      setSkills(me?.creative_skills || []);
      setBio(me?.bio || "");
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    await base44.auth.updateMe({ creative_skills: skills, bio });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen">
      <StudioNav />
      <PageHeader
        eyebrow="Profile"
        title="Your creative profile"
        description="These skills drive the match percentages you see across the Studio."
        backTo="/studio"
        backLabel="Back to Studio"
      />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-muted-foreground">{user?.full_name || user?.email}</p>

        <div className="mt-10">
          <label className="mb-3 block text-sm text-muted-foreground">Your creative skills</label>
          <SkillChips options={creativeSkills} selected={skills} onToggle={(s) => setSkills((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])} />
        </div>

        <div className="mt-10">
          <label className="mb-2 block text-sm text-muted-foreground">A short bio</label>
          <textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
        </div>

        <button onClick={save} disabled={saving} className="ba-btn-primary mt-10">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saved && <Check className="h-4 w-4" />}
          {saved ? "Saved" : "Save profile"}
        </button>
      </main>
    </div>
  );
}