import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/brand/PageHeader";
import { Loader2 } from "lucide-react";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email.trim(), password);
      window.location.href = "/portal";
    } catch (err) {
      setError(err.message || "That email and password didn't match.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Volunteer portal"
        title="Sign in to your portal"
        description="Use the email and password you created with your volunteer application."
      />
      <main className="mx-auto max-w-md px-6 py-14">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[15px] outline-none focus:border-primary/50"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={loading} className="ba-btn-primary w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-primary underline underline-offset-4">Forgot password?</Link>
            <Link to="/apply" className="text-muted-foreground hover:text-primary">New here? Apply</Link>
          </div>
        </form>
      </main>
    </div>
  );
}