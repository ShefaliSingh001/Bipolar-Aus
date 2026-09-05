import React from "react";
import { motion } from "framer-motion";
import { SYDNEY_MAP_URL } from "@/lib/landmarks";
import { Image } from "@/components/ui/image";

export default function SydneyMap({ landmarks, selectedId, hoveredId, setHoveredId, onSelect }) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-muted/30">
      <Image
        src={SYDNEY_MAP_URL}
        alt="Illustrated isometric map of Sydney"
        className="h-[300px] w-full sm:h-[420px] md:h-[560px]"
        fittingType="fill"
      />
      <div className="absolute inset-0">
        {landmarks.map((l) => {
          const active = selectedId === l.id;
          const hot = hoveredId === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onSelect(l.id)}
              onMouseEnter={() => setHoveredId(l.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
              aria-label={l.name}
            >
              <motion.span
                animate={{ scale: active ? 1.35 : hot ? 1.15 : 1 }}
                transition={{ duration: 0.25 }}
                className={`block h-3.5 w-3.5 rounded-full border-2 border-background ${active ? "bg-primary" : "bg-accent"}`}
              />
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] transition-opacity duration-200 ${
                  active || hot ? "bg-primary text-primary-foreground opacity-100" : "bg-background/85 text-foreground opacity-70"
                }`}
              >
                {l.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}