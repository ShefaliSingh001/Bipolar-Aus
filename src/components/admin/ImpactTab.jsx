import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function ImpactTab() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const [vols, tasks, apps, contribs, creations] = await Promise.all([
        base44.entities.Volunteer.list(),
        base44.entities.VolunteerTask.list(),
        base44.entities.Application.list(),
        base44.entities.Contribution.list(),
        base44.entities.Creation.list(),
      ]);
      setStats({
        volunteers: vols.length,
        active: vols.filter((v) => v.status === "active").length,
        hours: Math.round((tasks.reduce((s, t) => s + (t.hours_logged || 0), 0) + contribs.reduce((s, c) => s + (c.hours || 0), 0)) * 10) / 10,
        accepted: apps.filter((a) => a.status === "accepted").length,
        creations: creations.length,
        weeklyCapacity: Math.round(vols.reduce((s, v) => s + (v.total_weekly_hours || 0), 0) * 10) / 10,
      });
    })();
  }, []);

  if (!stats) return <p className="text-muted-foreground">Loading activity…</p>;

  const items = [
    { figure: stats.volunteers, label: "volunteers registered" },
    { figure: stats.active, label: "active volunteers" },
    { figure: stats.hours, label: "hours contributed" },
    { figure: stats.accepted, label: "applications accepted" },
    { figure: stats.weeklyCapacity, label: "hours offered per week" },
    { figure: stats.creations, label: "community creations published" },
  ];

  return (
    <div>
      <h2 className="font-heading text-2xl">Volunteer activity</h2>
      <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <div key={i.label} className="brand-statcard">
            <p className="font-heading text-[42px] leading-none text-primary">{i.figure}</p>
            <p className="mt-3 text-sm text-muted-foreground">{i.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}