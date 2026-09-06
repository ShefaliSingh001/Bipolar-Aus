import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const wanted = email.trim().toLowerCase();
      const all = await base44.entities.Admin.list();
      const admin = all.find(
        (a) => (a.email || "").trim().toLowerCase() === wanted && (a.password || "") === password.trim()
      );
      if (!admin) {
        setError("Those details don't match an admin account.");
        return;
      }
      onSuccess(admin);
    } catch (err) {
      setError(err?.message || "Could not sign you in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm text-muted-foreground">Email *</label>
        <input
          type="email"
          value={email}
          placeholder="you@email.com"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-border bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-muted-foreground">Password *</label>
        <input
          type="password"
          value={password}
          placeholder="Your password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-b border-border bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-primary"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={!email || !password || loading} className="ba-btn-primary w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
      </button>
    </form>
  );
}