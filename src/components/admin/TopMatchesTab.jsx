import React, { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import VolunteerTopMatches from "@/components/admin/VolunteerTopMatches";

export default function TopMatchesTab() {
  const [volunteers, setVolunteers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [v, m] = await Promise.all([
      base44.entities.Volunteer.list("-created_date"),
      base44.entities.VolunteerJobMatch.list("-created_date", 500),
    ]);
    setVolunteers(v);
    setMatches(m);
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin_session");
      if (raw) setAdmin(JSON.parse(raw));
    } catch (_e) {
      setAdmin(null);
    }
    load();
  }, [load]);

  if (loading) return <p className="text-[15px] text-muted-foreground">Loading volunteers…</p>;

  return (
    <div>
      <h2 className="font-heading text-2xl">Top matches</h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        The system ranks every open role against each volunteer's resume and profile, and shows only the three
        highest-scoring roles. You decide which one to approve.
      </p>
      <div className="mt-4 divide-y divide-border">
        {volunteers.length === 0 && <p className="py-8 text-[15px] text-muted-foreground">No volunteers yet.</p>}
        {volunteers.map((v) => (
          <VolunteerTopMatches
            key={v.id}
            volunteer={v}
            matches={matches.filter((m) => m.volunteer_id === v.id && m.recommendation_status !== "archived")}
            adminName={admin?.name || admin?.email || "Administrator"}
            onChanged={load}
          />
        ))}
      </div>
    </div>
  );
}