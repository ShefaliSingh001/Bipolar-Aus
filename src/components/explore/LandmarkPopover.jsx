import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Image } from "@/components/ui/image";
import StatusPill from "@/components/brand/StatusPill";

export default function LandmarkPopover({ landmark, creations, onClose }) {
  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-40 flex max-h-[calc(100%-2rem)] w-[300px] flex-col overflow-hidden rounded-[16px] border border-border bg-card shadow-xl">
      <div className="flex items-start justify-between gap-3 px-6 pt-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Landmark</p>
          <h3 className="mt-1 font-heading text-2xl leading-tight">{landmark.name}</h3>
          {landmark.blurb && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{landmark.blurb}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="mt-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 overflow-y-auto px-6 pb-6">
        {!creations.length ? (
          <p className="border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
            No creations here yet — be the first to add one to this place.
          </p>
        ) : (
          creations.map((c) => (
            <article key={c.id} className="border-t border-border py-5">
              {c.image_url && (
                <div className="mb-5 h-40 w-full overflow-hidden rounded-[var(--radius)] bg-white">
                  <Image src={c.image_url} alt={c.title} className="h-40 w-full" fittingType="fit" />
                </div>
              )}
              <h4 className="font-heading text-xl leading-tight">{c.title}</h4>
              {c.creator_name && (
                <p className="mt-1 text-sm text-muted-foreground">by {c.creator_name}</p>
              )}
              {c.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StatusPill tone="quiet">{c.type}</StatusPill>
                {c.project_id && (
                  <Link to={`/studio/${c.project_id}`} className="text-sm text-primary underline underline-offset-4">
                    See how it was made
                  </Link>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}