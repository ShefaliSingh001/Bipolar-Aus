import React from "react";

const SHEET = "https://media.base44.com/images/public/6a9c05381c3844400beebe23/805085ea9_image.png";
const COLS = 4;
const ROWS = 5;

// Logos as they appear in the partner sheet, left-to-right, top-to-bottom.
const partners = [
  "Annabelle & Co", "An Odd View Creative", "Australian Government — Health and Aged Care", "Blue Mountains City Council",
  "BNI Alliance", "Cake Mania", "ETSI", "L&E Beresh Optometrists",
  "Mental Health Commission of NSW", "Officeworks", "Orison Law Group", "ParkRoyal Parramatta",
  "Ross Hutchison Foundation", "Ryde Eastwood Leagues", "Star Discount Chemist", "The Athlete's Foot",
  "Thrive Broking", "Verve", "Woolworths",
];

function PartnerLogo({ name, index }) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className="h-[92px] w-[176px] shrink-0 bg-no-repeat"
      style={{
        backgroundImage: `url(${SHEET})`,
        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
        backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
        mixBlendMode: "multiply",
      }}
    />
  );
}

export default function PartnerMarquee() {
  return (
    <div className="ba-marquee">
      <div className="ba-marquee-track">
        {[...partners, ...partners].map((name, i) => (
          <PartnerLogo key={name + i} name={name} index={i % partners.length} />
        ))}
      </div>
    </div>
  );
}