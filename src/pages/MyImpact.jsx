import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudioNav from "@/components/studio/StudioNav";
import PageHeader from "@/components/brand/PageHeader";

export default function MyImpact() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      const [contribs, projects] = await Promise.all([
        base44.entities.Contribution.filter({ contributor_email: me.email }, "-created_date"),
        base44.entities.ArtProject.list("-created_date", 200),
      ]);
      const mine = projects.filter(
        (p) => p.creator_email === me.email || (p.collaborators || []).some((c) => c.email === me.email)
      );
      setData({
        me,
        contribs,
        projects: mine,
        hours: Math.round(contribs.reduce((s, c) => s + (c.hours || 0), 0) * 10) / 10,
        skills: Array.from(new Set(contribs.map((c) => c.skill).filter(Boolean))),
        reach: mine.filter((p) => p.stage === "published").length,
      });
    })();
  }, []);

  if (!data) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading your impact…</div>;

  const stats = [
    { figure: data.hours, label: "hours contributed" },
    { figure: data.projects.length, label: "projects you're part of" },
    { figure: data.skills.length, label: "skills you've brought" },
    { figure: data.reach, label: "artworks published to Explore" },
  ];

  return (
    <div className="min-h-screen">
      <StudioNav />
      <PageHeader
        eyebrow="My impact"
        title="What you've made possible."
        description="Every hour and every skill you've brought into the Studio."
        backTo="/studio"
        backLabel="Back to Studio"
      />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="brand-statcard">
              <p className="font-heading text-[42px] leading-none text-primary">{s.figure}</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-20 grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl">Your contributions</h2>
            <div className="mt-4 divide-y divide-border">
              {data.contribs.length === 0 && (
                <p className="py-6 text-[15px] leading-relaxed text-muted-foreground">
                  Nothing logged yet — join a project and log what you bring.
                </p>
              )}
              {data.contribs.map((c) => (
                <div key={c.id} className="py-5">
                  <p className="text-[15px]">{c.description}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.project_title} · {c.skill} · {c.hours}h</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl">Projects you've touched</h2>
            <div className="mt-4 divide-y divide-border">
              {data.projects.length === 0 && (
                <p className="py-6 text-[15px] text-muted-foreground">
                  <Link to="/studio" className="text-primary underline underline-offset-4">Find a project</Link> to join.
                </p>
              )}
              {data.projects.map((p) => (
                <Link key={p.id} to={`/studio/${p.id}`} className="block py-5">
                  <p className="font-heading text-lg">{p.title}</p>
                  <p className="mt-1 text-sm capitalize text-muted-foreground">{p.stage}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}