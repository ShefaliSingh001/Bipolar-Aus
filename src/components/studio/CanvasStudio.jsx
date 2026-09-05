import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import CanvasToolbar from "@/components/studio/CanvasToolbar";
import CanvasBoard from "@/components/studio/CanvasBoard";
import useCanvasPersistence from "@/components/studio/useCanvasPersistence";

export default function CanvasStudio({ project, setProject, authorName, canEdit }) {
  const [tool, setTool] = useState("brush");
  const [color, setColor] = useState("#0A7A3A");
  const [size, setSize] = useState(6);
  const [sticker, setSticker] = useState("✨");
  const [uploading, setUploading] = useState(false);
  const { saveEntry, saving, saveError, retrySave } = useCanvasPersistence(project.id, setProject);

  const addStroke = (stroke) => saveEntry("strokes", { ...stroke, author: authorName });
  const addItem = (item) => saveEntry("items", { ...item, author: authorName });

  const uploadImage = async (file) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await addItem({ type: "image", x: 80, y: 80, size, url: file_url });
    setUploading(false);
  };

  return (
    <section>
      <h2 className="font-heading text-2xl">Shared canvas</h2>
      {canEdit && (
        <div className="mt-5">
          <CanvasToolbar
            tool={tool} setTool={setTool}
            color={color} setColor={setColor}
            size={size} setSize={setSize}
            sticker={sticker} setSticker={setSticker}
            onUploadImage={uploadImage} uploading={uploading}
          />
          <div className="mt-3 text-sm" role="status" aria-live="polite">
            <span className={saveError ? "text-destructive" : "text-muted-foreground"}>
              {saveError || (saving ? "Saving drawing…" : "Drawing saved")}
            </span>
            {saveError && (
              <button onClick={retrySave} disabled={saving > 0} className="ba-btn-secondary ml-3 py-1.5">Retry save</button>
            )}
          </div>
        </div>
      )}
      <div className="mt-6">
        <CanvasBoard
          canvas={project.canvas || {}}
          tool={tool} color={color} size={size} sticker={sticker}
          onStroke={addStroke} onItem={addItem}
          canEdit={canEdit}
        />
      </div>
      {!canEdit && (
        <p className="mt-3 text-sm text-muted-foreground">Join this project to draw on the shared canvas.</p>
      )}
    </section>
  );
}