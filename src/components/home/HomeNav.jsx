import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "@/components/brand/BrandLogo";

const links = [
  { label: "Studio", to: "/studio" },
  { label: "Explore", to: "/explore" },
  { label: "Community", to: "/community" },
  { label: "Volunteer portal", to: "/portal" },
];

export default function HomeNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <BrandLogo />
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {l.label}
            </Link>
          ))}
        </div>
        <Link to="/apply" className="ba-btn-primary px-5 py-2.5">Volunteer Now</Link>
      </div>
    </nav>
  );
}