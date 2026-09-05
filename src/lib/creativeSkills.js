export const creativeSkills = [
  "Illustration",
  "3D Design",
  "Painting",
  "Photography",
  "Music",
  "Poetry",
  "Writing",
  "Graphic Design",
  "Animation",
  "Textiles",
  "Ceramics",
  "Film",
  "Sound Design",
  "Curating",
];

export const volunteerSkills = [
  "Peer support",
  "Facilitation",
  "Event help",
  "Administration",
  "Social media",
  "Graphic Design",
  "Writing",
  "Photography",
  "Fundraising",
  "Community outreach",
  "Data & reporting",
  "Teaching",
];

export function skillMatchPercent(wanted = [], mine = []) {
  if (!wanted.length) return 0;
  const m = mine.map((s) => s.toLowerCase());
  const hits = wanted.filter((w) => m.includes(String(w).toLowerCase()));
  return Math.round((hits.length / wanted.length) * 100);
}