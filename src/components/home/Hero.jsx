import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-14 md:pt-24">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bipolar Australia · Volunteer Connect
          </p>
          <h1 className="font-heading text-[38px] leading-[1.08] md:text-[58px]">
            Give a few hours.
            <br />
            Help someone{" "}
            <em className="italic text-primary">find their way back.</em>
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted-foreground">
            We match your skills and your real availability to work that matters — peer support,
            community art, events and everything in between. Then we make things together.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/apply" className="ba-btn-primary">Start volunteering</Link>
            <span className="text-sm text-muted-foreground">Takes about 5 minutes</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[var(--radius)]"
        >
          <Image
            src="https://media.base44.com/images/public/6a9c05381c3844400beebe23/03e04c929_generated_image.png"
            alt="Volunteers and community members making art together"
            className="h-[380px] w-full md:h-[520px]"
            fittingType="fill"
            focalPointX={0.5}
            focalPointY={0.4}
          />
        </motion.div>
      </div>
    </section>
  );
}