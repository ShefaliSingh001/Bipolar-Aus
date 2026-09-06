import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/brand/Reveal";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <h2 className="font-heading text-3xl leading-tight md:text-[46px]">Come and be part of it.</h2>
      </Reveal>
      <Reveal delay={0.18}>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          Tell us a little about your skills, interests and availability. We'll match you with the work where
          you'll matter most — and we'll be with you the whole way.
        </p>
      </Reveal>
      <Reveal delay={0.36}>
        <Link to="/apply" className="ba-btn-primary mt-9">
          Volunteer Now <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}