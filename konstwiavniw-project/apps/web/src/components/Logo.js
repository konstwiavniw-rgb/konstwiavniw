export default function Logo({ light = false, size = 30 }) {
  return (
    <div className="logo-row">
      <svg
        width={size}
        height={(size * 34) / 40}
        viewBox="0 0 40 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="24" width="9" height="10" rx="2" fill="#E3C766" />
        <rect x="11" y="16" width="9" height="18" rx="2" fill="#D8B84A" />
        <rect x="22" y="8" width="9" height="26" rx="2" fill="#C9A227" />
        <rect x="33" y="0" width="7" height="34" rx="2" fill="#9C7A16" />
      </svg>
      <span className="logo-word" style={light ? { color: "#fff" } : undefined}>
        KONSTWI<b>AVNIW</b>
      </span>
    </div>
  );
}
