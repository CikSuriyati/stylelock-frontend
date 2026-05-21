/* eslint-disable */
// Sidebar — fixed icon rail + top brand mark

const Sidebar = ({ view, setView }) => {
  const items = [
    { key: "hub",        label: "Hub",       icon: "dashboard" },
    { key: "formatter",  label: "Formatter", icon: "doc" },
    { key: "references", label: "References", icon: "book" },
    { key: "addin",      label: "Word Add-in", icon: "word" }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand mark */}
      <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--rule)" }}>
        <BrandMark size={28} />
      </div>

      {/* Nav icons */}
      <div style={{ padding: "14px 0", display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(it => (
          <div
            key={it.key}
            className={`side-icon ${view === it.key ? "is-active" : ""}`}
            onClick={() => setView(it.key)}
            title={it.label}
          >
            <Icon name={it.icon} size={18} />
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom — settings + avatar */}
      <div style={{ padding: "0 0 14px 0", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
        <div className="side-icon" title="Settings">
          <Icon name="settings" size={18} />
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "var(--paper-2)", border: "1px solid var(--rule)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
          color: "var(--ink-2)",
          marginTop: 6
        }}>SU</div>
      </div>
    </aside>
  );
};

window.Sidebar = Sidebar;
