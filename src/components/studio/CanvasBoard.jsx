import React, { useEffect, useRef, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import CanvasToolbar from "@/components/studio/CanvasToolbar";

const W = 1000;
const H = 620;

export default function CanvasBoard({ project, onSaved }) {
  const canvasRef = useRef(null);
  const drawing = useRef(null);
  const imageCache = useRef({});
  const [strokes, setStrokes] = useState(project.canvas?.strokes || []);
  const [items, setItems] = useState(project.canvas?.items || []);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#0A7A3A");
  const [size, setSize] = useState(4);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStrokes(project.canvas?.strokes || []);
    setItems(project.canvas?.items || []);
  }, [project.id, project.updated_date]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    items.forEach((it) => {
      if (it.kind === "image") {
        let img = imageCache.current[it.url];
        if (!img) {
          img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => redraw();
          img.src = it.url;
          imageCache.current[it.url] = img;
        }
        if (img.complete) ctx.drawImage(img, it.x, it.y, it.w, it.h);
      } else if (it.kind === "text") {
        ctx.fillStyle = it.color;
        ctx.font = `${it.size * 5}px 'DM Sans', sans-serif`;
        ctx.fillText(it.text, it.x, it.y);
      } else if (it.kind === "rect") {
        ctx.strokeStyle = it.color;
        ctx.lineWidth = it.size;
        ctx.strokeRect(it.x, it.y, it.w, it.h);
      } else if (it.kind === "circle") {
        ctx.strokeStyle = it.color;
        ctx.lineWidth = it.size;
        ctx.beginPath();
        ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    strokes.forEach((s) => {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      (s.points || []).forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
    });
  }, [strokes, items]);

  useEffect(() => { redraw(); }, [redraw]);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: ((cx - rect.left) / rect.width) * W, y: ((cy - rect.top) / rect.height) * H };
  };

  const start = (e) => {
    e.preventDefault();
    const p = pos(e);
    if (tool === "pen") {
      drawing.current = { color, size, points: [p] };
      setStrokes((s) => [...s, drawing.current]);
    } else if (tool === "text") {
      const text = window.prompt("Text to add");
      if (text) setItems((i) => [...i, { kind: "text", text, x: p.x, y: p.y, color, size }]);
    } else {
      drawing.current = { kind: tool, x: p.x, y: p.y, color, size, w: 0, h: 0, r: 0 };
    }
  };

  const move = (e) => {
    if (!drawing.current) return;
    const p = pos(e);
    if (tool === "pen") {
      drawing.current.points.push(p);
      setStrokes((s) => [...s.slice(0, -1), { ...drawing.current, points: [...drawing.current.points] }]);
    }
  };

  const end = (e) => {
    if (!drawing.current) return;
    if (tool === "rect" || tool === "circle") {
      const p = pos(e.changedTouches ? { touches: e.changedTouches } : e);
      const d = drawing.current;
      const shape = tool === "rect"
        ? { ...d, w: p.x - d.x, h: p.y - d.y }
        : { ...d, r: Math.max(4, Math.hypot(p.x - d.x, p.y - d.y)) };
      setItems((i) => [...i, shape]);
    }
    drawing.current = null;
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setItems((i) => [...i, { kind: "image", url: file_url, x: 60, y: 60, w: 320, h: 240 }]);
    setUploading(false);
  };

  const undo = () => {
    if (strokes.length) setStrokes((s) => s.slice(0, -1));
    else setItems((i) => i.slice(0, -1));
  };

  const save = async () => {
    setSaving(true);
    const preview = canvasRef.current.toDataURL("image/png");
    let preview_url = project.preview_url;
    try {
      const blob = await (await fetch(preview)).blob();
      const file = new File([blob], `${project.id}-preview.png`, { type: "image/png" });
      const res = await base44.integrations.Core.UploadFile({ file });
      preview_url = res.file_url;
    } catch (err) {
      preview_url = project.preview_url;
    }
    await base44.entities.ArtProject.update(project.id, { canvas: { strokes, items }, preview_url });
    setSaving(false);
    onSaved && onSaved();
  };

  return (
    <div>
      <CanvasToolbar
        tool={tool} setTool={setTool}
        color={color} setColor={setColor}
        size={size} setSize={setSize}
        onUndo={undo} onSave={save} onUpload={upload}
        uploading={uploading} saving={saving}
      />
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        className="mt-4 w-full cursor-crosshair touch-none rounded-[var(--radius)] border border-border bg-white"
      />
    </div>
  );
}