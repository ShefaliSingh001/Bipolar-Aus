import React from "react";
import PartnerMarquee from "@/components/home/PartnerMarquee";

export default function OurPartners() {
  return (
    <section className="border-y border-border py-14">
      <div className="mx-auto mb-9 max-w-6xl px-6">
        <h2 className="font-heading text-2xl">Our partners</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Supporters, funders and community organisations who make this work possible.
        </p>
      </div>
      <PartnerMarquee />
    </section>
  );
}