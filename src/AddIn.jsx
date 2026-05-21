/* eslint-disable */
// Word Add-in view — preview the task pane that lives inside Microsoft Word

const ADDIN_PARAS = [
  { text: "Community Resilience and Digital Connectivity…", currentStyle: "Title", suggested: "Title", confidence: 1.0 },
  { text: "Suriyati Ujang¹*, Aisyah binti Rahman¹, Mohd Faiz Hassan²", currentStyle: "Normal", suggested: "Author", confidence: 0.96 },
  { text: "¹Faculty of Social Sciences, Universiti Teknologi MARA…", currentStyle: "Normal", suggested: "Affiliation", confidence: 0.94 },
  { text: "ABSTRACT", currentStyle: "Heading 1", suggested: "Abs-Title", confidence: 1.0 },
  { text: "This study examines how rural Malaysian communities…", currentStyle: "Normal", suggested: "Abstract", confidence: 0.99 },
  { text: "Keywords: rural resilience, digital divide…", currentStyle: "Normal", suggested: "Keywords", confidence: 1.0 },
  { text: "1. Introduction", currentStyle: "Heading 1", suggested: "Heading A", confidence: 0.97 },
  { text: "The pandemic accelerated a shift toward digital mediation…", currentStyle: "Normal", suggested: "Main Text", confidence: 1.0 },
];

