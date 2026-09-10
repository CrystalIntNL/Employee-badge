import type { CSSProperties } from "react";

interface Props {
  color: string;
  style?: CSSProperties;
  className?: string;
}

/** Engraved guilloche rosette, drawn as pure SVG so it exports cleanly. */
export function GuillocheRosette({ color, style, className }: Props) {
  const rings = Array.from({ length: 46 }, (_, i) => i);
  return (
    <svg viewBox="-160 -160 320 320" className={className} style={style} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="0.45">
        {rings.map((i) => (
          <ellipse key={i} rx="140" ry="52" transform={`rotate(${(i * 360) / rings.length})`} />
        ))}
      </g>
      <g fill="none" stroke={color} strokeWidth="0.6">
        <circle r="150" />
        <circle r="96" />
        <circle r="34" />
      </g>
    </svg>
  );
}

export function GuillocheWaves({ color, style, className }: Props) {
  const lines = Array.from({ length: 26 }, (_, i) => i);
  return (
    <svg viewBox="0 0 800 120" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="0.5">
        {lines.map((i) => {
          const y = 6 + i * 4.2;
          const amp = 9 + (i % 5) * 2.4;
          let d = `M0 ${y}`;
          for (let x = 0; x <= 800; x += 40) {
            d += ` Q ${x + 20} ${(x / 40) % 2 === 0 ? y + amp : y - amp} ${x + 40} ${y}`;
          }
          return <path key={i} d={d} />;
        })}
      </g>
    </svg>
  );
}

export function TechGrid({ color, style, className }: Props) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <defs>
        <pattern id="tech-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke={color} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tech-grid)" />
    </svg>
  );
}
