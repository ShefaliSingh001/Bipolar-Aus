import React from "react";
import Reveal from "@/components/brand/Reveal";

const pillars = [
  { title: "Community support", note: "Peer-led groups and one-to-one connection for people living with bipolar and the families around them." },
  { title: "Education", note: "Plain-language information and training for volunteers, carers and workplaces." },
  { title: "Lived experience", note: "Nothing we do is designed without the people who live it. Your story is expertise here." },
  { title: "Collaboration", note: "We work alongside clinicians, services and researchers to improve the care people actually receive." },
];

export default function WhyBipolarAustralia() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <h2 className="font-heading text-3xl leading-tight md:text-[44px]">Why Bipolar Australia</h2>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
          We are Australia's national peak not-for-profit organisation for bipolar disorder — independent,
          lived-experience led, and trusted by the people and services we work with.
        </p>

        <div className="mt-12 border-t border-border">
          {pillars.map((p) => (
            <div key={p.title} className="grid gap-2 border-b border-border py-7 md:grid-cols-[0.35fr_1fr] md:gap-10">
              <h3 className="font-body text-[15px] font-medium text-foreground">{p.title}</h3>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}