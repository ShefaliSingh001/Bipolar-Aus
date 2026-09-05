import { useRef } from "react";

const TOOLS = [
  { id: "brush", label: "Brush" },
  { id: "eraser", label: "Eraser" },
  { id: "text", label: "Text" },
  { id: "rect", label: "Square" },
  { id: "circle", label: "Circle" },
  { id: "sticker", label: "Sticker" },
  { id: "cube", label: "3D object" },
];

const COLORS = ["#1A1A1A", "#0A7A3A", "#3CB371", "#FFD84D", "#FF0000", "#D6635C", "#4A6FE3", "#A855F7", "#FFFFFF"];
const STICKERS = ["✨", "🌱", "🌈", "💛", "🕊️", "🌙", "🔥", "🫶"];

const PILL = "rounded-full px-3.5 py-1.5 text-xs transition-colors ";

export default function CanvasToolbar({ tool, setTool, color, setColor, size, setSize, sticker, setSticker, onUploadImage, uploading }) {
  const fileRef = useRef(null);

  const pick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUploadImage(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-5 border-b border-border pb-6">
      <div className="flex flex-wrap gap-2">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={
              PILL + "border " +
              (tool === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground")
            }
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={() => fileRef.current?.click()}
          className={PILL + "border border-border bg-card text-muted-foreground hover:border-muted-foreground"}
        >
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={pick} className="hidden" />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={c}
              title={c}
              aria-pressed={color === c}
              className={`h-7 w-7 rounded-full border transition-transform ${color === c ? "scale-110 border-foreground" : "border-border"}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          Size
          <input type="range" min="2" max="48" value={size} onChange={(e) => setSize(Number(e.target.value))} className="accent-primary" />
        </label>
      </div>

      {tool === "sticker" && (
        <div className="flex flex-wrap gap-2">
          {STICKERS.map((s) => (
            <button
              key={s}
              onClick={() => setSticker(s)}
              className={`h-10 w-10 rounded-full border text-lg ${sticker === s ? "border-primary bg-muted" : "border-border bg-card"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}