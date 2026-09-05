import { base44 } from "@/api/base44Client";

const pending = new Map();
const key = (entry) => entry.id || JSON.stringify(entry);

export function mergeCanvas(remote = {}, local = {}) {
  const merge = (field) =>
    [...new Map([...(remote[field] || []), ...(local[field] || [])].map((entry) => [key(entry), entry])).values()];
  return { strokes: merge("strokes"), items: merge("items") };
}

export async function waitForCanvasSaves(id) {
  await Promise.allSettled([...(pending.get(id) || [])]);
}

export function appendCanvasEntry(id, field, entry) {
  // Atomic appends prevent quick strokes or collaborators overwriting each other.
  const request = base44.entities.ArtProject.updateMany(
    { id },
    { $addToSet: { [`canvas.${field}`]: entry } }
  ).then((result) => {
    if (result?.matched_count === 0) throw new Error("Drawing could not be saved.");
    return result;
  });
  if (!pending.has(id)) pending.set(id, new Set());
  const writes = pending.get(id);
  writes.add(request);
  const cleanup = () => { writes.delete(request); if (!writes.size) pending.delete(id); };
  request.then(cleanup, cleanup);
  return request;
}