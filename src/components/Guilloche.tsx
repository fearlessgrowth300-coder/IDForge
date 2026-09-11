// Decorative guilloche line pattern used as a security-document background.
export default function Guilloche({ color = 'rgba(212,175,55,0.16)', className = '' }: { color?: string; className?: string }) {
  const rings = Array.from({ length: 12 }, (_, i) => i);
  return (
    <svg
      className={'guilloche ' + className}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g transform="translate(200 150)">
        {rings.map(i => (
          <ellipse key={i} rx={20 + i * 17} ry={12 + i * 11} fill="none" stroke={color} strokeWidth="1" />
        ))}
        {rings.map(i => (
          <ellipse key={'r' + i} rx={20 + i * 17} ry={12 + i * 11} fill="none" stroke={color} strokeWidth="1" transform="rotate(35)" />
        ))}
        {rings.map(i => (
          <ellipse key={'r2' + i} rx={20 + i * 17} ry={12 + i * 11} fill="none" stroke={color} strokeWidth="1" transform="rotate(-35)" />
        ))}
      </g>
    </svg>
  );
}
