import React from "react";
import { X } from "lucide-react";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

function hoursBetween(start, end) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = eh * 60 + em - (sh * 60 + sm);
  return diff > 0 ? Math.round((diff / 60) * 10) / 10 : 0;
}

export default function AvailabilityPicker({ slots = [], onChange }) {
  const activeDays = slots.map((s) => s.day);

  const toggleDay = (day) => {
    if (activeDays.includes(day)) {
      onChange(slots.filter((s) => s.day !== day));
    } else {
      onChange([...slots, { day, start_time: "09:00", end_time: "12:00", hours: 3 }]);
    }
  };

  const update = (day, field, value) => {
    onChange(
      slots.map((s) => {
        if (s.day !== day) return s;
        const next = { ...s, [field]: value };
        next.hours = hoursBetween(next.start_time, next.end_time);
        return next;
      })
    );
  };

  const total = slots.reduce((sum, s) => sum + (s.hours || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Which days work for you?</p>
        <div className="flex flex-wrap gap-2.5">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`rounded-full border px-4 py-2 text-sm capitalize transition-all duration-200 ${
                activeDays.includes(d)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {slots.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Set your exact times</p>
          {slots.map((s) => (
            <div key={s.day} className="flex flex-wrap items-center gap-3 border-b border-border pb-3">
              <span className="w-24 text-sm capitalize">{s.day}</span>
              <input
                type="time"
                value={s.start_time}
                onChange={(e) => update(s.day, "start_time", e.target.value)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-primary/50"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <input
                type="time"
                value={s.end_time}
                onChange={(e) => update(s.day, "end_time", e.target.value)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-primary/50"
              />
              <span className="text-sm text-primary">{s.hours || 0}h</span>
              <button type="button" onClick={() => toggleDay(s.day)} className="ml-auto text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <p className="pt-2 text-sm text-foreground">
            Total <span className="text-primary">{Math.round(total * 10) / 10} hours</span> per week
          </p>
        </div>
      )}
    </div>
  );
}