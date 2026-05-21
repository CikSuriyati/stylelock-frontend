/* eslint-disable */
// Hub view — editorial dashboard / module launcher

const ACTIVITY = [
  { id: "MS-2026-118", title: "Community Resilience and Digital Connectivity…", author: "Ujang, S.", status: "in-review",  time: "2 min ago" },
  { id: "MS-2026-117", title: "Heritage Tourism Recovery in Penang",            author: "Tan, P. L.",   status: "formatted",  time: "23 min ago" },
  { id: "MS-2026-116", title: "Code-Switching in Bilingual Classrooms",         author: "Rahman, A.",   status: "needs-edit", time: "1 h ago" },
  { id: "MS-2026-115", title: "Inter-Generational Wealth Transfer in Sabah",    author: "Yusof, R.",    status: "formatted",  time: "3 h ago" },
  { id: "MS-2026-114", title: "Adoption of Cashless Payments Among MSMEs",      author: "Chen, L.",     status: "formatted",  time: "yesterday" },
];

const Hub = ({ setView }) => {
  return (
    <div className="scroll-paper" style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 40px 80px" }}>

        {/* Eyebrow + headline */}
        <div className="fade-up" style={{ marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>GADING Journal · Editorial Suite</div>
          <h1 className="font-display" style={{
            fontSize: 56, lineHeight: 1.05, fontWeight: 400,
            margin: 0, letterSpacing: "-0.02em", color: "var(--ink)",
            maxWidth: 820
          }}>
            Editorial-grade formatting,<br/>
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>locked in</em> before review.
          </h1>
          <p style={{
            marginTop: 18, fontSize: 16, lineHeight: 1.6, color: "var(--ink-2)",
            maxWidth: 620
          }}>
            StyleLock enforces the GADING house style on every submission — paragraph by paragraph, reference by reference — so your editorial board can focus on substance, not margins.
          </p>
        </div>

        {/* Stats strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0, marginBottom: 48,
          borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)"
        }}>
          {[
            { v: "1,284", l: "Manuscripts processed" },
            { v: "97.3%", l: "Compliance rate" },
            { v: "6.4 h", l: "Avg. saved per issue" },
            { v: "Vol. 22", l: "Active issue" }
          ].map((s, i) => (
            <div key={i} style={{
              padding: "20px 24px",
              borderLeft: i === 0 ? "none" : "1px solid var(--rule)"
            }}>
              <div className="font-display" style={{ fontSize: 30, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em" }}>{s.v}</div>
              <div className="label-mono" style={{ marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Module cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 16, marginBottom: 56 }}>

          {/* Primary: Formatter */}
          <ModuleCard
            primary
            onClick={() => setView("formatter")}
            badge="Primary tool"
            title="Manuscript Formatter"
            desc="Full-document DOCX engine. Apply the GADING style guide to any submission and resolve every paragraph in a side-by-side editor."
            cta="Open editor"
            stat={{ v: "23", l: "in queue" }}
          />

          <ModuleCard
            onClick={() => setView("references")}
            badge="Quick tool"
            title="APA 7th References"
            desc="Paste a reference list, get a formatted, validated APA 7 output with hanging indents and DOI links."
            cta="Format references"
            stat={{ v: "412", l: "this month" }}
          />

          <ModuleCard
            onClick={() => setView("addin")}
            badge="Word add-in"
            title="Inside Word"
            desc="The same engine, surfaced as a task pane inside Microsoft Word for in-place formatting."
            cta="Preview pane"
            stat={{ v: "v1.4.2", l: "current" }}
          />

        </div>

        {/* Recent activity */}
        <section>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: "-0.01em" }}>
              Recent activity
            </h2>
            <span className="label-mono">Last 24 hours</span>
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "120px 1fr 160px 140px 90px",
              padding: "10px 20px", borderBottom: "1px solid var(--rule)",
              background: "var(--surface-2)"
            }}>
              {["ID", "Manuscript", "Author", "Status", "Updated"].map(h => (
                <div key={h} className="label-mono" style={{ fontSize: 10 }}>{h}</div>
              ))}
            </div>
            {ACTIVITY.map((row, i) => (
              <div key={row.id} style={{
                display: "grid", gridTemplateColumns: "120px 1fr 160px 140px 90px",
                padding: "14px 20px",
                borderBottom: i === ACTIVITY.length - 1 ? "none" : "1px solid var(--rule-2)",
                alignItems: "center",
                fontSize: 13,
                cursor: "pointer",
                transition: "background 120ms ease"
              }}
                onMouseOver={e => e.currentTarget.style.background = "var(--surface-2)"}
                onMouseOut={e => e.currentTarget.style.background = "transparent"}
                onClick={() => setView("formatter")}
              >
                <span className="font-mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{row.id}</span>
                <span style={{ color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 24 }}>
                  <em style={{ fontStyle: "italic", fontFamily: "var(--font-display)" }}>{row.title}</em>
                </span>
                <span style={{ color: "var(--ink-2)" }}>{row.author}</span>
                <StatusPill status={row.status} />
                <span style={{ color: "var(--ink-3)", fontSize: 12 }}>{row.time}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

// -- Module card --
const ModuleCard = ({ primary, badge, title, desc, cta, stat, onClick }) => (
  <div
    className="card"
    onClick={onClick}
    style={{
      padding: 24,
      cursor: "pointer",
      transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
      background: primary ? "var(--ink)" : "var(--surface)",
      color: primary ? "#fff" : "var(--ink)",
      borderColor: primary ? "var(--ink)" : "var(--rule)",
      display: "flex", flexDirection: "column",
      minHeight: 220, position: "relative", overflow: "hidden"
    }}
    onMouseOver={e => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "var(--shadow-paper)";
    }}
    onMouseOut={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "var(--shadow-card)";
    }}
  >
    {/* Accent strip on primary */}
    {primary && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--accent)" }} />}

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: primary ? "rgba(255,255,255,0.55)" : "var(--ink-3)"
      }}>{badge}</span>
      <Icon name="arrow-right" size={16} className="module-arrow" />
    </div>

    <h3 className="font-display" style={{
      fontSize: 26, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em",
      margin: "0 0 10px"
    }}>{title}</h3>

    <p style={{
      fontSize: 13, lineHeight: 1.55,
      color: primary ? "rgba(255,255,255,0.65)" : "var(--ink-2)",
      margin: 0, flex: 1
    }}>{desc}</p>

    <div style={{
      marginTop: 24, paddingTop: 16,
      borderTop: `1px solid ${primary ? "rgba(255,255,255,0.10)" : "var(--rule-2)"}`,
      display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      <span style={{
        fontSize: 13, fontWeight: 500,
        color: primary ? "var(--accent)" : "var(--ink)",
        display: "inline-flex", alignItems: "center", gap: 6
      }}>
        {cta}
      </span>
      <div style={{ textAlign: "right" }}>
        <div className="font-display" style={{
          fontSize: 18, fontWeight: 500,
          color: primary ? "#fff" : "var(--ink)",
          letterSpacing: "-0.01em"
        }}>{stat.v}</div>
        <div style={{
          fontSize: 10, fontFamily: "var(--font-mono)",
          letterSpacing: "0.10em", textTransform: "uppercase",
          color: primary ? "rgba(255,255,255,0.40)" : "var(--ink-3)"
        }}>{stat.l}</div>
      </div>
    </div>
  </div>
);

// -- Status pill --
const StatusPill = ({ status }) => {
  const map = {
    "in-review":   { tone: "info", label: "In Review",  bg: "var(--accent-soft)", color: "var(--accent)" },
    "formatted":   { tone: "ok",   label: "Formatted",  bg: "var(--ok-soft)",     color: "var(--ok)" },
    "needs-edit":  { tone: "warn", label: "Needs Edit", bg: "var(--warn-soft)",   color: "var(--warn)" }
  };
  const s = map[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px", borderRadius: 99,
      background: s.bg, color: s.color,
      fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 500,
      letterSpacing: "0.08em", textTransform: "uppercase",
      width: "fit-content"
    }}>
      <span className="dot" style={{ background: s.color }} />
      {s.label}
    </span>
  );
};

window.Hub = Hub;
