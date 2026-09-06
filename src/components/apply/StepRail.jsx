import React from "react";
import { Check } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

export default function StepRail({ steps, current }) {
  return (
    <aside className="rounded-[18px] bg-muted/50 p-8 md:p-9">
      <BrandLogo />
      <h2 className="mt-8 font-heading text-2xl">Volunteer sign up</h2>

      <ol className="mt-8 space-y-1">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s}>
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    done || active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className={`text-[15px] ${active || done ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span className={`ml-4 block h-8 w-px ${done ? "bg-primary" : "bg-border"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}