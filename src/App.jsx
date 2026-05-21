/* eslint-disable */
// StyleLock — main app shell with view router + tweak-driven accents

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#B23A2E",
  "accentName": "Crimson"
}/*EDITMODE-END*/;

const ACCENT_PALETTES = [
  { name: "Crimson",   value: "#B23A2E", hover: "#8E2D24" },
  { name: "Ink Blue",  value: "#1F3D6F", hover: "#172F58" },
  { name: "Forest",    value: "#2B5A3F", hover: "#1F4530" },
  { name: "Bronze",    value: "#8B5A2B", hover: "#6F451F" },
  { name: "Plum",      value: "#5C2A4C", hover: "#421E37" },
  { name: "Charcoal",  value: "#2A2A2A", hover: "#161412" }
];

const App = () => {
  const [view, setView] = React.useState("hub"); // landing page
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent CSS variables on tweak change
  React.useEffect(() => {
    const accent = t.accent || "#B23A2E";
    const found = ACCENT_PALETTES.find(p => p.value.toLowerCase() === accent.toLowerCase());
    const hover = found ? found.hover : darken(accent, 0.15);
    const soft = hexWithAlpha(accent, 0.10);
    const ring = hexWithAlpha(accent, 0.18);

    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-2", hover);
    document.documentElement.style.setProperty("--accent-soft", soft);
    document.documentElement.style.setProperty("--accent-ring", ring);
  }, [t.accent]);

  let viewEl = null;
  if (view === "hub")        viewEl = <Hub setView={setView} />;
  if (view === "formatter")  viewEl = <Formatter />;
  if (view === "references") viewEl = <References />;
  if (view === "addin")      viewEl = <AddIn />;

  const titles = {
    hub:        { eyebrow: "Dashboard", title: "Editorial hub" },
    formatter:  { eyebrow: "Document",  title: "Manuscript formatter" },
    references: { eyebrow: "Quick tool", title: "References · APA 7" },
    addin:      { eyebrow: "Integration", title: "Word add-in" }
  };

  return (
    <>
      <div className="app-shell">
        <Sidebar view={view} setView={setView} />

        {/* Top bar */}
        <div className="app-topbar">
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.12em" }}>
              {titles[view].eyebrow}
            </span>
            <span className="font-display" style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              {titles[view].title}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "5px 12px", borderRadius: 6,
            background: "var(--paper-2)", border: "1px solid var(--rule)",
            color: "var(--ink-3)", fontSize: 12, width: 220,
            cursor: "text"
          }}>
            <Icon name="search" size={13} />
            <span style={{ flex: 1 }}>Search manuscripts…</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "1px 5px", background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 3 }}>⌘K</span>
          </div>

          <StatusBadge tone="ok">Engine v1.4.2</StatusBadge>
        </div>

        {/* Main view */}
        <main className="app-main">
          {viewEl}
        </main>
      </div>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent color">
          <div style={{ fontSize: 12, color: "#888", marginBottom: 10, lineHeight: 1.5 }}>
            Editorial single-accent. Tap a swatch to change the entire suite.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {ACCENT_PALETTES.map(p => {
              const isActive = (t.accent || "").toLowerCase() === p.value.toLowerCase();
              return (
                <button key={p.value}
                  onClick={() => setTweak({ accent: p.value, accentName: p.name })}
                  style={{
                    padding: "10px 8px",
                    borderRadius: 6,
                    background: isActive ? "#222" : "#1a1a1a",
                    border: `1px solid ${isActive ? p.value : "#333"}`,
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
                    transition: "all 120ms ease"
                  }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4,
                    background: p.value,
                    border: "1px solid rgba(255,255,255,0.1)"
                  }} />
                  <span style={{ fontSize: 11, color: "#eee", fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontSize: 9, color: "#666", fontFamily: "ui-monospace, monospace" }}>{p.value}</span>
                </button>
              );
            })}
          </div>
        </TweakSection>

        <TweakSection label="Active screen">
          <TweakRadio
            value={view}
            onChange={setView}
            options={[
              { value: "hub", label: "Hub" },
              { value: "formatter", label: "Formatter" }
            ]}
          />
          <div style={{ height: 8 }} />
          <TweakRadio
            value={view}
            onChange={setView}
            options={[
              { value: "references", label: "References" },
              { value: "addin", label: "Word" }
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

// ---- Color helpers ----
function hexWithAlpha(hex, alpha) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function darken(hex, amt) {
  const c = hex.replace("#", "");
  let r = parseInt(c.substring(0, 2), 16);
  let g = parseInt(c.substring(2, 4), 16);
  let b = parseInt(c.substring(4, 6), 16);
  r = Math.max(0, Math.round(r * (1 - amt)));
  g = Math.max(0, Math.round(g * (1 - amt)));
  b = Math.max(0, Math.round(b * (1 - amt)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
