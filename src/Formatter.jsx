/* eslint-disable */
// Formatter view — side-by-side editor (source ↔ formatted preview)

// =====================================================================
// Pagination helper — estimate paragraph heights and split into A4 pages.
// Returns Array<Array<{ para, idx, style }>>
// =====================================================================
// Page-budget tuned for B5 paper after margins. B5 content height ≈ 22.4cm = ~635pt
function estimateParaHeight(para, style) {
  const text = para.text || "";

  if (style === "Image Placeholder") return 110;
  if (style === "Table Placeholder") {
    const rows = (para.props && para.props.table_data && para.props.table_data.length) || (para.props && para.props.rows) || 4;
    return 36 + rows * 18;
  }
  if (style === "Equation") return 28;

  // Estimate lines from char count. B5 text column ~ 15cm = ~425pt wide.
  // At 9pt TNR, ~5pt per char → ~85 chars/line for justified body.
  let cpl, lh, margin;
  switch (style) {
    case "Title":             cpl = 50;  lh = 22; margin = 16; break;
    case "Author":            cpl = 70;  lh = 17; margin = 10; break;
    case "Affiliation":       cpl = 95;  lh = 12; margin = 2;  break;
    case "Abstract":          cpl = 75;  lh = 13; margin = 6;  break;
    case "Keywords":          cpl = 80;  lh = 13; margin = 6;  break;
    case "Heading A":         cpl = 60;  lh = 14; margin = 26; break;
    case "Heading B":         cpl = 72;  lh = 14; margin = 14; break;
    case "Heading C":         cpl = 72;  lh = 14; margin = 14; break;
    case "Main Text":
    case "Main Text [Heading A]":
    case "Main Text [Heading B]":
                              cpl = 85;  lh = 13; margin = 6;  break;
    case "Reference":         cpl = 90;  lh = 13; margin = 9;  break;
    case "Caption B":         cpl = 90;  lh = 12; margin = 12; break;
    case "Table Caption":     cpl = 100; lh = 10; margin = 12; break;
    case "Footnote":          cpl = 105; lh = 10; margin = 4;  break;
    default:                  cpl = 85;  lh = 13; margin = 6;
  }
  const lines = Math.max(1, Math.ceil(text.length / cpl));
  return lines * lh + margin;
}

// pageBudgets: { first, rest } in pt
function paginate(items, styleFn, opts = {}) {
  const pageBudget = opts.pageBudget || 700;
  const firstPageBudget = opts.firstPageBudget || pageBudget;
  const filter = opts.filter || null;

  const pages = [[]];
  let used = 0;
  let pIdx = 0;

  items.forEach((para, i) => {
    if (filter && !filter(para)) return;
    const style = styleFn ? styleFn(i, para) : para.style;
    const h = estimateParaHeight(para, style);
    const cap = pIdx === 0 ? firstPageBudget : pageBudget;
    if (used + h > cap && pages[pIdx].length > 0) {
      pages.push([]);
      pIdx++;
      used = 0;
    }
    pages[pIdx].push({ para, idx: i, style });
    used += h;
  });

  return pages;
}

