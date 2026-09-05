import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import StatusPill from "@/components/brand/StatusPill";

export default function TasksTab() {
  const [volunteers, setVolunteers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ volunteer_id: "", title: "", description: "", space_url: "" });

  const load = async () => {
    const [v, t] = await Promise.all([
      base44.entities.Volunteer.list("-created_date"),
      base44.entities.VolunteerTask.list("-created_date"),
    ]);
    setVolunteers(v);
    setTasks(t);
  };
  useEffect(() => { load(); }, []);

  const assign = async (e) => {
    e.preventDefault();
    const v = volunteers.find((x) => x.id === form.volunteer_id);
    await base44.entities.VolunteerTask.create({ ...form, volunteer_email: v?.email_id, status: "assigned", hours_logged: 0 });
    setForm({ volunteer_id: "", title: "", description: "", space_url: "" });
    load();
  };

  const nameFor = (id) => volunteers.find((v) => v.id === id)?.name || "Volunteer";

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={assign} className="brand-card space-y-4">
        <h2 className="font-heading text-2xl">Assign a task</h2>
        <select required value={form.volunteer_id} onChange={(e) => setForm({ ...form, volunteer_id: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50">
          <option value="">Choose a volunteer</option>
          {volunteers.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <input required placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
        <textarea rows={3} placeholder="What needs doing" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
        <input placeholder="Shared space link (optional)" value={form.space_url} onChange={(e) => setForm({ ...form, space_url: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
        <button type="submit" className="ba-btn-primary w-full">Assign task</button>
      </form>

      <div>
        <h2 className="font-heading text-2xl">Assigned tasks</h2>
        <div className="mt-4 divide-y divide-border">
          {tasks.length === 0 && <p className="py-8 text-[15px] text-muted-foreground">No tasks assigned yet.</p>}
          {tasks.map((t) => (
            <div key={t.id} className="flex flex-wrap items-start justify-between gap-3 py-5">
              <div>
                <h3 className="font-heading text-lg">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{nameFor(t.volunteer_id)} · {t.hours_logged || 0}h logged</p>
              </div>
              <StatusPill status={t.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}