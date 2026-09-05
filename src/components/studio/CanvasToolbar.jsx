import React from "react";
import { Pencil, Square, Circle, Type, Image as ImageIcon, Undo2, Save } from "lucide-react";

const COLORS = ["#1A1A1A", "#0A7A3A", "#3CB371", "#FFD84D", "#D6635C", "#FFFFFF"];
const TOOLS = [
  { key: "pen", icon: Pencil, label: "Draw" },
  { key: "rect", icon: Square, label: "Rectangle" },
  { key: "circle", icon: Circle, label: "Circle" },
  { key: "text", icon: Type, label: "Text" },
];

export default function CanvasToolbar({ tool, setTool, color, setColor, size, setSize, onUndo, onSave, onUpload, uploading, saving }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
      {TOOLS.map((t) => (
        <button
          key={t.key}
          type="button"
          title={t.label}
          onClick={() => setTool(t.key)}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${tool === t.key ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}
        >
          <t.icon className="h-4 w-4" />
        </button>
      ))}

      <span className="mx-1 h-6 w-px bg-border" />

      {COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setColor(c)}
          className={`h-6 w-6 rounded-full border-2 ${color === c ? "border-primary" : "border-border"}`}
          style={{ backgroundColor: c }}
          aria-label={`Colour ${c}`}
        />
      ))}

      <input type="range" min="1" max="24" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-24 accent-primary" />

      <span className="mx-1 h-6 w-px bg-border" />

      <label className="ba-btn-secondary cursor-pointer py-2">
        <ImageIcon className="h-4 w-4" />
        {uploading ? "Uploading…" : "Image"}
        <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
      </label>
      <button type="button" onClick={onUndo} className="ba-btn-secondary py-2"><Undo2 className="h-4 w-4" /> Undo</button>
      <button type="button" onClick={onSave} disabled={saving} className="ba-btn-primary py-2"><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save canvas"}</button>
    </div>
  );
}