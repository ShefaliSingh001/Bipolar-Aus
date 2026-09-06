import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

export default function HomeNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <BrandLogo />
        <div className="flex items-center gap-7">
          <a href="#about" className="hidden text-sm text-muted-foreground transition-colors hover:text-primary sm:block">About</a>
          <Link to="/community" className="hidden text-sm text-muted-foreground transition-colors hover:text-primary sm:block">Community</Link>
          <Link to="/studio" className="hidden text-sm text-muted-foreground transition-colors hover:text-primary sm:block">Art Studio</Link>
          <Link to="/explore" className="hidden text-sm text-muted-foreground transition-colors hover:text-primary md:block">Explore</Link>
          <Link to="/portal" className="hidden text-sm text-muted-foreground transition-colors hover:text-primary md:block">My portal</Link>
          <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-primary">Log in</Link>
          <Link to="/apply" className="ba-btn-primary px-5 py-2.5">
            Volunteer Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}