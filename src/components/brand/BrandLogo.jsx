import React from "react";
import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[13px] font-medium text-primary-foreground transition-transform duration-300 group-hover:scale-105">
        BA
      </span>
      

      
    </Link>);

}