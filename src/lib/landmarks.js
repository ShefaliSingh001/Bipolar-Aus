export const SYDNEY_MAP_URL =
  "https://media.base44.com/images/public/6a9c05381c3844400beebe23/75da4da13_generated_image.png";

// x / y are percentages across the illustrated map asset.
export const landmarks = [
  { id: "opera-house", name: "Sydney Opera House", x: 52, y: 46, blurb: "Where many first performances — and first steps back into the world — happen." },
  { id: "harbour-bridge", name: "Harbour Bridge", x: 40, y: 34, blurb: "A crossing between two sides. A favourite metaphor in our art groups." },
  { id: "bondi", name: "Bondi Beach", x: 76, y: 66, blurb: "Salt air, early swims, and our sunrise wellbeing walks." },
  { id: "botanic-garden", name: "Royal Botanic Garden", x: 62, y: 56, blurb: "Quiet green rooms in the middle of the city." },
  { id: "darling-harbour", name: "Darling Harbour", x: 33, y: 56, blurb: "Home to our community exhibitions and open studio days." },
  { id: "newtown", name: "Newtown", x: 22, y: 72, blurb: "Murals, music and the loudest colour in our collection." },
  { id: "manly", name: "Manly Wharf", x: 66, y: 20, blurb: "The ferry ride our peer group calls 'thirty minutes of calm'." },
  { id: "blue-mountains", name: "Blue Mountains", x: 12, y: 34, blurb: "Where the retreat sketchbooks come from." },
];

export function getLandmark(id) {
  return landmarks.find((l) => l.id === id) || null;
}