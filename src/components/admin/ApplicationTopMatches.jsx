import React, { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import VolunteerTopMatches from "@/components/admin/VolunteerTopMatches";

export default function ApplicationTopMatches({ volunteerId }) {
  const [volunteer, setVolunteer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [v, m] = await Promise.all([
      base44.entities.Volunteer.get(volunteerId),
      base44.entities.VolunteerJobMatch.filter({ volunteer_id: volunteerId }, "-created_date"),
    ]);
    setVolunteer(v);
    setMatches(m);
    setLoading(false);
  }, [volunteerId]);

  useEffect(() => {
    base44.auth.me().then(setAdmin).catch(() => {});
    load();
  }, [load]);

  if (loading) return <p className="mt-6 text-sm text-muted-foreground">Loading recommendations…</p>;
  if (!volunteer) return <p className="mt-6 text-sm text-muted-foreground">Volunteer record not found.</p>;

  return (
    <div className="mt-8 border-t border-border">
      <VolunteerTopMatches
        volunteer={volunteer}
        matches={matches}
        adminName={admin?.full_name || admin?.email || "Administrator"}
        onChanged={load}
      />
    </div>
  );
}