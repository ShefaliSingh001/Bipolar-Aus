import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import AdminLoginForm from "@/components/adminAuth/AdminLoginForm";

export default function AdminAuth() {
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
        <h1 className="font-heading text-[34px] leading-tight">Welcome back.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Sign in with the email and password you were given. Admin accounts are created by an existing
          administrator — there's no public sign-up.
        </p>

        <div className="mt-10">
          <AdminLoginForm onSuccess={onSuccess} />
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Need access? Ask an existing administrator to set up an account for you.
        </p>
      </main>
    </div>
  );
}