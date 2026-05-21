/* eslint-disable */
// References view — APA 7th formatting tool

const SAMPLE_INPUT = `Holling, C.S. (1973) Resilience and stability of ecological systems. Annual Review of Ecology and Systematics, 4, 1-23.
Norris F.H., Stevens S.P., Pfefferbaum B., Wyche K.F., and Pfefferbaum R.L. (2008). Community resilience as a metaphor, theory, set of capacities, and strategy for disaster readiness. AJCP 41 (1-2): 127-150.
Tan P and Loo, J. (2022) Connectivity and inequality: a regional review. Journal of Rural Studies 92, 87-104. doi:10.1016/j.jrurstud.2022.03.005
Yusof R., Chen L. Beyond infrastructure: use and meaning in rural ICT adoption (2024). New Media & Society. 26(1): 55-74.
Folke C 2016. Resilience (republished). Ecology and Society 21(4):44. https://doi.org/10.5751/ES-09088-210444`;

const FORMATTED = [
  {
    text: 'Folke, C. (2016). Resilience (republished). <em>Ecology and Society, 21</em>(4), 44. https://doi.org/10.5751/ES-09088-210444',
    issues: []
  },
  {
    text: 'Holling, C. S. (1973). Resilience and stability of ecological systems. <em>Annual Review of Ecology and Systematics, 4</em>, 1–23.',
    issues: ["Added space after initial", "En-dash for page range"]
  },
  {
    text: 'Norris, F. H., Stevens, S. P., Pfefferbaum, B., Wyche, K. F., & Pfefferbaum, R. L. (2008). Community resilience as a metaphor, theory, set of capacities, and strategy for disaster readiness. <em>American Journal of Community Psychology, 41</em>(1–2), 127–150.',
    issues: ["Expanded abbreviated journal name", "Ampersand before final author", "Added spaces after initials"]
  },
  {
    text: 'Tan, P., & Loo, J. (2022). Connectivity and inequality: A regional review. <em>Journal of Rural Studies, 92</em>, 87–104. https://doi.org/10.1016/j.jrurstud.2022.03.005',
    issues: ["Converted DOI to URL", "Sentence case for title", "Ampersand before final author"]
  },
  {
    text: 'Yusof, R., & Chen, L. (2024). Beyond infrastructure: Use and meaning in rural ICT adoption. <em>New Media & Society, 26</em>(1), 55–74.',
    issues: ["Re-ordered: year before title", "Added comma after surname"]
  }
];

