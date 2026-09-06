import React from "react";
import CountUpFigure from "@/components/brand/CountUpFigure";

const achievements = [
  {
    figure: "30 years",
    sub: "Ryde Bipolar Support Group",
    note: "Australia's longest-running bipolar peer support group — kept going, month after month, by volunteer facilitators.",
  },
  {
    figure: "3",
    sub: "recurring online support groups",
    note: "Regular online groups so people can connect from anywhere in the country, not only where a room happens to be available.",
  },
  {
    figure: "$3,000",
    sub: "raised by one community fundraiser",
    note: "A volunteer-led fundraiser for World Bipolar Day awareness — organised, promoted and run by volunteers.",
  },
];

const columns = [
  {
    title: "Resources created with volunteer support",
    note: "Plain-language bipolar information, recovery resources and carer education — written, reviewed and kept current with volunteer help.",
  },
  {
    title: "Digital access built by volunteers",
    note: "Volunteers established Bipolar Australia's website and online presence, and continue to maintain it so information stays reachable.",
  },
  {
    title: "Awareness & advocacy",
    note: "Volunteers contribute to World Bipolar Day, community education, research participation and public advocacy work.",
  },
];

export default function VolunteerImpact() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Our volunteers' impact</p>
        <h2 className="max-w-xl font-heading text-3xl leading-tight md:text-[40px]">
          What volunteers have actually achieved
        </h2>

        <div className="mt-14">
          {achievements.map((a) => (
            <div key={a.figure} className="grid gap-3 py-9 md:grid-cols-[0.45fr_1fr] md:gap-10">
              <div>
                <CountUpFigure value={a.figure} className="font-heading text-[38px] leading-none text-primary md:text-[46px]" />
                <p className="mt-2 text-sm text-muted-foreground">{a.sub}</p>
              </div>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">{a.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {columns.map((c) => (
            <div
              key={c.title}
              className="rounded-[var(--radius)] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <h3 className="font-heading text-xl leading-snug">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}