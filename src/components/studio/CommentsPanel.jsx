import React, { useState } from "react";
import StatusPill from "@/components/brand/StatusPill";

export default function CommentsPanel({ comments, onAdd }) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState("comment");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onAdd({ text, kind });
    setText("");
  };

  return (
    <div>
      <h2 className="font-heading text-2xl">Comments & suggestions</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Share a thought or a suggestion" className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50" />
        <div className="flex flex-wrap items-center gap-3">
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-full border border-border bg-card px-4 py-2 text-sm outline-none">
            <option value="comment">Comment</option>
            <option value="suggestion">Suggestion</option>
          </select>
          <button type="submit" className="ba-btn-primary py-2">Post</button>
        </div>
      </form>

      <div className="mt-6 divide-y divide-border">
        {comments.length === 0 && <p className="py-5 text-sm text-muted-foreground">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c.id} className="py-4">
            <div className="flex items-center gap-3">
              <p className="text-[15px]">{c.author_name}</p>
              <StatusPill tone={c.kind === "suggestion" ? "warm" : "quiet"}>{c.kind}</StatusPill>
            </div>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}