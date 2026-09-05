import React from "react";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 text-center">
      <h2 className="mx-auto max-w-2xl font-heading text-3xl leading-tight md:text-[46px]">
        Someone is waiting for the hours you already have.
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        Tell us when you're free. We'll bring the role, the team and the work.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/apply" className="ba-btn-primary">Volunteer Now</Link>
        <Link to="/community" className="ba-btn-secondary">See our community</Link>
      </div>
    </section>
  );
}