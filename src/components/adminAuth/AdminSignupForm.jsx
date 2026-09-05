import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowRight } from "lucide-react";

const FIELDS = [
  { k: "name", label: "Full name *", type: "text", ph: "Your full name" },
  { k: "email", label: "Email *", type: "email", ph: "you@email.com" },
  { k: "phone", label: "Phone", type: "tel", ph: "04xx xxx xxx" },
  { k: "address", label: "Address", type: "text", ph: "Street, suburb" },
  { k: "password", label: "Password *", type: "password", ph: "Choose a password" },
];

export default function AdminSignupForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name && form.email && form.password;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const email = form.email.trim().toLowerCase();
      const existing = await base44.entities.Admin.filter({ email });
      if (existing.length) {
        setError("An admin account with that email already exists.");
        return;
      }
      const created = await base44.entities.Admin.create({ ...form, email });
      onSuccess(created);
    } catch (err) {
      setError(err?.message || "Could not create the account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {FIELDS.map((f) => (
        <div key={f.k}>
          <label className="mb-2 block text-sm text-muted-foreground">{f.label}</label>
          <input
            type={f.type}
            value={form[f.k]}
            placeholder={f.ph}
            onChange={(e) => set(f.k, e.target.value)}
            className="w-full border-b border-border bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-primary"
          />
        </div>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={!valid || saving} className="ba-btn-primary w-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create admin account <ArrowRight className="h-4 w-4" /></>}
      </button>
    </form>
  );
}