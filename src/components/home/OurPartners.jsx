import React from "react";

const partners = [
  "Ross Hutchison Foundation",
  "Ryde Eastwood Leagues",
  "Star Discount Chemist",
  "The Athlete's Foot",
  "Thrive Broking",
  "Verve",
  "Woolworths",
  "Ashdale & Co",
  "An Odd Grey Creative",
  "Department of Health",
];

export default function OurPartners() {
  return (
    <section className="border-y border-border py-14">
      <div className="mx-auto mb-9 max-w-6xl px-6">
        <h2 className="font-heading text-2xl">Our partners</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Supporters, funders and community organisations who make this work possible.
        </p>
      </div>
      <div className="ba-marquee">
        <div className="ba-marquee-track">
          {[...partners, ...partners].map((p, i) => (
            <span
              key={p + i}
              className="whitespace-nowrap font-heading text-[20px] text-muted-foreground/75"
              style={{ mixBlendMode: "multiply" }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}