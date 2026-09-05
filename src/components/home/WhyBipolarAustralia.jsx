import React from "react";
import { Link } from "react-router-dom";

export default function WhyBipolarAustralia() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">About us</p>
          <h2 className="font-heading text-3xl leading-tight md:text-[40px]">
            Built by people with lived experience.
          </h2>
        </div>
        <div className="space-y-6 text-[16px] leading-relaxed text-muted-foreground">
          <p>
            Bipolar Australia exists because recovery happens in company. Our groups are run by people
            who have been through it, alongside volunteers who simply decided to show up.
          </p>
          <p>
            Volunteer Connect is how we organise that: you tell us the hours you actually have and what
            you're good at, and we match you to the role where it will land hardest. No forms in triplicate.
          </p>
          <p className="text-foreground">
            And because making things together is its own kind of medicine, every volunteer can join the{" "}
            <Link to="/studio" className="text-primary underline decoration-primary/30 underline-offset-4">
              collaborative Studio
            </Link>{" "}
            — co-creating artworks with community members and publishing them onto our{" "}
            <Link to="/explore" className="text-primary underline decoration-primary/30 underline-offset-4">
              illustrated map of Sydney
            </Link>.
          </p>
        </div>
      </div>
    </section>
  );
}