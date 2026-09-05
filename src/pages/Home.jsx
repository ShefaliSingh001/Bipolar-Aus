import React from "react";
import HomeNav from "@/components/home/HomeNav";
import Hero from "@/components/home/Hero";
import ImpactEditorial from "@/components/home/ImpactEditorial";
import WhyBipolarAustralia from "@/components/home/WhyBipolarAustralia";
import OurPartners from "@/components/home/OurPartners";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <Hero />
      <ImpactEditorial />
      <WhyBipolarAustralia />
      <OurPartners />
      <FinalCTA />
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground">
          Bipolar Australia — Volunteer Connect. If you need urgent support, call Lifeline on 13 11 14.
        </div>
      </footer>
    </div>
  );
}