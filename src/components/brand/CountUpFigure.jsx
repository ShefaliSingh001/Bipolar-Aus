import React, { useEffect, useRef, useState } from "react";

// Animates the first number inside a figure string (e.g. "568,000", "$3,000", "30 years") once, on scroll into view.
export default function CountUpFigure({ value, className = "" }) {
  const ref = useRef(null);
  const match = String(value).match(/[\d,]*\d/);
  const target = match ? Number(match[0].replace(/,/g, "")) : null;
  const grouped = match ? match[0].includes(",") : false;
  const [display, setDisplay] = useState(target && target > 2 ? 0 : target);

  useEffect(() => {
    if (!target || target <= 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(target); return; }

    const el = ref.current;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  if (!match) return <p className={className}>{value}</p>;

  const shown = grouped ? Number(display).toLocaleString("en-AU") : String(display);
  const text = String(value).replace(match[0], shown);

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}