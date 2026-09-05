import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import StatusPill from "@/components/brand/StatusPill";

export default function CreationList({ creations }) {
  if (!creations.length) {
    return (
      <p className="py-8 text-[15px] leading-relaxed text-muted-foreground">
        No creations here yet — be the first to add one to this place.
      </p>
    );
  }
  return (
    <div className="divide-y divide-border">
      {creations.map((c) => (
        <article key={c.id} className="flex gap-5 py-6">
          {c.type === "artwork" && c.image_url ? (
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius)]">
              <Image src={c.image_url} alt={c.title} className="h-24 w-24" fittingType="fill" />
            </div>
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[var(--radius)] bg-muted font-heading text-2xl text-primary">
              {c.title.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-heading text-xl">{c.title}</h3>
              <StatusPill tone="quiet">{c.type}</StatusPill>
            </div>
            {c.creator_name && <p className="mt-1 text-sm text-muted-foreground">by {c.creator_name}</p>}
            {c.description && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{c.description}</p>}
            {c.project_id && (
              <Link to={`/studio/${c.project_id}`} className="mt-2 inline-block text-sm text-primary underline underline-offset-4">
                See how it was made
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}