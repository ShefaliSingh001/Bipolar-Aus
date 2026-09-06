import React from "react";
import CountUpFigure from "@/components/brand/CountUpFigure";
import Reveal from "@/components/brand/Reveal";

const facts = [
  { figure: "568,000", note: "Australians live with bipolar disorder — about 1 in 50 people." },
  { figure: "13 years", note: "is how long people wait, on average, before a correct diagnosis." },
  { figure: "1–2 hours", note: "a fortnight is genuinely enough to change someone's week." },
];

export default function ImpactEditorial() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="font-heading text-3xl leading-tight md:text-[40px]">Why your contribution matters</h2>
        <div className="mt-10">
          {facts.map((f) => (
            <div key={f.figure} className="grid items-center gap-3 py-9 md:grid-cols-[0.4fr_1fr] md:gap-10">
              <CountUpFigure value={f.figure} className="font-heading text-[40px] leading-none text-primary md:text-[52px]" />
              <p className="max-w-lg text-[15px] leading-relaxed text-muted-foreground">{f.note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}