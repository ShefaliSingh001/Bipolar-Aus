import React, { useState } from "react";
import PageHeader from "@/components/brand/PageHeader";
import RolesTab from "@/components/admin/RolesTab";
import ApplicationsTab from "@/components/admin/ApplicationsTab";
import TasksTab from "@/components/admin/TasksTab";
import ImpactTab from "@/components/admin/ImpactTab";

const TABS = [
  { key: "roles", label: "Roles" },
  { key: "applications", label: "Applications" },
  { key: "tasks", label: "Tasks" },
  { key: "impact", label: "Impact" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("roles");

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Coordinator"
        title="Volunteer operations"
        description="Open roles, incoming applications, task assignments and how much the community is contributing."
      />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap gap-6 border-b border-border pb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm transition-colors ${tab === t.key ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="pt-12">
          {tab === "roles" && <RolesTab />}
          {tab === "applications" && <ApplicationsTab />}
          {tab === "tasks" && <TasksTab />}
          {tab === "impact" && <ImpactTab />}
        </div>
      </main>
    </div>
  );
}