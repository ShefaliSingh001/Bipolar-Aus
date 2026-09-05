import { useEffect, useState } from "react";
import { appendCanvasEntry, mergeCanvas } from "@/components/studio/canvasPersistence";

export default function useCanvasPersistence(id, setProject) {
  const [saving, setSaving] = useState(0);
  const [failed, setFailed] = useState([]);

  useEffect(() => {
    const warn = (event) => {
      if (!saving && !failed.length) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [saving, failed.length]);

  const saveEntry = async (field, value) => {
    const entry = value.id ? value : { ...value, id: crypto.randomUUID() };
    setProject((current) =>
      current?.id === id ? { ...current, canvas: mergeCanvas(current.canvas, { [field]: [entry] }) } : current
    );
    setSaving((count) => count + 1);
    try {
      await appendCanvasEntry(id, field, entry);
      setFailed((entries) => entries.filter((item) => item.entry.id !== entry.id));
      return true;
    } catch {
      setFailed((entries) =>
        entries.some((item) => item.entry.id === entry.id) ? entries : [...entries, { field, entry }]
      );
      return false;
    } finally {
      setSaving((count) => count - 1);
    }
  };

  return {
    saveEntry,
    saving,
    saveError: failed.length ? "Some drawing changes could not be saved. Retry before leaving." : "",
    retrySave: () => Promise.all(failed.map(({ field, entry }) => saveEntry(field, entry))),
  };
}