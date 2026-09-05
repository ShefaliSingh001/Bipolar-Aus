import React from "react";
import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="https://media.base44.com/images/public/6a9c05381c3844400beebe23/726d82735_image.png"
        alt="Bipolar Australia — Recovering together"
        className="h-9 w-auto transition-transform duration-300 group-hover:scale-[1.03]"
        style={{ mixBlendMode: "multiply" }}
      />
      
    </Link>);

}