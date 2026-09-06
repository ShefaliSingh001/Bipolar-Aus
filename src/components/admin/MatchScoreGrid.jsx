import React from "react";

const FIELDS = [
  ["Skills match", "skills_score"],
  ["Semantic resume match", "semantic_score"],
  ["Experience match", "experience_score"],
  ["Availability match", "availability_score"],
  ["Location match", "location_score"],
  ["Interests / domain match", "interests_score"],
  ["Qualifications match", "qualifications_score"],
];

export default function MatchScoreGrid({ match }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FIELDS.map(([label, key]) => (
        <div key={key}>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-[15px]">{Math.round(match[key] || 0)}%</dd>
        </div>
      ))}
    </dl>
  );
}