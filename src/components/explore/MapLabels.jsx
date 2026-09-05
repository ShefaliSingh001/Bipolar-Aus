import React from "react";

export default function MapLabels({ landmarks, selectedId, hoveredId, labelRefs, onSelect }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {landmarks.map((l) => {
        const active = selectedId === l.id;
        const hot = hoveredId === l.id;
        return (
          <button
            key={l.id}
            type="button"
            ref={(el) => { labelRefs.current[l.id] = el; }}
            onClick={() => onSelect(l.id)}
            className={`pointer-events-auto absolute left-0 top-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] shadow-sm transition-colors duration-200 ${
              active || hot
                ? "bg-primary text-primary-foreground"
                : "bg-background/85 text-foreground"
            }`}
          >
            {l.name}
          </button>
        );
      })}
    </div>
  );
}