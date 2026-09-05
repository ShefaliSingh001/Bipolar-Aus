import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

const TYPES = ["artwork", "story", "photo", "music", "poem", "other"];

export default function AddCreationForm({ landmarkId, onAdded }) {
  const [form, setForm] = useState({ title: "", creator_name: "", type: "artwork", description: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);
    setUploading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Creation.create({ ...form, landmark: landmarkId, image_url: imageUrl });
    setForm({ title: "", creator_name: "", type: "artwork", description: "" });
    setImageUrl("");
    setSaving(false);
    onAdded();
  };

  return (
    <form onSubmit={submit} className="brand-card space-y-4">
      <h3 className="font-heading text-xl">Add a creation here</h3>
      <input
        required
        placeholder="Title"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50"
      />
      <input
        placeholder="Your name"
        value={form.creator_name}
        onChange={(e) => set("creator_name", e.target.value)}
        className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50"
      />
      <select
        value={form.type}
        onChange={(e) => set("type", e.target.value)}
        className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50"
      >
        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <textarea
        rows={3}
        placeholder="Tell us about it"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/50"
      />
      <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
        <span className="ba-btn-secondary py-2">{uploading ? "Uploading…" : imageUrl ? "Change image" : "Add an image"}</span>
        <input type="file" accept="image/*" onChange={upload} className="hidden" />
        {imageUrl && <span className="text-primary">Image attached</span>}
      </label>
      <button type="submit" disabled={saving} className="ba-btn-primary w-full">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />} Add to the map
      </button>
    </form>
  );
}