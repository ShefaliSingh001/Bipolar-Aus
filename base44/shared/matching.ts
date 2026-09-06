// Shared helpers for volunteer/role matching.
export function norm(s) {
  return String(s || '').toLowerCase().trim();
}

// Fraction of `required` items that have a loose textual match in `available`.
export function overlap(required, available) {
  const A = (required || []).map(norm).filter(Boolean);
  const B = (available || []).map(norm).filter(Boolean);
  if (!A.length) return 0;
  const hit = A.filter((x) => B.some((y) => y.includes(x) || x.includes(y)));
  return hit.length / A.length;
}

export function availabilityDays(volunteer) {
  return (volunteer.availability_slots || []).map((s) => norm(s.day));
}