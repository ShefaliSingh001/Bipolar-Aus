import React from "react";
import Hero from "@/components/home/Hero";
import ImpactEditorial from "@/components/home/ImpactEditorial";
import WhyBipolarAustralia from "@/components/home/WhyBipolarAustralia";
import VolunteerImpact from "@/components/home/VolunteerImpact";
import OurPartners from "@/components/home/OurPartners";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ImpactEditorial />
      <WhyBipolarAustralia />
      <VolunteerImpact />
      <OurPartners />
      <FinalCTA />
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground">
          <p>Recovery is possible · Hope is real · Support is available · You are not alone</p>
          <p className="mt-2">If you need urgent support, call Lifeline on 13 11 14.</p>
        </div>
      </footer>
    </div>
  );
}