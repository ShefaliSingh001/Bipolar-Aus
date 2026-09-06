import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/brand/PageHeader";
import StatusPill from "@/components/brand/StatusPill";
import TaskCard from "@/components/portal/TaskCard";
import OnboardingChecklist from "@/components/portal/OnboardingChecklist";
import CertificateCard from "@/components/portal/CertificateCard";
import ApprovalNotice from "@/components/portal/ApprovalNotice";

export default function VolunteerPortal() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [volunteer, setVolunteer] = useState(null);
  const [application, setApplication] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState(null);

  const load = async () => {
    const me = await base44.auth.me();
    setUser(me);
    const vols = await base44.entities.Volunteer.filter({ email_id: me.email });
    const v = vols[0] || null;
    setVolunteer(v);
    if (v) {
      const [apps, onb, tsk] = await Promise.all([
        base44.entities.Application.filter({ volunteer_id: v.id }, "-created_date"),
        base44.entities.VolunteerOnboarding.filter({ volunteer_id: v.id }),
        base44.entities.VolunteerTask.filter({ volunteer_id: v.id }, "-created_date"),
      ]);
      setApplication(apps[0] || null);
      setOnboarding(onb[0] || null);
      setTasks(tsk);
      if (apps[0]?.role_id) {
        const roles = await base44.entities.JobRole.filter({ id: apps[0].role_id });
        setRole(roles[0] || null);
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateTask = async (task, patch) => {
    await base44.entities.VolunteerTask.update(task.id, patch);
    load();
  };

  const advanceOnboarding = async (next) => {
    if (!onboarding) return;
    await base44.entities.VolunteerOnboarding.update(onboarding.id, { onboarding_status: next });
    load();
  };

  const loggedHours = tasks.reduce((s, t) => s + (t.hours_logged || 0), 0);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading your portal…</div>;
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen">
        <PageHeader eyebrow="Volunteer portal" title="We can't find your volunteer profile yet." description={`We looked for a volunteer registered with ${user?.email}. Complete the short application and your portal will fill in.`} />
        <main className="mx-auto max-w-3xl px-6 py-14">
          <Link to="/apply" className="ba-btn-primary">Complete my application</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Volunteer portal"
        title={`Welcome back, ${volunteer.name.split(" ")[0]}.`}
        description={application?.role_title ? `Matched role: ${application.role_title}` : "Your coordinator is finalising your role match."}
        actions={<><StatusPill status={volunteer.status} />{application && <StatusPill status={application.status} />}</>}
      />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          <section>
            {application?.status === "accepted" && (
              <div className="mb-14">
                <ApprovalNotice application={application} volunteer={volunteer} role={role} />
              </div>
            )}
            <h2 className="font-heading text-2xl">Your tasks</h2>
            {tasks.length === 0 ? (
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                No tasks assigned yet. In the meantime, you can join a project in the{" "}
                <Link to="/studio" className="text-primary underline underline-offset-4">Studio</Link>.
              </p>
            ) : (
              <div className="mt-4">
                {tasks.map((t) => <TaskCard key={t.id} task={t} onUpdate={updateTask} />)}
              </div>
            )}
          </section>

          <aside className="space-y-14">
            <div>
              <h2 className="font-heading text-2xl">Onboarding</h2>
              <div className="mt-5">
                <OnboardingChecklist onboarding={onboarding} onAdvance={advanceOnboarding} />
              </div>
            </div>
            <div className="brand-statcard">
              <p className="font-heading text-[42px] leading-none text-primary">{Math.round(loggedHours * 10) / 10}</p>
              <p className="mt-3 text-sm text-muted-foreground">hours logged · {volunteer.total_weekly_hours || 0}h/week available</p>
            </div>
            {onboarding?.certificate_granted && (
              <CertificateCard volunteer={volunteer} hours={Math.round(loggedHours * 10) / 10} />
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}