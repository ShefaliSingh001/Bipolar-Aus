import React from "react";
import { Check } from "lucide-react";

const STEPS = [
  { key: "not_started", label: "Application received", note: "We have your details and your availability." },
  { key: "in_progress", label: "Induction & training", note: "Meet your coordinator and complete your induction." },
  { key: "completed", label: "Ready to volunteer", note: "You're matched and active on projects." },
];

export default function OnboardingChecklist({ onboarding, onAdvance }) {
  const status = onboarding?.onboarding_status || "not_started";
  const index = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="space-y-5">
      {STEPS.map((s, i) => {
        const done = i <= index;
        return (
          <div key={s.key} className="flex gap-4 border-b border-border pb-5">
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
              {done ? <Check className="h-3.5 w-3.5" /> : <span className="text-xs">{i + 1}</span>}
            </span>
            <div>
              <p className={done ? "text-foreground" : "text-muted-foreground"}>{s.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
            </div>
          </div>
        );
      })}
      {status !== "completed" && (
        <button className="ba-btn-primary" onClick={() => onAdvance(status === "not_started" ? "in_progress" : "completed")}>
          {status === "not_started" ? "Start my induction" : "I've finished my induction"}
        </button>
      )}
    </div>
  );
}