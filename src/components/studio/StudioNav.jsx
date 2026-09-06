import React from "react";
import { Link, useLocation } from "react-router-dom";

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
        <div className="ml-auto flex items-center gap-6">
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