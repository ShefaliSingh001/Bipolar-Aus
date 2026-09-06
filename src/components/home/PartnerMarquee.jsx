import React from "react";

const SHEET = "https://media.base44.com/images/public/6a9c05381c3844400beebe23/805085ea9_image.png";
const COLS = 4;
const ROWS = 5;

// Grid positions on the partner logo sheet, left-to-right, top-to-bottom.
const partners = [
  { name: "Annabelle & Co", col: 0, row: 0 },
  { name: "An Odd View Creative", col: 1, row: 0 },
  { name: "Australian Government Department of Health and Aged Care", col: 2, row: 0 },
  { name: "Blue Mountains City Council", col: 3, row: 0 },
  { name: "BNI Alliance", col: 0, row: 1 },
  { name: "Cake Mania", col: 1, row: 1 },
  { name: "ETSI", col: 2, row: 1 },
  { name: "L&E Beresh Optometrists", col: 3, row: 1 },
  { name: "Mental Health Commission of NSW", col: 0, row: 2 },
  { name: "Officeworks", col: 1, row: 2 },
  { name: "Orison Law Group", col: 2, row: 2 },
  { name: "ParkRoyal Parramatta", col: 3, row: 2 },
  { name: "Ross Hutchison Foundation", col: 0, row: 3 },
  { name: "Ryde Eastwood Leagues", col: 1, row: 3 },
  { name: "Star Discount Chemist", col: 2, row: 3 },
  { name: "The Athlete's Foot", col: 3, row: 3 },
  { name: "Thrive Broking", col: 0, row: 4 },
  { name: "Verve", col: 1, row: 4 },
  { name: "Woolworths", col: 2, row: 4 },
];

function PartnerLogo({ partner }) {
  return (
    <div
      role="img"
      aria-label={partner.name}
      title={partner.name}
      className="h-16 w-[168px] shrink-0 bg-no-repeat opacity-80 transition-opacity duration-300 hover:opacity-100"
      style={{
        backgroundImage: `url(${SHEET})`,
        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
        backgroundPosition: `${(partner.col / (COLS - 1)) * 100}% ${(partner.row / (ROWS - 1)) * 100}%`,
        mixBlendMode: "multiply",
      }}
    />
  );
}

export default function PartnerMarquee() {
  return (
    <div className="ba-marquee">
      <div className="ba-marquee-track">
        {[...partners, ...partners].map((p, i) => (
          <PartnerLogo key={p.name + i} partner={p} />
        ))}
      </div>
    </div>
  );
}