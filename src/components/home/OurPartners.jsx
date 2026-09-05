import React from "react";

const partners = [
  "Black Dog Institute",
  "Beyond Blue",
  "SANE Australia",
  "Lifeline",
  "Mental Health Australia",
  "NSW Health",
  "Head to Health",
  "Sydney Community Foundation",
];

function Wordmark({ name }) {
  return (
    <span
      className="whitespace-nowrap font-heading text-[22px] text-muted-foreground/80"
      style={{ mixBlendMode: "multiply" }}
    >
      {name}
    </span>
  );
}

export default function OurPartners() {
  return (
    <section className="border-y border-border py-16">
      <p className="mx-auto mb-10 max-w-6xl px-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Our partners
      </p>
      <div className="ba-marquee">
        <div className="ba-marquee-track">
          {[...partners, ...partners].map((p, i) => (
            <Wordmark key={p + i} name={p} />
          ))}
        </div>
      </div>
    </section>
  );
}