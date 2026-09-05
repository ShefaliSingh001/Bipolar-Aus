import React from "react";

export default function SkillChips({ options, selected = [], onToggle }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((s) => {
        const on = selected.includes(s);
        return (
          <button
            key={s}
            type="button"
            onClick={() => onToggle(s)}
            className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}