import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/brand/PageHeader";
import Sydney3DMap from "@/components/explore/Sydney3DMap";
import LandmarkInfoCard from "@/components/explore/LandmarkInfoCard";
import CreationList from "@/components/explore/CreationList";
import AddCreationForm from "@/components/explore/AddCreationForm";
import useSydneyMap from "@/hooks/useSydneyMap";

export default function Explore() {
  const map = useSydneyMap();
  const [creations, setCreations] = useState([]);

  const load = useCallback(async () => {
    if (!map.selectedId) { setCreations([]); return; }
    const [rows, projects] = await Promise.all([
      base44.entities.Creation.filter({ landmark: map.selectedId }, "-created_date"),
      base44.entities.ArtProject.filter({ explore_landmark: map.selectedId }, "-created_date"),
    ]);
    const covered = new Set(rows.map((r) => r.project_id).filter(Boolean));
    const fromProjects = projects
      .filter((p) => !covered.has(p.id))
      .map((p) => ({
        id: `project-${p.id}`,
        title: p.title,
        creator_name: p.creator_name,
        type: "artwork",
        description: p.story,
        image_url: p.preview_url,
        project_id: p.id,
        created_date: p.published_at || p.created_date,
      }));
    setCreations(
      [...rows, ...fromProjects].sort(
        (a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0)
      )
    );
  }, [map.selectedId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Explore"
        title="An illustrated Sydney, made by our community."
        description="Tap a place on the map to see the artworks, stories, photos and poems our community has made there — and add your own."
      />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <Sydney3DMap
          landmarks={map.landmarks}
          selectedId={map.selectedId}
          hoveredId={map.hoveredId}
          setHoveredId={map.setHoveredId}
          onSelect={map.select}
        />

        <div className="mt-14">
          {!map.selected ? (
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Choose a place above to begin.
            </p>
          ) : (
            <>
              <LandmarkInfoCard landmark={map.selected} count={creations.length} onClear={map.clear} />
              <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
                <section>
                  <h2 className="font-heading text-2xl">Creations at {map.selected.name}</h2>
                  <CreationList creations={creations} />
                </section>
                <AddCreationForm landmarkId={map.selected.id} onAdded={load} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}