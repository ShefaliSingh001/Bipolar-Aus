import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, FileText, Upload, X } from "lucide-react";

const ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export default function ResumeUpload({ value, fileName, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ok = /\.(pdf|docx)$/i.test(file.name);
    if (!ok) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
    setError("");
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploading(false);
    onChange(file_url, file.name);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">Resume (optional)</label>
      <p className="mb-3 text-sm text-muted-foreground">PDF or DOCX. You can skip this — it's completely optional.</p>

      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-card px-4 py-3">
          <span className="flex min-w-0 items-center gap-2 text-sm">
            <FileText className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{fileName || "Resume attached"}</span>
          </span>
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="h-4 w-4" /> Remove
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="ba-btn-secondary">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload resume"}
        </button>
      )}

      <input ref={inputRef} type="file" accept={ACCEPT} onChange={pick} className="hidden" />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}