const References = () => {
  const [input, setInput]     = React.useState(SAMPLE_INPUT);
  const [output, setOutput]   = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast]     = React.useState(null);

  const handleFormat = () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput(null);
    setTimeout(() => {
      setLoading(false);
      setOutput(FORMATTED);
    }, 900);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--paper)" }}>

      {/* Header strip */}
      <div style={{
        padding: "28px 40px 24px",
        borderBottom: "1px solid var(--rule)",
        background: "var(--surface)"
      }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Quick tool</div>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.01em", margin: 0 }}>
          References <em style={{ fontStyle: "italic", color: "var(--accent)" }}>· APA 7th edition</em>
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-2)", margin: "6px 0 0", maxWidth: 580 }}>
          Paste any reference list — mixed formats, missing punctuation, abbreviated journal names — and StyleLock normalises every entry to APA 7th with hanging indents and DOI links.
        </p>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--rule)", minHeight: 0 }}>

        {/* Input pane */}
        <div style={{ background: "var(--paper)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <PaneHeader
            eyebrow="01"
            title="Source"
            sub="Paste raw references"
            right={
              <span className="label-mono" style={{ fontSize: 9.5 }}>
                {input.split("\n").filter(l => l.trim()).length} lines
              </span>
            }
          />
          <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            <textarea
              className="textarea scroll-paper"
              style={{ flex: 1, fontFamily: "var(--font-doc)", fontSize: 13, lineHeight: 1.6 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your reference list here…"
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setInput(SAMPLE_INPUT)} className="btn btn-ghost btn-sm">
                Load sample
              </button>
              <button onClick={() => setInput("")} className="btn btn-ghost btn-sm">
                Clear
              </button>
              <div style={{ flex: 1 }} />
              <button onClick={handleFormat} disabled={loading || !input.trim()} className="btn btn-accent" style={{ minWidth: 140 }}>
                {loading ? (
                  <><Icon name="sync" size={13} className="spinning" /> Formatting…</>
                ) : (
                  <><Icon name="sparkle" size={13} /> Format to APA 7th</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output pane */}
        <div style={{ background: "var(--paper)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <PaneHeader
            eyebrow="02"
            title="Formatted result"
            sub="APA 7th, hanging indent, alphabetised"
            right={output && (
              <span className="label-mono" style={{ fontSize: 9.5, color: "var(--ok)" }}>
                <span className="dot dot-ok" style={{ marginRight: 6 }} />
                {output.length} validated
              </span>
            )}
          />
          <div style={{ flex: 1, padding: 20, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {!output && !loading && (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                color: "var(--ink-3)", textAlign: "center"
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "var(--paper-2)", border: "1px solid var(--rule)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 12, color: "var(--ink-3)"
                }}>
                  <Icon name="sparkle" size={20} />
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-2)", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                  Formatted references will appear here
                </div>
                <div className="label-mono" style={{ fontSize: 9.5, marginTop: 6 }}>
                  Press <kbd style={{
                    fontFamily: "var(--font-mono)", fontSize: 9.5,
                    background: "var(--surface)", border: "1px solid var(--rule-3)",
                    borderRadius: 3, padding: "1px 5px"
                  }}>⌘</kbd> + <kbd style={{
                    fontFamily: "var(--font-mono)", fontSize: 9.5,
                    background: "var(--surface)", border: "1px solid var(--rule-3)",
                    borderRadius: 3, padding: "1px 5px"
                  }}>↵</kbd> to format
                </div>
              </div>
            )}

            {loading && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "var(--ink-3)" }}>
                <Icon name="sync" size={20} className="spinning" />
                <div className="label-mono" style={{ fontSize: 10 }}>Parsing · normalising · validating</div>
              </div>
            )}

            {output && (
              <>
                <div className="scroll-paper" style={{ flex: 1, overflow: "auto", padding: "20px 24px", background: "var(--surface)", border: "1px solid var(--rule)", borderRadius: 8 }}>
                  {output.map((entry, i) => (
                    <div key={i} style={{
                      marginBottom: 14, paddingLeft: "18pt", textIndent: "-18pt",
                      fontFamily: "var(--font-doc)", fontSize: "10.5pt", lineHeight: 1.55,
                      color: "var(--ink)"
                    }}>
                      <span dangerouslySetInnerHTML={{ __html: entry.text }} />
                      {entry.issues.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6, paddingLeft: 0, textIndent: 0 }}>
                          {entry.issues.map((iss, j) => (
                            <span key={j} style={{
                              fontFamily: "var(--font-mono)", fontSize: 9.5,
                              color: "var(--ink-3)", background: "var(--paper-2)",
                              padding: "2px 6px", borderRadius: 3,
                              border: "1px solid var(--rule)"
                            }}>
                              <span className="dot dot-info" style={{ marginRight: 6, width: 4, height: 4, verticalAlign: "middle" }} />
                              {iss}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const plain = output.map(o => o.text.replace(/<[^>]*>/g, "")).join("\n\n");
                      navigator.clipboard.writeText(plain).catch(() => {});
                      setToast("Copied to clipboard");
                    }}
                  >
                    <Icon name="file-text" size={13} />
                    Copy plain
                  </button>
                  <div style={{ flex: 1 }} />
                  <button className="btn btn-secondary btn-sm" onClick={() => {
                    const html = `<html><head><meta charset="utf-8"><title>References (APA 7)</title><style>@page{margin:2.54cm} body{font-family:'Times New Roman',serif;font-size:11pt} p{margin:0 0 10pt 0;padding-left:18pt;text-indent:-18pt;text-align:justify;line-height:1.5;}</style></head><body><h2 style="font-family:'Times New Roman',serif;font-size:13pt;margin:0 0 14pt 0;">References</h2>${output.map(o => `<p>${o.text}</p>`).join("")}</body></html>`;
                    window.printAsPdf("References", html);
                    setToast("Opening print dialog");
                  }}>
                    <Icon name="download" size={13} />
                    PDF
                  </button>
                  <button className="btn btn-accent btn-sm" onClick={() => {
                    const plain = output.map(o => o.text.replace(/<[^>]*>/g, "")).join("\n\n");
                    const html = `<html><head><meta charset="utf-8"><style>@page{margin:2.54cm} body{font-family:'Times New Roman';font-size:11pt} p{margin:0 0 10pt 0;padding-left:18pt;text-indent:-18pt;text-align:justify;}</style></head><body>${output.map(o => `<p>${o.text}</p>`).join("")}</body></html>`;
                    window.downloadBlob("references-apa7.doc", html, "application/msword");
                    setToast("References downloaded");
                  }}>
                    <Icon name="download" size={13} />
                    Download .doc
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

window.References = References;
