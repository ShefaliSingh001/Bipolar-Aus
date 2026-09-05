import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import StatusPill from "@/components/brand/StatusPill";
import SkillChips from "@/components/apply/SkillChips";
import { volunteerSkills } from "@/lib/creativeSkills";

export default function RolesTab() {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", hours_required: 3, timings: "" });
  const [skills, setSkills] = useState([]);

  const load = async () => setRoles(await base44.entities.JobRole.list("-created_date"));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await base44.entities.JobRole.create({ ...form, hours_required: Number(form.hours_required), required_skills: skills, status: "open" });
    setForm({ title: "", description: "", hours_required: 3, timings: "" });
    setSkills([]);
    setOpen(false);
    load();
  };

  const setStatus = async (role, status) => {
    await base44.entities.JobRole.update(role.id, { status });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl">Volunteer roles</h2>
        <button className="ba-btn-primary py-2" onClick={() => setOpen(!open)}>{open ? "Cancel" : "New role"}</button>
      </div>

      {open && (
        <form onSubmit={create} className="brand-card mt-6 space-y-4">
          <input required placeholder="Role title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
          <textarea rows={3} placeholder="What the role involves" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
          <div className="flex flex-wrap gap-4">
            <input type="number" min="1" step="0.5" value={form.hours_required} onChange={(e) => setForm({ ...form, hours_required: e.target.value })} className="w-32 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none" />
            <input placeholder='Timings e.g. "Thursday 9:00 am to 12:00 pm"' value={form.timings} onChange={(e) => setForm({ ...form, timings: e.target.value })} className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
          </div>
          <SkillChips options={volunteerSkills} selected={skills} onToggle={(s) => setSkills((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])} />
          <button type="submit" className="ba-btn-primary">Create role</button>
        </form>
      )}

      <div className="mt-8 divide-y divide-border">
        {roles.length === 0 && <p className="py-8 text-[15px] text-muted-foreground">No roles yet. Create the first one.</p>}
        {roles.map((r) => (
          <div key={r.id} className="flex flex-wrap items-start justify-between gap-4 py-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <h3 className="font-heading text-xl">{r.title}</h3>
                <StatusPill status={r.status} />
              </div>
              {r.description && <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{r.description}</p>}
              <p className="mt-2 text-sm text-muted-foreground">{r.timings} · {r.hours_required || 0}h per week</p>
              {!!(r.required_skills || []).length && (
                <div className="mt-3 flex flex-wrap gap-2">{r.required_skills.map((s) => <span key={s} className="ba-status-pill">{s}</span>)}</div>
              )}
            </div>
            <div className="flex gap-2">
              {r.status !== "open" && <button className="ba-btn-secondary py-2" onClick={() => setStatus(r, "open")}>Reopen</button>}
              {r.status === "open" && <button className="ba-btn-secondary py-2" onClick={() => setStatus(r, "filled")}>Mark filled</button>}
              {r.status !== "closed" && <button className="brand-btn-destructive" onClick={() => setStatus(r, "closed")}>Close</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}