import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PageHeader({ eyebrow, title, description, actions, backTo = "/", backLabel = "Back to home" }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-10 md:pt-14">
        <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> {backLabel}
        </Link>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
            )}
            <h1 className="font-heading text-3xl leading-tight md:text-[44px]">{title}</h1>
            {description && (
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      </div>
    </header>
  );
}