import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/brand/PageHeader";
import Sydney3DMap from "@/components/explore/Sydney3DMap";
import LandmarkPopover from "@/components/explore/LandmarkPopover";
import AddCreationForm from "@/components/explore/AddCreationForm";
import useSydneyMap from "@/hooks/useSydneyMap";
import { Link } from "react-router-dom";
import { Palette } from "lucide-react";

export default function Explore() {
  const map = useSydneyMap();
  const [all, setAll] = useState([]);

  const load = useCallback(async () => {
    const [rows, projects] = await Promise.all([
      base44.entities.Creation.list("-created_date"),
      base44.entities.ArtProject.filter({ stage: "published" }, "-created_date"),
    ]);
    const covered = new Set(rows.map((r) => r.project_id).filter(Boolean));
    const fromProjects = projects
      .filter((p) => p.explore_landmark && !covered.has(p.id))
      .map((p) => ({
        id: `project-${p.id}`,
        title: p.title,
        landmark: p.explore_landmark,
        creator_name: p.creator_name,
        type: "artwork",
        description: p.story,
        image_url: p.preview_url,
        project_id: p.id,
        created_date: p.published_at || p.created_date,
      }));
    setAll(
      [...rows, ...fromProjects].sort(
        (a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0)
      )
    );
  }, []);

  useEffect(() => { load(); }, [load]);

  const counts = all.reduce((acc, c) => {
    acc[c.landmark] = (acc[c.landmark] || 0) + 1;
    return acc;
  }, {});
  const selectedCreations = all.filter((c) => c.landmark === map.selectedId);

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Explore"
        title="An illustrated Sydney, made by our community."
        description="Tap a place on the map to see the artworks, stories, photos and poems our community has made there — and add your own."
        actions={
          <Link
            to={map.selected ? `/studio/create?landmark=${map.selected.id}` : "/studio"}
            className="ba-btn-primary"
          >
            <Palette className="h-4 w-4" /> Add an artwork
          </Link>
        }
      />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <Sydney3DMap
          landmarks={map.landmarks}
          selectedId={map.selectedId}
          hoveredId={map.hoveredId}
          setHoveredId={map.setHoveredId}
          onSelect={map.select}
          counts={counts}
          footer={
            map.selected
              ? `${selectedCreations.length} creation${selectedCreations.length === 1 ? "" : "s"} at ${map.selected.name}`
              : "Choose a landmark name tag to see its community creations"
          }
          panel={
            map.selected && (
              <LandmarkPopover
                landmark={map.selected}
                creations={selectedCreations}
                onClose={map.clear}
              />
            )
          }
        />

        {map.selected && (
          <div className="mt-12 max-w-xl">
            <AddCreationForm landmarkId={map.selected.id} onAdded={load} />
          </div>
        )}
      </main>
    </div>
  );
}