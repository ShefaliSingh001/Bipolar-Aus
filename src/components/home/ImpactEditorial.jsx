import React from "react";

const outcomes = [
  { figure: "1 in 50", label: "Australians live with bipolar disorder", note: "Around half a million people, and the families beside them." },
  { figure: "16 yrs", label: "Supporting people since 2009", note: "Peer support groups, education and advocacy across the country." },
  { figure: "40+", label: "Peer support groups nationally", note: "Facilitated by trained volunteers with lived experience." },
  { figure: "9 in 10", label: "Attendees feel less alone", note: "Reported after their first peer support session." },
];

export default function ImpactEditorial() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Why it matters</p>
          <h2 className="font-heading text-3xl leading-tight md:text-[40px]">
            The work is quiet, steady and it changes lives.
          </h2>
        </div>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o) => (
            <div key={o.label} className="brand-statcard">
              <p className="font-heading text-[42px] leading-none text-primary">{o.figure}</p>
              <p className="mt-4 text-[15px] leading-snug text-foreground">{o.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}