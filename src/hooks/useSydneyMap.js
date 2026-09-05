import { useEffect, useState, useCallback } from "react";
import { landmarks, getLandmark } from "@/lib/landmarks";

export default function useSydneyMap() {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("landmark");
    if (param && getLandmark(param)) setSelectedId(param);
  }, []);

  const select = useCallback((id) => {
    setSelectedId(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("landmark", id);
    else url.searchParams.delete("landmark");
    window.history.replaceState({}, "", url.toString());
  }, []);

  return {
    landmarks,
    selectedId,
    selected: getLandmark(selectedId),
    hoveredId,
    setHoveredId,
    select,
    clear: () => select(null),
  };
}