import React, { useState } from "react";
import { creativeSkills } from "@/lib/creativeSkills";

export default function ContributionTimeline({ contributions, onLog }) {
  const [form, setForm] = useState({ skill: creativeSkills[0], description: "", hours: 1 });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onLog({ ...form, hours: Number(form.hours) });
    setForm({ skill: creativeSkills[0], description: "", hours: 1 });
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-heading text-2xl">Contributions</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <select value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} className="rounded-full border border-border bg-card px-4 py-2 text-sm outline-none">
            {creativeSkills.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="number" min="0.5" step="0.5" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="w-24 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none" />
        </div>
        <input required placeholder="What did you do?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
        <button type="submit" disabled={saving} className="ba-btn-secondary">Log contribution</button>
      </form>

      <div className="mt-6 divide-y divide-border">
        {contributions.length === 0 && <p className="py-5 text-sm text-muted-foreground">Nothing logged yet.</p>}
        {contributions.map((c) => (
          <div key={c.id} className="py-4">
            <p className="text-[15px]">{c.description}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.contributor_name} · {c.skill} · {c.hours}h</p>
          </div>
        ))}
      </div>
    </div>
  );
}