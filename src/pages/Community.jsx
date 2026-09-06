import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const places = [
  { title: "Connect", note: "Meet people who understand the challenges and strengths of living with bipolar disorder." },
  { title: "Share", note: "Make space for lived experience, practical ideas and hopeful conversations." },
  { title: "Contribute", note: "Volunteer your time and skills to help build a stronger, more supportive community." },
];

export default function Community() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-6 px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <Link to="/apply" className="ba-btn-primary px-5 py-2.5">
            Volunteer with us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="py-20">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-secondary">Bipolar Australia</p>
          <h1 className="max-w-2xl font-heading text-[38px] leading-[1.08] md:text-[52px]">
            A community built on understanding
          </h1>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
            We believe connection, shared experience and meaningful contribution help people feel supported
            and hopeful.
          </p>
          <Link to="/explore" className="ba-btn-primary mt-8">Explore the community</Link>
        </section>

        <section className="pb-20">
          <div className="overflow-hidden rounded-[18px]">
            <Image
              src="https://media.base44.com/images/public/6a9c05381c3844400beebe23/03e04c929_generated_image.png"
              alt="Community members and volunteers together"
              className="h-[280px] w-full md:h-[400px]"
              fittingType="fill"
              focalPointY={0.4}
            />
          </div>
        </section>

        <section className="pb-20">
          <h2 className="font-heading text-3xl leading-tight md:text-[40px]">Find your place</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {places.map((p, i) => (
              <div
                key={p.title}
                className="h-full rounded-[var(--radius)] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="text-xs text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-2 font-heading text-2xl">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p.note}</p>
              </div>
            ))}
          </div>
          <Link to="/apply" className="ba-btn-primary mt-10">
            Join as a volunteer <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}