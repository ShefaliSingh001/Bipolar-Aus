import React from "react";
import { Award } from "lucide-react";

export default function CertificateCard({ volunteer, hours }) {
  return (
    <div className="brand-card">
      <Award className="h-6 w-6 text-primary" />
      <h3 className="mt-4 font-heading text-2xl">Certificate of contribution</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Awarded to {volunteer?.name} for {hours} volunteer hours with Bipolar Australia.
      </p>
      <button className="ba-btn-primary mt-6" onClick={() => window.print()}>
        Print my certificate
      </button>
    </div>
  );
}