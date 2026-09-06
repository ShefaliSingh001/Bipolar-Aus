import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/brand/PageHeader";
import SkillChips from "@/components/apply/SkillChips";
import AvailabilityPicker from "@/components/apply/AvailabilityPicker";
import { volunteerSkills } from "@/lib/creativeSkills";
import { Link } from "react-router-dom";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import AccountStep from "@/components/apply/AccountStep";

const BASE_STEPS = ["About you", "Your skills", "Your availability"];

export default function Apply() {
  const [step, setStep] = useState(0);
  const [needsAccount, setNeedsAccount] = useState(false);
  const [form, setForm] = useState({ name: "", email_id: "", phone: "", preferred_area: "" });
  const [skills, setSkills] = useState([]);
  const [slots, setSlots] = useState([]);
  const [availability, setAvailability] = useState("flexible");
  const [submitting, setSubmitting] = useState(false);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => setNeedsAccount(!authed));
  }, []);

  const STEPS = needsAccount ? [...BASE_STEPS, "Create your account"] : BASE_STEPS;
  const lastStep = STEPS.length - 1;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSkill = (s) => setSkills((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

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
      status: "new"
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
      hours_required: best?.hours_required || totalHours
    });
    await base44.entities.VolunteerOnboarding.create({
      volunteer_id: volunteer.id,
      onboarding_status: "not_started",
      hours_worked: 0,
      certificate_granted: false
    });

    setMatches(result.matches || []);
    setSubmitting(false);
  };

  if (matches) {
    return (
      <div className="min-h-screen">
        <PageHeader
          eyebrow="Thank you"
          title="Thanks for applying!"
          description="Your details are with our volunteer team. We'll be in touch soon." />
        
      </div>);

  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <span className="text-sm text-muted-foreground">Volunteer registration</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16">
        
        <h1 className="font-heading text-[34px] leading-tight md:text-[44px]">{STEPS[step]}</h1>
        <div className="mb-14 mt-7 flex gap-4">
          {STEPS.map((s, i) =>
          <span key={s} className={`h-px flex-1 ${i <= step ? "bg-primary" : "bg-border"}`} />
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            
            {step === 0 &&
            <div className="space-y-6">
                {[
              { k: "name", label: "Full name *", type: "text", ph: "Your full name" },
              { k: "email_id", label: "Email *", type: "email", ph: "your@email.com" },
              { k: "phone", label: "Phone", type: "tel", ph: "+61 4xx xxx xxx" },
              { k: "preferred_area", label: "Preferred area or suburb", type: "text", ph: "e.g. Inner West, Sydney" }].
              map((f) =>
              <div key={f.k}>
                    <label className="mb-2 block text-sm font-medium text-foreground">{f.label}</label>
                    <input
                  type={f.type}
                  placeholder={f.ph}
                  value={form[f.k]}
                  onChange={(e) => set(f.k, e.target.value)}
                  className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
                
                  </div>
              )}
              </div>
            }

            {step === 1 &&
            <div className="space-y-6">
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  Pick everything that applies — we match on meaning, not exact wording.
                </p>
                <SkillChips options={volunteerSkills} selected={skills} onToggle={toggleSkill} />
              </div>
            }

            {step === 3 && needsAccount &&
            <AccountStep email={form.email_id.trim()} onVerified={submit} />
            }

            {step === 2 &&
            <div className="space-y-8">
                <AvailabilityPicker slots={slots} onChange={setSlots} />
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">In general, I'm best suited to</label>
                  <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="rounded-full border border-border bg-card px-5 py-2.5 text-sm outline-none focus:border-primary/50">
                  
                    {["weekdays", "weekends", "evenings", "flexible"].map((o) =>
                  <option key={o} value={o}>{o}</option>
                  )}
                  </select>
                </div>
              </div>
            }
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        <div className="mt-14 flex items-center justify-between border-t border-border pt-8">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="ba-btn-secondary">
            
            Back
          </button>
          {step < lastStep ?
          <button type="button" disabled={!canContinue} onClick={() => setStep(step + 1)} className="ba-btn-primary">
              Continue <ArrowRight className="h-4 w-4" />
            </button> :
          !needsAccount &&
          <button type="button" disabled={!canContinue || submitting} onClick={submit} className="ba-btn-primary">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Finding your match…" : "Submit application"}
            </button>
          }
        </div>
      </main>
    </div>);

}