const AddIn = () => {
  const [active, setActive] = React.useState(3);
  const [toast, setToast]   = React.useState(null);
  const [tab, setTab]       = React.useState("classify");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--paper)", overflow: "hidden" }}>

      {/* Header strip */}
      <div style={{ padding: "28px 40px 24px", borderBottom: "1px solid var(--rule)", background: "var(--surface)" }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Word add-in</div>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.01em", margin: 0 }}>
          Inside Word <em style={{ fontStyle: "italic", color: "var(--accent)" }}>· task pane preview</em>
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-2)", margin: "6px 0 0", maxWidth: 580 }}>
          StyleLock surfaces as a right-rail task pane in Microsoft Word — classify each paragraph in place, accept suggestions one at a time, and apply the GADING style without leaving the document.
        </p>
      </div>

      {/* Word mock — document on the left, task pane on the right */}
      <div style={{ flex: 1, display: "flex", padding: 40, gap: 24, justifyContent: "center", overflow: "auto", background: "var(--paper)" }} className="scroll-paper">

        {/* Word window mock */}
        <div style={{
          width: 1100, height: "fit-content", minHeight: 700,
          background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 8,
          boxShadow: "var(--shadow-paper)", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1fr 360px", gridTemplateRows: "auto 1fr"
        }}>
          {/* Word title bar */}
          <div style={{
            gridColumn: "1 / 3",
            height: 32, background: "#F3F2F1",
            borderBottom: "1px solid #D5D4D3",
            display: "flex", alignItems: "center", padding: "0 12px",
            fontFamily: "var(--font-ui)", fontSize: 12, color: "#252525",
            gap: 12, position: "relative"
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
            </div>
            <div style={{ flex: 1, textAlign: "center", color: "#5B5B5B" }}>
              Ujang-2026-Community-Resilience.docx — Word
            </div>
          </div>

          {/* Word ribbon */}
          <div style={{
            gridColumn: "1 / 3",
            height: 0
          }} />

          {/* Document area */}
          <div style={{
            background: "#FAF9F7",
            padding: "32px 24px",
            overflow: "hidden",
            borderRight: "1px solid var(--rule)"
          }}>
            <div style={{
              background: "#fff",
              border: "1px solid #E8E6E1",
              padding: "32pt 38pt",
              minHeight: 560,
              fontFamily: "var(--font-doc)",
              maxWidth: 540, margin: "0 auto",
              boxShadow: "0 1px 0 rgba(0,0,0,0.04)"
            }}>
              {ADDIN_PARAS.map((p, i) => (
                <div key={i}
                  onClick={() => setActive(i)}
                  style={{
                    padding: "4px 6px",
                    marginBottom: i === 2 || i === 5 ? 16 : 8,
                    background: active === i ? "rgba(178,58,46,0.06)" : "transparent",
                    borderLeft: active === i ? "2px solid var(--accent)" : "2px solid transparent",
                    paddingLeft: 8,
                    cursor: "pointer",
                    fontSize: i === 0 ? "13pt" : (i === 3 ? "10pt" : "10pt"),
                    fontWeight: i === 0 || i === 3 || i === 6 ? 700 : 400,
                    textAlign: i === 0 || i === 1 || i === 2 ? "center" : "left",
                    fontStyle: i === 2 ? "italic" : (i === 4 ? "italic" : "normal"),
                    color: i === 2 ? "var(--accent)" : "var(--ink)",
                    lineHeight: 1.5,
                    transition: "all 100ms ease"
                  }}>
                  {p.text}
                </div>
              ))}
            </div>
          </div>

          {/* StyleLock task pane */}
          <div style={{ background: "var(--surface-2)", borderLeft: "1px solid var(--rule)", display: "flex", flexDirection: "column" }}>

            {/* Pane header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: 10, background: "var(--surface)" }}>
              <BrandMark size={22} />
              <div style={{ flex: 1 }}>
                <div className="font-display" style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.1 }}>StyleLock</div>
                <div style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>v 1.4.2</div>
              </div>
              <span className="dot dot-ok pulse-dot" title="Connected" />
            </div>

            {/* Tab strip */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--rule)" }}>
              {[
                { k: "classify", label: "Classify", count: 8 },
                { k: "rules",    label: "Rules",    count: null },
                { k: "history",  label: "Log",      count: null }
              ].map(t => (
                <button key={t.k}
                  onClick={() => setTab(t.k)}
                  style={{
                    flex: 1, padding: "10px 8px",
                    background: "transparent", border: "none",
                    borderBottom: tab === t.k ? "2px solid var(--accent)" : "2px solid transparent",
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase",
                    color: tab === t.k ? "var(--ink)" : "var(--ink-3)",
                    cursor: "pointer", transition: "all 100ms ease"
                  }}>
                  {t.label}{t.count != null && <span style={{ marginLeft: 6, color: "var(--ink-4)" }}>{t.count}</span>}
                </button>
              ))}
            </div>

            {tab === "classify" && (
              <>
                {/* Current paragraph */}
                <div style={{ padding: 16, borderBottom: "1px solid var(--rule)" }}>
                  <div className="label-mono" style={{ fontSize: 9.5, marginBottom: 8 }}>Active paragraph · ¶{active + 1}</div>
                  <div style={{
                    fontFamily: "var(--font-doc)", fontSize: 11.5, lineHeight: 1.5,
                    color: "var(--ink)", padding: "10px 12px",
                    background: "var(--paper)", border: "1px solid var(--rule)",
                    borderRadius: 4,
                    maxHeight: 110, overflow: "hidden",
                    position: "relative"
                  }}>
                    {ADDIN_PARAS[active].text}
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <div className="label-mono" style={{ fontSize: 9.5, marginBottom: 6 }}>Current style</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <span style={{ color: "var(--ink-3)" }}>{ADDIN_PARAS[active].currentStyle}</span>
                      <Icon name="arrow-right" size={11} className="" />
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600,
                        color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase",
                        padding: "2px 6px", background: "var(--accent-soft)",
                        border: "1px solid rgba(178,58,46,0.30)", borderRadius: 3
                      }}>
                        {ADDIN_PARAS[active].suggested}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 5 }}>
                      <span className="label-mono" style={{ fontSize: 9.5 }}>Confidence</span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
                        {Math.round(ADDIN_PARAS[active].confidence * 100)}%
                      </span>
                    </div>
                    <div style={{ height: 3, background: "var(--paper-2)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${ADDIN_PARAS[active].confidence * 100}%`,
                        background: "var(--accent)", borderRadius: 99
                      }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                    <button
                      className="btn btn-accent btn-sm"
                      style={{ flex: 1, height: 30 }}
                      onClick={() => {
                        setToast(`Applied style "${ADDIN_PARAS[active].suggested}" to ¶${active + 1}`);
                        if (active < ADDIN_PARAS.length - 1) setActive(active + 1);
                      }}>
                      <Icon name="check" size={12} />
                      Apply
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ height: 30 }} onClick={() => active < ADDIN_PARAS.length - 1 && setActive(active + 1)}>
                      Skip
                    </button>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ width: "100%", marginTop: 6, justifyContent: "center", height: 26 }}
                    onClick={() => setToast("Marked for review")}>
                    Mark for review
                  </button>
                </div>

                {/* Queue */}
                <div style={{ padding: 16, flex: 1, overflow: "auto" }} className="scroll-paper">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                    <span className="label-mono" style={{ fontSize: 9.5 }}>Document queue</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)" }}>{active + 1} / {ADDIN_PARAS.length}</span>
                  </div>

                  {ADDIN_PARAS.map((p, i) => (
                    <div key={i}
                      onClick={() => setActive(i)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 8px",
                        background: active === i ? "var(--surface)" : "transparent",
                        border: `1px solid ${active === i ? "var(--rule-3)" : "transparent"}`,
                        borderRadius: 4,
                        cursor: "pointer",
                        marginBottom: 2,
                        transition: "all 100ms ease"
                      }}
                      onMouseOver={e => { if (active !== i) e.currentTarget.style.background = "var(--paper-2)"; }}
                      onMouseOut={e => { if (active !== i) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{
                        width: 18, height: 18, borderRadius: 3,
                        background: i < active ? "var(--ok-soft)" : (i === active ? "var(--accent-soft)" : "var(--paper-2)"),
                        color: i < active ? "var(--ok)" : (i === active ? "var(--accent)" : "var(--ink-4)"),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600,
                        flexShrink: 0
                      }}>
                        {i < active ? <Icon name="check" size={9} /> : (i + 1)}
                      </span>
                      <span style={{
                        flex: 1, fontSize: 11, color: "var(--ink-2)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                      }}>
                        {p.text}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--ink-3)",
                        letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0
                      }}>
                        {p.suggested.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ padding: 12, borderTop: "1px solid var(--rule)", background: "var(--surface)" }}>
                  <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", height: 32 }}>
                    Apply all suggestions
                  </button>
                </div>
              </>
            )}

            {tab === "rules" && <RulesTab />}
            {tab === "history" && <HistoryTab />}

          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

