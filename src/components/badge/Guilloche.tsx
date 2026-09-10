interface Props {
  color: string;
  opacity?: number;
  className?: string;
}

/** Engraved guilloche rosette + wave field, drawn as pure SVG so it exports cleanly. */
export function GuillocheRosette({ color, opacity = 0.5, className }: Props) {
  const rings = Array.from({ length: 46 }, (_, i) => i);
  return (
    <svg viewBox="-160 -160 320 320" className={className} style={{ opacity }} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="0.45">
        {rings.map((i) => {
          const a = (i * Math.PI * 2) / rings.length;
          return <ellipse key={i} rx="140" ry="52" transform={`rotate(${(a * 180) / Math.PI})`} />;
        })}
      </g>
      <g fill="none" stroke={color} strokeWidth="0.6">
        <circle r="150" />
        <circle r="96" />
        <circle r="34" />
      </g>
    </svg>
  );
}

export function GuillocheWaves({ color, opacity = 0.4, className }: Props) {
  const lines = Array.from({ length: 26 }, (_, i) => i);
  return (
    <svg viewBox="0 0 800 120" preserveAspectRatio="none" className={className} style={{ opacity }} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="0.5">
        {lines.map((i) => {
          const y = 6 + i * 4.2;
          const amp = 9 + (i % 5) * 2.4;
          let d = `M0 ${y}`;
          for (let x = 0; x <= 800; x += 40) {
            d += ` Q ${x + 20} ${y + (x / 40) % 2 === 0 ? amp : -amp} ${x + 40} ${y}`;
          }
          return <path key={i} d={d} />;
        })}
      </g>
    </svg>
  );
}

export function TechGrid({ color, opacity = 0.25, className }: Props) {
  return (
    <svg className={className} style={{ opacity }} aria-hidden="true">
      <defs>
        <pattern id="tech-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke={color} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tech-grid)" />
    </svg>
  );
}
