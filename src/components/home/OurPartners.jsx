import React from "react";

import PartnerMarquee from "@/components/home/PartnerMarquee";
import Reveal from "@/components/brand/Reveal";

export default function OurPartners() {
  return (
    <section className="py-14">
      <Reveal className="mx-auto mb-9 max-w-6xl px-6">
        <h2 className="font-heading text-2xl">Our partners</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Supporters, funders and community organisations who make this work possible.
        </p>
      </Reveal>
      <PartnerMarquee />
    </section>
  );
}