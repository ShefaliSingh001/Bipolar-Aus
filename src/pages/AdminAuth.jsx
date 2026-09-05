import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import AdminLoginForm from "@/components/adminAuth/AdminLoginForm";
import AdminSignupForm from "@/components/adminAuth/AdminSignupForm";

export default function AdminAuth() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const onSuccess = (admin) => {
    localStorage.setItem("admin_session", JSON.stringify({ id: admin.id, name: admin.name, email: admin.email }));
    navigate("/admin");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrandLogo />
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-20">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin access</p>
        <h1 className="font-heading text-[34px] leading-tight">
          {mode === "login" ? "Welcome back." : "Create your admin account."}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          {mode === "login"
            ? "Sign in with the email and password you registered with."
            : "Tell us your details and choose a password to manage volunteers and roles."}
        </p>

        <div className="mt-10">
          {mode === "login" ? <AdminLoginForm onSuccess={onSuccess} /> : <AdminSignupForm onSuccess={onSuccess} />}
        </div>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-8 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already registered? Sign in"}
        </button>
      </main>
    </div>
  );
}