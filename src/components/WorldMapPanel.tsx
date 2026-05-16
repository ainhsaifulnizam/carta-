export function WorldMapPanel() {
  return (
    <div className="landing-atlas">
      <div className="landing-atlas-bg" aria-hidden="true">
        <svg viewBox="0 0 900 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="landing-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cbdaeb" />
              <stop offset="100%" stopColor="#9aaec5" />
            </linearGradient>
            <linearGradient id="landing-land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4f7fb" />
              <stop offset="100%" stopColor="#dbe3ee" />
            </linearGradient>
          </defs>
          <rect width="900" height="560" fill="url(#landing-sea)" />
          <g fill="url(#landing-land)" stroke="#7d92ad" strokeWidth="1" strokeLinejoin="round">
            {/* Peninsular Malaysia */}
            <path d="M340 200 L400 170 L450 200 L470 260 L455 320 L420 360 L380 360 L355 320 L335 270 Z" />
            {/* Singapore tip */}
            <path d="M420 360 L440 365 L430 380 L415 375 Z" />
            {/* Sabah */}
            <path d="M580 220 L660 210 L720 240 L735 280 L700 310 L640 305 L595 280 Z" />
            {/* Sarawak */}
            <path d="M520 300 L600 290 L640 320 L650 360 L600 380 L530 370 L500 340 Z" />
            {/* Indonesia / Sumatra */}
            <path d="M200 280 L270 260 L320 290 L300 360 L240 380 L190 360 L170 320 Z" />
            {/* Java tip */}
            <path d="M260 420 L320 410 L360 430 L330 460 L280 450 Z" />
            {/* Thailand */}
            <path d="M300 100 L360 80 L400 110 L410 160 L380 200 L340 195 L310 160 Z" />
          </g>
          <g stroke="#9fb2c9" strokeWidth=".4" opacity=".4">
            <path d="M450 0 L450 560" />
            <path d="M0 280 L900 280" />
          </g>
        </svg>
      </div>

      <div className="landing-atlas-greeting">
        <div className="landing-greeting-tag">Civic ecosystem map</div>
        <div className="landing-greeting-h">12 NGOs · 4 funders · 3 partners</div>
        <div className="landing-coverage">
          <div className="landing-coverage-row">
            <span>Kuala Lumpur</span>
            <div className="landing-bar"><div className="landing-bar-fill" style={{ width: "92%", background: "#2ec59f" }} /></div>
            <span className="pct">92%</span>
          </div>
          <div className="landing-coverage-row">
            <span>Selangor</span>
            <div className="landing-bar"><div className="landing-bar-fill" style={{ width: "81%", background: "#2ec59f" }} /></div>
            <span className="pct">81%</span>
          </div>
          <div className="landing-coverage-row">
            <span>Penang</span>
            <div className="landing-bar"><div className="landing-bar-fill" style={{ width: "74%", background: "#f59e0b" }} /></div>
            <span className="pct">74%</span>
          </div>
          <div className="landing-coverage-row">
            <span>Sabah</span>
            <div className="landing-bar"><div className="landing-bar-fill" style={{ width: "46%", background: "#f43f5e" }} /></div>
            <span className="pct">46%</span>
          </div>
        </div>
        <div className="landing-legend">
          <span className="leg"><span className="dot" style={{ background: "#2563eb" }} />NGO</span>
          <span className="leg"><span className="dot" style={{ background: "#8b5cf6" }} />Funder</span>
          <span className="leg"><span className="dot" style={{ background: "#f59e0b" }} />Partner</span>
          <span className="leg"><span className="dot" style={{ background: "#10b981" }} />Company</span>
        </div>
      </div>

      {/* Pulsing pins on the Malaysian peninsula and Borneo */}
      <span className="landing-pin pin-ngo" style={{ left: "44%", top: "58%" }} title="NGO" />
      <span className="landing-pin pin-funder" style={{ left: "47%", top: "52%" }} title="Funder" />
      <span className="landing-pin pin-partner" style={{ left: "41%", top: "42%" }} title="Partner" />
      <span className="landing-pin pin-company" style={{ left: "45%", top: "65%" }} title="Company" />
      <span className="landing-pin pin-ngo" style={{ left: "70%", top: "47%" }} title="NGO · Sabah" />
      <span className="landing-pin pin-ngo" style={{ left: "60%", top: "60%" }} title="NGO · Sarawak" />

      <div className="landing-floating-cards">
        <div className="landing-fc">
          <div className="landing-fc-label">Network coverage</div>
          <div className="landing-fc-num">28 partners</div>
          <div className="landing-fc-sub">9 pending follow-ups</div>
        </div>
        <div className="landing-fc">
          <div className="landing-fc-label">Partnership health</div>
          <div className="landing-fc-num" style={{ color: "#1ea282" }}>82%</div>
          <div className="landing-fc-sub">Healthy this quarter</div>
        </div>
        <div className="landing-fc">
          <div className="landing-fc-label">Programmes</div>
          <div className="landing-fc-num" style={{ color: "#5a47c9" }}>6</div>
          <div className="landing-fc-sub">Active in 2026</div>
        </div>
      </div>
    </div>
  );
}