const Formatter = () => {
  const [paras, setParas]               = React.useState(window.SOURCE_PARAS);
  const [styleOverrides, setOverrides]  = React.useState({});
  const [rightMode, setRightMode]       = React.useState("output"); // 'output' | 'guide'
  const [focusMode, setFocusMode]       = React.useState(false);
  const [hoverIdx, setHoverIdx]         = React.useState(null);
  const [syncing, setSyncing]           = React.useState(false);
  const [toast, setToast]               = React.useState(null);
  const [showUpload, setShowUpload]     = React.useState(false);

  const setStyleAt = (i, s) => setOverrides(prev => ({ ...prev, [i]: s }));
  const getStyleAt = (i) => styleOverrides[i] || paras[i].style;

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setToast("Synced · GADING style applied to 36 paragraphs");
    }, 900);
  };

  const handleNewUpload = () => {
    setShowUpload(false);
    setToast("Manuscript loaded · 36 paragraphs detected");
  };

  const handleDownload = async () => {
    // Build a StructuredDocument from the UI's paragraph data
    const API_URL = window.STYLELOCK_API_URL || "https://stylelock-backend.onrender.com";
    const info = window.ARTICLE_INFO || {};

    const metadata = {
      title: null,
      authors: [],
      affiliations: [],
      abstract: null,
      keywords: null,
      journal: info.journal || "GADING Journal for the Social Sciences",
      volume: info.volume || null,
      issue: info.issue || null,
      year: info.year || null,
    };

    const blocks = [];
    paras.forEach((p, i) => {
      const style = getStyleAt(i);
      const text = p.text || "";

      // Front-matter → metadata
      if (style === "Title")       { metadata.title = text; return; }
      if (style === "Author")      { metadata.authors.push(text); return; }
      if (style === "Affiliation") { metadata.affiliations.push(text); return; }
      if (style === "Abstract")    { metadata.abstract = text; return; }

      // Body blocks
      if (style === "Heading A") {
        blocks.push({ type: "heading", level: "A", text });
      } else if (style === "Heading B") {
        blocks.push({ type: "heading", level: "B", text });
      } else if (style === "Heading C") {
        blocks.push({ type: "heading", level: "C", text });
      } else if (style === "Reference") {
        blocks.push({ type: "reference", raw: text });
      } else if (style === "Equation") {
        blocks.push({ type: "equation", text, number: (p.props && p.props.number) || null });
      } else if (style === "Table Placeholder" && p.props && p.props.table_data) {
        const rows = p.props.table_data;
        blocks.push({
          type: "table",
          header: rows.length > 0 ? rows[0] : [],
          rows: rows.length > 1 ? rows.slice(1) : [],
          caption: null,
        });
      } else if (style === "Image Placeholder") {
        blocks.push({ type: "figure", caption: text, src: null, alt: text });
      } else {
        blocks.push({ type: "paragraph", text, style: style || "Main Text" });
      }
    });

    const document = { metadata, blocks };

    try {
      setToast("Rendering .docx via backend...");
      const res = await fetch(`${API_URL}/render/docx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document, ruleset_name: "mjcet", use_template: true }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Render failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = "Ujang-2026-Community-Resilience.docx";
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setToast("Downloaded .docx · rendered from GADING template");
    } catch (e) {
      console.error("Backend DOCX render failed:", e);
      setToast("Download failed: " + e.message);
    }
  };

  const handlePdf = () => {
    // Print directly from the live preview pane — pixel-perfect parity with the web.
    // Browser print dialog → "Save as PDF" produces the PDF.
    document.body.classList.add("print-export");
    const cleanup = () => {
      document.body.classList.remove("print-export");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => {
      try { window.print(); } catch (e) { cleanup(); }
      // Some browsers don't fire afterprint reliably — failsafe
      setTimeout(cleanup, 2000);
    }, 100);
    setToast("Opening print dialog · choose ‘Save as PDF’");
  };

  // Stats
  const counts = React.useMemo(() => {
    let mismatched = 0;
    paras.forEach((p, i) => {
      if (p.originalStyle && p.originalStyle !== "Normal" && p.originalStyle !== getStyleAt(i)) mismatched++;
    });
    return { total: paras.length, mismatched, words: 4218 };
  }, [paras, styleOverrides]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--paper)" }}>

      {/* Sub-toolbar */}
      <FormatterToolbar
        filename="Ujang-2026-Community-Resilience.docx"
        onSync={handleSync}
        syncing={syncing}
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        onUpload={() => setShowUpload(true)}
        onDownload={handleDownload}
        onPdf={handlePdf}
        counts={counts}
      />

      {/* Two-pane workspace */}
      <div className="formatter-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--rule)", minHeight: 0 }}>

        {/* LEFT — Source editor */}
        <SourcePane
          paras={paras}
          getStyleAt={getStyleAt}
          setStyleAt={setStyleAt}
          hoverIdx={hoverIdx}
          setHoverIdx={setHoverIdx}
          focusMode={focusMode}
        />

        {/* RIGHT — Formatted preview / Guide */}
        <div className="print-target" style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
          <PreviewPane
            mode={rightMode}
            setMode={setRightMode}
            paras={paras}
            getStyleAt={getStyleAt}
            setStyleAt={setStyleAt}
          />
        </div>
      </div>

      {/* Bottom status bar */}
      <FormatterStatusBar counts={counts} />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onDone={handleNewUpload} />}
    </div>
  );
};

// =====================================================================
// Sub-toolbar
// =====================================================================
const FormatterToolbar = ({ filename, onSync, syncing, focusMode, setFocusMode, onUpload, onDownload, onPdf, counts }) => (
  <div className="formatter-toolbar" style={{
    height: 56,
    background: "var(--surface)",
    borderBottom: "1px solid var(--rule)",
    display: "flex", alignItems: "center", padding: "0 20px", gap: 16
  }}>
    {/* File info */}
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 32, height: 38,
        background: "var(--paper-2)",
        border: "1px solid var(--rule-3)",
        borderRadius: 2,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        paddingBottom: 4,
        position: "relative"
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 10, height: 10,
          background: "var(--surface)",
          borderLeft: "1px solid var(--rule-3)", borderBottom: "1px solid var(--rule-3)"
        }} />
        <span className="font-mono" style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.04em", color: "var(--ink-3)" }}>DOCX</span>
      </div>
      <div>
        <div className="font-display" style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)", lineHeight: 1.2 }}>
          {filename}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 2, fontSize: 11, color: "var(--ink-3)" }}>
          <span className="font-mono">MS-2026-118</span>
          <span>·</span>
          <span>{counts.words.toLocaleString()} words</span>
          <span>·</span>
          <span>{counts.total} paragraphs</span>
        </div>
      </div>
    </div>

    <div style={{ flex: 1 }} />

    {/* Focus mode */}
    <button
      onClick={() => setFocusMode(!focusMode)}
      className={`btn ${focusMode ? "btn-accent" : "btn-secondary"} btn-sm`}
      style={{ height: 30 }}
    >
      <Icon name="focus" size={13} />
      Focus
    </button>

    {/* Divider */}
    <div style={{ width: 1, height: 24, background: "var(--rule)" }} />

    {/* Actions */}
    <button onClick={onUpload} className="btn btn-ghost btn-sm" style={{ height: 30 }}>
      <Icon name="upload" size={13} />
      Replace
    </button>
    <button onClick={onSync} className="btn btn-secondary btn-sm" style={{ height: 30 }} disabled={syncing}>
      <Icon name="sync" size={13} className={syncing ? "spinning" : ""} />
      {syncing ? "Syncing…" : "Re-sync"}
    </button>
    <button onClick={onPdf} className="btn btn-secondary btn-sm" style={{ height: 30 }}>
      <Icon name="download" size={13} />
      PDF
    </button>
    <button onClick={onDownload} className="btn btn-accent btn-sm" style={{ height: 30 }}>
      <Icon name="download" size={13} />
      Download .docx
    </button>
  </div>
);

// =====================================================================
// Source pane (LEFT)
// =====================================================================
const SourcePane = ({ paras, getStyleAt, setStyleAt, hoverIdx, setHoverIdx, focusMode }) => (
  <div className="source-pane" style={{ background: "var(--paper)", display: "flex", flexDirection: "column", minHeight: 0 }}>

    {/* Pane header */}
    <PaneHeader
      eyebrow="01"
      title="Source"
      sub="Author submission"
      right={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="label-mono" style={{ fontSize: 9.5 }}>Hover a paragraph to assign its style</span>
        </div>
      }
    />

    {/* Mini ribbon */}
    <div style={{
      height: 36,
      borderBottom: "1px solid var(--rule)",
      background: "var(--surface-2)",
      display: "flex", alignItems: "center", padding: "0 16px", gap: 8
    }}>
      <RibbonGroup>
        <RibbonBtn icon="bold" />
        <RibbonBtn icon="italic" />
        <RibbonBtn icon="underline" />
      </RibbonGroup>
      <RibbonGroup>
        <RibbonBtn icon="align-left" />
        <RibbonBtn icon="align-center" />
        <RibbonBtn icon="align-justify" />
      </RibbonGroup>
      <div style={{ flex: 1 }} />
      <span className="label-mono" style={{ fontSize: 9.5 }}>Times New Roman · 9 pt</span>
    </div>

    {/* Paper container — paginated stack */}
    <div className="scroll-paper" style={{ flex: 1, overflow: "auto", padding: "32px 24px 64px", minHeight: 0 }}>
      <div className="pages-stack">
        {(() => {
          const pages = paginate(paras, (i) => getStyleAt(i), {
            pageBudget: 700,
            filter: (p) => !(focusMode && (p.style === "Image Placeholder" || p.style === "Table Placeholder"))
          });
          return pages.map((pageItems, pageIdx) => (
            <React.Fragment key={pageIdx}>
              {pageIdx > 0 && (
                <div className="page-break-label">
                  <span>Page {pageIdx + 1}</span>
                </div>
              )}
              <div className="a4-zoom">
                <div className="a4">
                  <div className="a4-content">
                    {pageItems.map(({ para, idx: i }) => {
                      const currentStyle = getStyleAt(i);
                      const isHovered = hoverIdx === i;
                      const isMismatch = para.originalStyle && para.originalStyle !== "Normal" && para.originalStyle !== currentStyle;

                      return (
                        <div
                          key={i}
                          onMouseEnter={() => setHoverIdx(i)}
                          onMouseLeave={() => setHoverIdx(null)}
                          style={{ position: "relative", marginBottom: 8 }}
                        >
                          {/* Hover chip rail */}
                          <div style={{
                            position: "absolute",
                            left: -76, top: 2,
                            width: 70,
                            display: "flex", justifyContent: "flex-end", alignItems: "center",
                            opacity: isHovered ? 1 : 0.35,
                            transition: "opacity 150ms ease"
                          }}>
                            <ParaStyleChip
                              value={currentStyle}
                              onChange={(v) => setStyleAt(i, v)}
                              mismatch={isMismatch}
                            />
                          </div>

                          {/* Mismatch indicator dot in margin */}
                          {isMismatch && (
                            <div style={{
                              position: "absolute",
                              left: -6, top: 8,
                              width: 4, height: 4, borderRadius: "50%",
                              background: "var(--accent)"
                            }} title={`Source had "${para.originalStyle}" — re-classified as "${currentStyle}"`} />
                          )}

                          <SourceParaContent para={para} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="page-num">— {pageIdx + 1} —</div>
                </div>
              </div>
            </React.Fragment>
          ));
        })()}
      </div>
    </div>
  </div>
);

// Renders a single source paragraph with proper visual but un-styled (raw author text style)
const SourceParaContent = ({ para }) => {
  // In source pane everything looks like author submission — uniform-ish, but headings still bold etc.
  const baseStyle = { fontFamily: "var(--font-doc)", color: "var(--ink)", lineHeight: 1.35 };

  if (para.style === "Image Placeholder") {
    return (
      <div style={{
        border: "1px dashed var(--rule-3)", borderRadius: 4,
        padding: "20px 14px", textAlign: "center",
        color: "var(--ink-3)", fontSize: 11, fontFamily: "var(--font-mono)",
        background: "var(--paper)"
      }}>{para.text}</div>
    );
  }

  if (para.style === "Table Placeholder") {
    return (
      <div style={{ border: "1px solid var(--rule)", borderRadius: 4, overflow: "hidden", margin: "4pt 0" }}>
        <div style={{ background: "var(--paper-2)", padding: "4px 8px", fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
          <span>Table · {para.props?.rows} rows</span>
        </div>
        {para.props?.table_data && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", fontFamily: "var(--font-doc)" }}>
            <tbody>
              {para.props.table_data.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} style={{
                      border: "1px solid var(--rule)",
                      padding: "4px 8px",
                      fontWeight: r === 0 ? 700 : 400
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // Reflect a HINT of the author's original styling. Author submitted text is
  // typically Word "Normal" with manual bolding/sizing, NOT the journal style.
  const author = {
    Title:        { fontSize: "14pt", fontWeight: 700, textAlign: "center" },
    Author:       { fontSize: "11pt", textAlign: "center" },
    Affiliation:  { fontSize: "10pt", fontStyle: "italic", textAlign: "center" },
    Abstract:     { fontSize: "10pt", fontStyle: "italic", textAlign: "justify" },
    "Heading A":  { fontSize: "12pt", fontWeight: 700 },
    "Heading B":  { fontSize: "11pt", fontWeight: 700 },
    "Heading C":  { fontSize: "11pt", fontStyle: "italic" },
    Reference:    { fontSize: "10pt" },
    "Caption B":     { fontSize: "10pt", fontStyle: "italic" },
    "Table Caption": { fontSize: "10pt", fontWeight: 700 },
    Equation:     { fontFamily: "var(--font-mono)", fontStyle: "italic", textAlign: "center" }
  };
  const extra = author[para.style] || {};

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      style={{ ...baseStyle, fontSize: "10pt", outline: "none", padding: "1px 2px", borderRadius: 2, ...extra }}
    >{para.text}</div>
  );
};

// =====================================================================
// Preview pane (RIGHT)
// =====================================================================
const PreviewPane = ({ mode, setMode, paras, getStyleAt, setStyleAt }) => {
  const renderList = mode === "output" ? paras : window.GADING_GUIDE;

  return (
    <div style={{ background: "var(--paper)", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <PaneHeader
        eyebrow="02"
        title={mode === "output" ? "Compliant output" : "MJCET style guide"}
        sub={mode === "output" ? "Locked to GADING" : "Reference — read-only"}
        right={
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "output", label: "Final" },
              { value: "guide", label: "Guide" }
            ]}
          />
        }
      />

      {/* Spacer to match LEFT ribbon height */}
      <div style={{ height: 36, borderBottom: "1px solid var(--rule)", background: "var(--surface-2)", display: "flex", alignItems: "center", padding: "0 16px" }}>
        <span className="label-mono" style={{ fontSize: 9.5 }}>
          {mode === "output" ? "GADING / UiTM template · A4 · v6.0" : "GADING house style · v6.0 ref."}
        </span>
        <div style={{ flex: 1 }} />
        {mode === "output" && (
          <span className="label-mono" style={{ fontSize: 9.5, color: "var(--ok)" }}>
            <span className="dot dot-ok" style={{ marginRight: 6 }} />
            Compliant
          </span>
        )}
      </div>

      <div className="scroll-paper" style={{ flex: 1, overflow: "auto", padding: "32px 24px 64px", minHeight: 0 }}>
        <div className="pages-stack">
          {(() => {
            const styleFn = (i, para) => mode === "output" ? getStyleAt(i) : para.style;
            const numbering = mode === "output" ? window.computeNumbering(renderList, styleFn) : {};

            // Front-matter paragraphs (rendered specially on page 1 in output mode)
            const FRONT_STYLES = new Set(["Title", "Author", "Affiliation", "Abstract"]);
            const bodyOnly = mode === "output"
              ? renderList.filter((p, i) => !FRONT_STYLES.has(styleFn(i, p)))
              : renderList;
            // Keep original indices for body items
            const bodyWithIdx = mode === "output"
              ? renderList.map((p, i) => ({ p, i })).filter(({ p, i }) => !FRONT_STYLES.has(styleFn(i, p)))
              : renderList.map((p, i) => ({ p, i }));

            // Paginate body
            const pageBudget = 555;       // ~B5 content height in pt, conservative
            const firstPageBudget = mode === "output" ? 220 : pageBudget;  // page 1 reserved for front-matter

            const pages = [[]];
            let used = 0, pIdx = 0;
            bodyWithIdx.forEach(({ p, i }) => {
              const style = styleFn(i, p);
              const h = estimateParaHeight(p, style);
              const cap = pIdx === 0 ? firstPageBudget : pageBudget;
              if (used + h > cap && pages[pIdx].length > 0) {
                pages.push([]);
                pIdx++;
                used = 0;
              }
              pages[pIdx].push({ para: p, idx: i, style });
              used += h;
            });

            const totalPages = pages.length;

            // Front matter elements (Title, Author, Affiliations + Article Info table)
            const titlePara = renderList.find((p, i) => styleFn(i, p) === "Title");
            const authorPara = renderList.find((p, i) => styleFn(i, p) === "Author");
            const affiliationParas = renderList.filter((p, i) => styleFn(i, p) === "Affiliation");
            const abstractPara = renderList.find((p, i) => styleFn(i, p) === "Abstract");

            return pages.map((pageItems, pageIdx) => (
              <React.Fragment key={pageIdx}>
                {pageIdx > 0 && (
                  <div className="page-break-label">
                    <span>Page {pageIdx + 1} of {totalPages}</span>
                  </div>
                )}
                <div className="a4-zoom">
                  <div className="a4">
                    <div className="a4-content">

                      {/* HEADER */}
                      {mode === "output" && pageIdx === 0 && <MjcetFirstPageHeader />}
                      {mode === "output" && pageIdx > 0 && <MjcetRunningHeader pageIdx={pageIdx} />}
                      {mode === "guide" && pageIdx === 0 && (
                        <div style={{ marginBottom: "14pt", paddingBottom: "8pt", borderBottom: "0.75pt solid var(--ink)" }}>
                          <div style={{ fontFamily: "var(--font-doc)", fontSize: "8pt", textAlign: "center", color: "var(--ink-2)" }}>MJCET / GADING Journal · Style guide reference · v6.0</div>
                        </div>
                      )}

                      {/* FRONT MATTER on page 1 in output mode */}
                      {mode === "output" && pageIdx === 0 && (
                        <FrontMatter
                          titlePara={titlePara}
                          authorPara={authorPara}
                          affiliationParas={affiliationParas}
                          abstractPara={abstractPara}
                          getStyleAt={setStyleAt}
                          renderList={renderList}
                          styleFn={styleFn}
                          setStyleAt={setStyleAt}
                        />
                      )}

                      {pageItems.map(({ para, idx: i, style }) => {
                        const num = numbering[i];
                        return (
                          <div key={i} style={{ position: "relative" }}>

                            {/* Style chip on left margin */}
                            {mode === "output" && (
                              <div style={{
                                position: "absolute",
                                left: -76, top: 0,
                            width: 70,
                                display: "flex", justifyContent: "flex-end",
                                zIndex: 2
                              }}>
                                <ParaStyleChip
                                  value={style}
                                  onChange={(v) => setStyleAt(i, v)}
                                  tone="ok"
                                  compact
                                />
                              </div>
                            )}
                            {mode === "guide" && (
                              <div style={{ position: "absolute", left: -76, top: 0, width: 70, display: "flex", justifyContent: "flex-end" }}>
                                <span className="style-chip is-accent" style={{ cursor: "default" }}>{style}</span>
                              </div>
                            )}

                            <DocParaContent para={para} style={style} number={num} />

                            {/* Spec annotation (guide mode) */}
                            {mode === "guide" && para.spec && (
                              <div style={{
                                marginTop: 2,
                                fontFamily: "var(--font-mono)",
                                fontSize: "7.5pt",
                                color: "var(--ink-3)",
                                letterSpacing: "0.02em"
                              }}>
                                {para.spec}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* FOOTER */}
                    {mode === "output" ? (
                      <MjcetFooter pageNum={pageIdx + 1} totalPages={totalPages} isFirstPage={pageIdx === 0} />
                    ) : (
                      <div className="page-num">— {pageIdx + 1} —</div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// MJCET front-matter pieces
// =====================================================================
const MjcetFirstPageHeader = () => (
  <div className="mjcet-first-page-header">
    <div className="mjcet-fph-grid">
      <div className="mjcet-fph-logo">
        <div className="gjss-img" role="img" aria-label="GJSS" />
        <div className="eissn" contentEditable suppressContentEditableWarning>e-ISSN: 2600-7568</div>
      </div>
      <div className="mjcet-fph-middle">
        <div className="available-block">
          <div className="available" contentEditable suppressContentEditableWarning>Available online at</div>
          <div className="url" contentEditable suppressContentEditableWarning>https://gadingssuitm.com/index.php/gadingss</div>
        </div>
        <div className="issue-ref" contentEditable suppressContentEditableWarning>GADING Journal for the Social Sciences 10(2) 2026, 1 – 12</div>
      </div>
      <div className="mjcet-fph-right">
        <div className="journal-name">GADING Journal for<br/>the Social Sciences</div>
      </div>
    </div>
  </div>
);

const MjcetRunningHeader = ({ pageIdx }) => {
  const isOdd = (pageIdx + 1) % 2 === 1;
  return (
    <div className="mjcet-running-header" style={{ textAlign: isOdd ? "left" : "right" }}
         contentEditable suppressContentEditableWarning>
      Ujang et al. / GADING Journal for the Social Sciences (2026) Vol. 10, No. 2
    </div>
  );
};

const MjcetFooter = ({ pageNum, totalPages, isFirstPage }) => (
  <div className="mjcet-doc-footer">
    {isFirstPage ? (
      <>
        <div>
          <div style={{ marginBottom: 4 }} contentEditable suppressContentEditableWarning>*Corresponding author. E-mail address: suriyati@uitm.edu.my</div>
          <div className="doi-line" contentEditable suppressContentEditableWarning>https://doi.org/{window.ARTICLE_INFO.doi}</div>
        </div>
        <div className="copyright" contentEditable suppressContentEditableWarning>©UiTM Press, Universiti Teknologi MARA</div>
      </>
    ) : (
      <>
        <div className="doi-line" contentEditable suppressContentEditableWarning>https://doi.org/{window.ARTICLE_INFO.doi}</div>
        <div className="copyright" contentEditable suppressContentEditableWarning>©UiTM Press, Universiti Teknologi MARA</div>
      </>
    )}
  </div>
);

const FrontMatter = ({ titlePara, authorPara, affiliationParas, abstractPara, renderList, styleFn, setStyleAt }) => {
  const findIdx = (target) => renderList.findIndex((p, i) => p === target);
  const titleIdx = titlePara ? findIdx(titlePara) : -1;
  const authorIdx = authorPara ? findIdx(authorPara) : -1;
  const abstractIdx = abstractPara ? findIdx(abstractPara) : -1;
  const info = window.ARTICLE_INFO;

  const chipRail = (idx, style) => (
    idx >= 0 && (
      <div style={{
        position: "absolute",
        left: -76, top: 0,
                            width: 70,
        display: "flex", justifyContent: "flex-end",
        zIndex: 2
      }}>
        <ParaStyleChip
          value={style}
          onChange={(v) => setStyleAt(idx, v)}
          tone="ok"
          compact
        />
      </div>
    )
  );

  return (
    <>
      {titlePara && (
        <div style={{ position: "relative" }}>
          {chipRail(titleIdx, "Title")}
          <p className="doc-text doc-style-title">{titlePara.text}</p>
        </div>
      )}
      {authorPara && (
        <div style={{ position: "relative" }}>
          {chipRail(authorIdx, "Author")}
          <p className="doc-text doc-style-author">{authorPara.text}</p>
        </div>
      )}
      {affiliationParas.map((aff, k) => {
        const idx = findIdx(aff);
        return (
          <div key={k} style={{ position: "relative" }}>
            {chipRail(idx, "Affiliation")}
            <p className="doc-text doc-style-affiliation">{aff.text}</p>
          </div>
        );
      })}

      {/* Article Info / Abstract 3-column table */}
      {abstractPara && (
        <div style={{ position: "relative", marginTop: "8pt" }}>
          {chipRail(abstractIdx, "Abstract")}
          <table className="article-info-table">
            <colgroup>
              <col className="col-info" />
              <col className="col-gutter" />
              <col className="col-abstract" />
            </colgroup>
            <tbody>
              <tr className="head">
                <td>Article info</td>
                <td></td>
                <td>Abstract</td>
              </tr>
              <tr className="body">
                <td>
                  <p className="article-info-label">Article history:</p>
                  {info.history.map(h => (
                    <p key={h.label} className="article-info-line">{h.label}: {h.date}</p>
                  ))}
                  <p className="article-info-label" style={{ marginTop: "8pt" }}>Keywords:</p>
                  {info.keywords.map(k => (
                    <p key={k} className="article-info-line">{k}</p>
                  ))}
                  <p className="article-info-line" style={{ marginTop: "8pt" }}>
                    DOI: {info.doi}
                  </p>
                </td>
                <td></td>
                <td>
                  <p className="doc-text doc-style-abstract">{abstractPara.text}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

// Render a doc paragraph with the proper MJCET style applied
const DocParaContent = ({ para, style, number }) => {
  if (para.style === "Image Placeholder") {
    return (
      <div style={{
        margin: "10pt 0", padding: "32pt 12pt",
        textAlign: "center",
        border: "1px dashed var(--rule-3)", borderRadius: 4,
        fontFamily: "var(--font-doc)", fontStyle: "italic",
        color: "var(--ink-3)", fontSize: "9pt"
      }}>
        Figure preserved · rendered at output
      </div>
    );
  }
  if (para.style === "Table Placeholder" && para.props?.table_data) {
    return (
      <table style={{
        width: "100%", borderCollapse: "collapse",
        fontFamily: "var(--font-doc)", fontSize: "8pt",   // Els-table-text = 8pt
        margin: "4pt 0",
        tableLayout: "fixed"
      }}>
        <tbody>
          {para.props.table_data.map((row, r) => (
            <tr key={r} style={{
              borderTop: r === 0 ? "0.75pt solid #000" : "none",
              borderBottom: r === 0 || r === para.props.table_data.length - 1 ? "0.75pt solid #000" : "none"
            }}>
              {row.map((cell, c) => (
                <td key={c} style={{
                  padding: "4pt 6pt",
                  fontWeight: r === 0 ? 700 : 400,
                  textAlign: r === 0 ? "left" : (c === 0 ? "left" : "left"),
                  lineHeight: "10pt",
                  verticalAlign: "top"
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Equation — left side italic equation, right side parenthesised number
  if (style === "Equation") {
    return (
      <p className="doc-text doc-style-equation">
        <span style={{ flex: 1, textAlign: "center" }}>{para.text}</span>
        <span className="eq-num">({para.props?.number || "1"})</span>
      </p>
    );
  }

  const styleClassMap = {
    "Title":                     "doc-style-title",
    "Author":                    "doc-style-author",
    "Affiliation":               "doc-style-affiliation",
    "Abs-Title":                 "doc-style-abs-title",
    "Abstract":                  "doc-style-abstract",
    "Keywords":                  "doc-style-keywords",
    "Heading A":                 "doc-style-heading-a",
    "Heading B":                 "doc-style-heading-b",
    "Heading C":                 "doc-style-heading-c",
    "Main Text":                 "doc-style-main-text",
    "Main Text [Heading A]":     "doc-style-main-text-after-heading",
    "Main Text [Heading B]":     "doc-style-main-text",
    "Reference":                 "doc-style-reference",
    "Caption B":                 "doc-style-caption-b",
    "Table Caption":             "doc-style-table-caption",
    "Footnote":                  "doc-style-footnote"
  };

  const cls = styleClassMap[style] || "doc-style-main-text";

  // Auto-numbering for Heading A / B — number inline at left margin, text follows
  if ((style === "Heading A" || style === "Heading B") && number) {
    return (
      <p className={`doc-text ${cls}`}>
        {number}{"\u2002"}{para.text}
      </p>
    );
  }

  return <p className={`doc-text ${cls}`}>{para.text}</p>;
};

// =====================================================================
// Sub-components
// =====================================================================
const PaneHeader = ({ eyebrow, title, sub, right }) => (
  <div style={{
    padding: "14px 20px",
    borderBottom: "1px solid var(--rule)",
    background: "var(--surface)",
    display: "flex", alignItems: "center", justifyContent: "space-between"
  }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      <span className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.12em" }}>
        {eyebrow}
      </span>
      <div>
        <div className="font-display" style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 1 }}>{sub}</div>
      </div>
    </div>
    {right}
  </div>
);

const RibbonGroup = ({ children }) => (
  <div style={{ display: "flex", gap: 2, paddingRight: 8, marginRight: 4, borderRight: "1px solid var(--rule)" }}>
    {children}
  </div>
);

const RibbonBtn = ({ icon }) => (
  <button style={{
    width: 26, height: 26, borderRadius: 4,
    border: "none", background: "transparent",
    color: "var(--ink-2)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 100ms ease"
  }}
    onMouseOver={e => { e.currentTarget.style.background = "var(--paper-2)"; e.currentTarget.style.color = "var(--ink)"; }}
    onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink-2)"; }}
  >
    <Icon name={icon} size={13} />
  </button>
);

const ParaStyleChip = ({ value, onChange, mismatch, tone, compact }) => {
  // Wrap a <select> as a chip
  const cls = `style-chip ${mismatch ? "is-accent" : (tone === "ok" ? "is-ok" : "")}`;
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cls}
        style={{ paddingRight: 12, minWidth: 50, maxWidth: 66 }}
      >
        {window.AVAILABLE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <style>{`
        select.style-chip {
          background-image: none !important;
        }
      `}</style>
    </div>
  );
};

// =====================================================================
// Status bar (bottom)
// =====================================================================
const FormatterStatusBar = ({ counts }) => (
  <div className="formatter-status-bar" style={{
    height: 28,
    background: "var(--surface)",
    borderTop: "1px solid var(--rule)",
    display: "flex", alignItems: "center", padding: "0 16px",
    fontSize: 11, color: "var(--ink-2)",
    fontFamily: "var(--font-mono)", letterSpacing: "0.06em"
  }}>
    <div style={{ display: "flex", gap: 18 }}>
      <span><span style={{ color: "var(--ink-3)" }}>Page</span> 1 / 9</span>
      <span><span style={{ color: "var(--ink-3)" }}>Paragraphs</span> {counts.total}</span>
      <span><span style={{ color: "var(--ink-3)" }}>Words</span> {counts.words.toLocaleString()}</span>
      {counts.mismatched > 0 && (
        <span style={{ color: "var(--accent)" }}>
          <span className="dot dot-info" style={{ marginRight: 6 }} />
          {counts.mismatched} re-classified
        </span>
      )}
    </div>
    <div style={{ flex: 1 }} />
    <div style={{ display: "flex", gap: 18 }}>
      <span className="font-mono" style={{ color: "var(--ink-3)" }}>English (Malaysia)</span>
      <span style={{ color: "var(--ok)" }}>
        <span className="dot dot-ok pulse-dot" style={{ marginRight: 6 }} />
        Engine connected
      </span>
    </div>
  </div>
);

// =====================================================================
// GADING document header (top of right pane paper)
// =====================================================================
const GadingDocHeader = () => (
  <div className="gading-header">
    <div className="gading-header-grid">
      <div style={{ textAlign: "center" }}>
        <img src="assets/gjss-logo.png" alt="GJSS" className="gading-logo" />
        <div className="gading-eissn">e-ISSN: 2600-7568</div>
      </div>
      <div className="gading-url">
        Available online at<br/>
        https://gadingss.learningdistance.org
      </div>
      <div className="gading-title">
        GADING Journal<br/>for the Social Sciences
      </div>
    </div>
  </div>
);

// =====================================================================
// Upload modal
// =====================================================================
const UploadModal = ({ onClose, onDone }) => {
  const [drag, setDrag] = React.useState(false);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(20, 16, 10, 0.50)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fade-up 200ms ease-out"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 560, background: "var(--surface)",
        border: "1px solid var(--rule)", borderRadius: 12,
        boxShadow: "var(--shadow-pop)",
        padding: 32
      }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>New manuscript</div>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 500, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
          Load a manuscript
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-2)", margin: "0 0 24px" }}>
          The GADING template is applied automatically. Override with a custom template only when required.
        </p>

        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); onDone(); }}
          onClick={onDone}
          style={{
            border: `1px dashed ${drag ? "var(--accent)" : "var(--rule-3)"}`,
            background: drag ? "var(--accent-soft)" : "var(--paper)",
            borderRadius: 8,
            padding: 32, textAlign: "center", cursor: "pointer",
            transition: "all 120ms ease"
          }}>
          <div style={{ color: "var(--ink-3)", marginBottom: 8 }}>
            <Icon name="upload" size={22} />
          </div>
          <div style={{ fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>
            Drop your <strong>.docx</strong> here
          </div>
          <div className="label-mono" style={{ fontSize: 10 }}>or click to browse</div>
        </div>

        <div style={{ marginTop: 20, padding: 12, borderRadius: 6, background: "var(--paper-2)", border: "1px solid var(--rule)", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="lock" size={14} className="" />
          <div style={{ fontSize: 12, color: "var(--ink-2)" }}>
            <strong style={{ color: "var(--ink)" }}>GADING system template</strong> · v2024.1 (default)
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm">Override</button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Spin keyframe
const styleTag = document.createElement("style");
styleTag.textContent = `
@keyframes spin { to { transform: rotate(360deg); } }
.spinning { animation: spin 1s linear infinite; }
select.style-chip option { font-family: var(--font-ui); text-transform: none; letter-spacing: 0; font-size: 12px; color: var(--ink); background: var(--surface); }
`;
document.head.appendChild(styleTag);

window.Formatter = Formatter;

// Helper: live paper-size label read from documentElement data attribute
const PaperSizeLabel = () => {
  const [size, setSize] = React.useState(() =>
    document.documentElement.getAttribute("data-paper") || "B5"
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setSize(document.documentElement.getAttribute("data-paper") || "B5");
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-paper"] });
    return () => obs.disconnect();
  }, []);
  return <>{size === "A4" ? "A4" : "B5 JIS"}</>;
};
window.PaperSizeLabel = PaperSizeLabel;
