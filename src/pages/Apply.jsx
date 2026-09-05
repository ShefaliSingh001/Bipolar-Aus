import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/brand/PageHeader";
import SkillChips from "@/components/apply/SkillChips";
import AvailabilityPicker from "@/components/apply/AvailabilityPicker";
import MatchResults from "@/components/apply/MatchResults";
import { volunteerSkills } from "@/lib/creativeSkills";
import { Loader2 } from "lucide-react";

const STEPS = ["About you", "Your skills", "Your availability"];

export default function Apply() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email_id: "", phone: "", preferred_area: "" });
  const [skills, setSkills] = useState([]);
  const [slots, setSlots] = useState([]);
  const [availability, setAvailability] = useState("flexible");
  const [submitting, setSubmitting] = useState(false);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSkill = (s) => setSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const canContinue =
    step === 0 ? form.name.trim() && form.email_id.trim() : step === 1 ? skills.length > 0 : slots.length > 0;

  const submit = async () => {
    setSubmitting(true);
    setError("");
    const totalHours = Math.round(slots.reduce((s, x) => s + (x.hours || 0), 0) * 10) / 10;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Sydney";
    const payload = {
      ...form,
      skills,
      availability,
      availability_slots: slots,
      available_days: slots.map((s) => s.day),
      available_time: slots.map((s) => `${s.day} ${s.start_time}–${s.end_time}`).join(", "),
      total_weekly_hours: totalHours,
      timezone,
      available_from: slots[0]?.start_time,
      available_to: slots[0]?.end_time,
      registered_at: new Date().toISOString(),
      status: "new",
    };

    let result = { matches: [] };
    try {
      const res = await base44.functions.invoke("semanticMatchRoles", { volunteer: payload });
      result = res.data || { matches: [] };
    } catch (e) {
      result = { matches: [] };
    }

    const volunteer = await base44.entities.Volunteer.create(payload);
    const best = (result.matches || [])[0];
    await base44.entities.Application.create({
      volunteer_id: volunteer.id,
      volunteer_name: volunteer.name,
      volunteer_email: volunteer.email_id,
      volunteer_phone: volunteer.phone,
      role_id: best?.role_id,
      role_title: best?.role_title,
      matched_skills: best?.matched_skills || skills,
      status: "applied",
      preferred_area: form.preferred_area,
      applied_date: new Date().toISOString(),
      hours_required: best?.hours_required || totalHours,
    });
    await base44.entities.VolunteerOnboarding.create({
      volunteer_id: volunteer.id,
      onboarding_status: "not_started",
      hours_worked: 0,
      certificate_granted: false,
    });

    setMatches(result.matches || []);
    setSubmitting(false);
  };

  if (matches) {
    return (
      <div className="min-h-screen">
        <PageHeader
          eyebrow="Thank you"
          title="You're in. Here's where you fit."
          description={`Thanks ${form.name.split(" ")[0]} — your details are with our volunteer team. These are the roles that matched your skills and the hours you gave us.`}
        />
        <main className="mx-auto max-w-4xl px-6 py-14">
          <MatchResults matches={matches} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Volunteer with us"
        title="Three short steps."
        description="Tell us who you are, what you're good at, and when you're actually free. We'll do the matching."
      />
      <main className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-12 flex items-center gap-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span className={`text-sm ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
              {i < STEPS.length - 1 && <span className="h-px w-8 bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && (
              <div className="space-y-6">
                {[
                  { k: "name", label: "Full name", type: "text" },
                  { k: "email_id", label: "Email", type: "email" },
                  { k: "phone", label: "Phone (optional)", type: "tel" },
                  { k: "preferred_area", label: "Preferred area or suburb (optional)", type: "text" },
                ].map((f) => (
                  <div key={f.k}>
                    <label className="mb-2 block text-sm text-muted-foreground">{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.k]}
                      onChange={(e) => set(f.k, e.target.value)}
                      className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50"
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Pick everything that applies — we match on meaning, not exact wording.
                </p>
                <SkillChips options={volunteerSkills} selected={skills} onToggle={toggleSkill} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <AvailabilityPicker slots={slots} onChange={setSlots} />
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">In general, I'm best suited to</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="rounded-full border border-border bg-card px-5 py-2.5 text-sm outline-none focus:border-primary/50"
                  >
                    {["weekdays", "weekends", "evenings", "flexible"].map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        <div className="mt-12 flex items-center gap-4">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="ba-btn-secondary">Back</button>
          )}
          {step < 2 ? (
            <button type="button" disabled={!canContinue} onClick={() => setStep(step + 1)} className="ba-btn-primary">
              Continue
            </button>
          ) : (
            <button type="button" disabled={!canContinue || submitting} onClick={submit} className="ba-btn-primary">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Finding your match…" : "Submit application"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}