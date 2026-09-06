import React from "react";
import { MailCheck } from "lucide-react";

export default function ApprovalNotice({ application, volunteer, role }) {
  const slots = (volunteer?.availability_slots || [])
    .map((s) => `${s.day || ""} ${s.start_time || ""}–${s.end_time || ""}`.trim())
    .filter(Boolean);

  const details = [
    ["Role", application.role_title || role?.title || "—"],
    ["Shift timings", role?.timings || volunteer?.available_time || "To be confirmed with your coordinator"],
    ["Hours per week", application.hours_required || role?.hours_required || "—"],
    ["Your availability", slots.length ? slots.join(", ") : volunteer?.availability || "—"],
    ["Preferred area", application.preferred_area || "—"],
  ];

  return (
    <section className="brand-card">
      <div className="flex items-center gap-2 text-primary">
        <MailCheck className="h-4 w-4" />
        <p className="text-xs uppercase tracking-[0.14em]">Approval notice — also sent to your email</p>
      </div>
      <h2 className="mt-4 font-heading text-2xl">
        Your volunteer shift is approved — {application.role_title || role?.title || "Bipolar Australia"}
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        Hi {application.volunteer_name || volunteer?.name || "there"}, great news — your application to volunteer with
        Bipolar Australia has been approved for the role of{" "}
        {application.role_title || role?.title || "volunteer"}.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-[15px]">{value}</dd>
          </div>
        ))}
      </dl>

      {role?.description && (
        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
          <span className="text-foreground">About the role: </span>{role.description}
        </p>
      )}

      <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
        Please reply to the approval email to confirm your first shift. We look forward to working with you.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        Warm regards,<br />Bipolar Australia Volunteer Team
      </p>
    </section>
  );
}