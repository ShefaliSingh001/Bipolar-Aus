import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

const links = [
  { to: "/studio/create", label: "Create" },
  { to: "/studio", label: "Collaborations" },
  { to: "/studio/impact", label: "My Impact" },
  { to: "/studio/profile", label: "Profile" },
];

export default function StudioNav() {
  const { pathname } = useLocation();
  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <BrandLogo />
          <Link to="/" className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary sm:inline-flex">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm transition-colors ${pathname === l.to ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}