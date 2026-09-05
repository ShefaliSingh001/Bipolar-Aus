import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/brand/PageHeader";
import { Image } from "@/components/ui/image";

const ways = [
  { title: "Peer support groups", note: "Small, regular, facilitated by people with lived experience. In person and online." },
  { title: "The collaborative Studio", note: "Co-create artworks with community members, then publish them onto our map of Sydney." },
  { title: "Community exhibitions", note: "Open studio days and shows at Darling Harbour and beyond." },
  { title: "Family & carer sessions", note: "For the people standing beside someone living with bipolar disorder." },
  { title: "Education & advocacy", note: "Workshops for workplaces, schools and health services." },
];

export default function Community() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Our community"
        title="Recovery happens in company."
        description="Bipolar Australia is a community of people living with bipolar disorder, their families, and volunteers who decided to show up. Everything we do starts with that."
      />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-[var(--radius)]">
          <Image
            src="https://media.base44.com/images/public/6a9c05381c3844400beebe23/03e04c929_generated_image.png"
            alt="Community members and volunteers together"
            className="h-[300px] w-full md:h-[420px]"
            fittingType="fill"
            focalPointY={0.4}
          />
        </div>

        <section className="mt-20 grid gap-14 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Ways to connect</p>
            <h2 className="font-heading text-3xl leading-tight">Find the door that suits you.</h2>
          </div>
          <div className="divide-y divide-border">
            {ways.map((w) => (
              <div key={w.title} className="py-6">
                <h3 className="font-heading text-xl">{w.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 border-t border-border pt-16">
          <h2 className="max-w-xl font-heading text-3xl leading-tight md:text-[40px]">
            The community runs on volunteers. Become one.
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/apply" className="ba-btn-primary">Volunteer Now</Link>
            <Link to="/explore" className="ba-btn-secondary">Explore the map</Link>
          </div>
        </section>
      </main>
    </div>
  );
}