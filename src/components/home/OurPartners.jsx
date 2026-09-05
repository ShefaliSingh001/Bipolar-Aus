import React from "react";

const PARTNER_LOGOS = "https://media.base44.com/images/public/6a9c05381c3844400beebe23/805085ea9_image.png";

export default function OurPartners() {
  return (
    <section className="border-y border-border py-14">
      <div className="mx-auto mb-9 max-w-6xl px-6">
        <h2 className="font-heading text-2xl">Our partners</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Supporters, funders and community organisations who make this work possible.
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-6">
        <img
          src={PARTNER_LOGOS}
          alt="Logos of our partner organisations"
          className="w-full"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>
    </section>
  );
}