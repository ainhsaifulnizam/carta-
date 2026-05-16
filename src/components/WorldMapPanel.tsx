export function WorldMapPanel() {
  return (
    <div className="hero-panel top-nav">
      <div className="network-map" aria-label="Civic ecosystem map preview">
        <svg viewBox="0 0 900 560" role="img" aria-label="World map outline">
          <defs>
            <pattern id="landing-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#dbe6f4" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="900" height="560" fill="url(#landing-grid)" />
          <g fill="none" stroke="#9fb2c9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <path d="M144 177l46-33 61 8 35 33-13 47 27 31-15 44-57 16-34-27-43 8-38-31 14-45-25-24 42-27z" />
            <path d="M298 136l57-35 73 18 32 54-18 48 34 42-30 55-65 18-43-42-48 4-28-45 26-46-21-28 31-43z" />
            <path d="M548 160l64-44 92 22 52 50-32 49 45 38-16 55-76 15-54-32-63 12-52-46 16-58-33-28 57-33z" />
            <path d="M701 365l58-20 50 24 18 45-37 38-64-4-42-35 17-48z" />
          </g>
          <g fill="#2563eb">
            <circle cx="618" cy="280" r="7" />
            <circle cx="676" cy="242" r="7" />
            <circle cx="430" cy="205" r="7" />
            <circle cx="230" cy="274" r="7" />
          </g>
        </svg>
        <div className="floating-insight">
          <strong>Every event makes the map smarter.</strong>
          <span>Profiles, registrations, and relationships compound into reusable civic intelligence.</span>
        </div>
      </div>
    </div>
  );
}