const RulesTab = () => (
  <div style={{ padding: 16, flex: 1, overflow: "auto" }} className="scroll-paper">
    <div className="label-mono" style={{ fontSize: 9.5, marginBottom: 10 }}>Active ruleset · GADING v2024.1</div>
    {[
      { name: "Title", rule: "17 pt · Bold · Centred · Title Case" },
      { name: "Author", rule: "11 pt · Centred · Comma-separated" },
      { name: "Affiliation", rule: "10 pt · Italic · Centred · Red" },
      { name: "Abstract", rule: "10 pt · Italic · Justified · ≤ 250 words" },
      { name: "Heading A", rule: "10 pt · Bold · Numbered · UPPERCASE" },
      { name: "Heading B", rule: "10 pt · Bold · Hanging 18 pt" },
      { name: "Main Text", rule: "10 pt · Justified · 18 pt indent" },
      { name: "Reference", rule: "10 pt · APA 7 · Hanging 18 pt" },
    ].map((r, i) => (
      <div key={i} style={{
        padding: "8px 10px", marginBottom: 4, borderRadius: 4,
        background: "var(--surface)", border: "1px solid var(--rule)"
      }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: "var(--ink)" }}>{r.name}</div>
        <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{r.rule}</div>
      </div>
    ))}
  </div>
);

const HistoryTab = () => (
  <div style={{ padding: 16, flex: 1, overflow: "auto" }} className="scroll-paper">
    <div className="label-mono" style={{ fontSize: 9.5, marginBottom: 10 }}>Session log</div>
    {[
      { t: "2 m ago", e: "Applied", det: 'Title → "Community Resilience and…"' },
      { t: "3 m ago", e: "Applied", det: "Author → ¶ 2" },
      { t: "3 m ago", e: "Skipped", det: "Affiliation suggestion (confidence 0.71)" },
      { t: "4 m ago", e: "Applied", det: "Abs-Title → ¶ 4" },
      { t: "5 m ago", e: "Opened",  det: "Ujang-2026-Community-Resilience.docx" },
    ].map((h, i) => (
      <div key={i} style={{ padding: "8px 0", borderBottom: i === 4 ? "none" : "1px solid var(--rule-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: h.e === "Applied" ? "var(--ok)" : (h.e === "Skipped" ? "var(--ink-3)" : "var(--ink)") }}>
            {h.e}
          </span>
          <span style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>{h.t}</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 2 }}>{h.det}</div>
      </div>
    ))}
  </div>
);

window.AddIn = AddIn;
