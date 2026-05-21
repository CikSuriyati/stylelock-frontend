/* eslint-disable */
// Shared atoms — buttons, icons, brand mark

// =====================================================================
// Icons — small line icons (consistent stroke 1.5)
// =====================================================================
const Icon = ({ name, size = 16, className = "" }) => {
  const s = size;
  const props = {
    width: s, height: s, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.5,
    strokeLinecap: "round", strokeLinejoin: "round",
    className
  };
  switch (name) {
    case "dashboard":
      return <svg {...props}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>;
    case "doc":
      return <svg {...props}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>;
    case "book":
      return <svg {...props}><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5a2.5 2.5 0 0 0-2.5 2.5z"/><path d="M4 4.5v18"/><path d="M9 7h7M9 11h7"/></svg>;
    case "word":
      return <svg {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l1.5 6L10 11l1.5 4L13 9"/><path d="M16 9v6M16 9l2 6 2-6"/></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "upload":
      return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
    case "download":
      return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
    case "sync":
      return <svg {...props}><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><polyline points="21 3 21 8 16 8"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><polyline points="3 21 3 16 8 16"/></svg>;
    case "check":
      return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case "x":
      return <svg {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "chevron-right":
      return <svg {...props}><polyline points="9 18 15 12 9 6"/></svg>;
    case "chevron-down":
      return <svg {...props}><polyline points="6 9 12 15 18 9"/></svg>;
    case "arrow-right":
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case "bold":
      return <svg {...props}><path d="M6 4h7a4 4 0 0 1 0 8H6z"/><path d="M6 12h8a4 4 0 0 1 0 8H6z"/></svg>;
    case "italic":
      return <svg {...props}><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>;
    case "underline":
      return <svg {...props}><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>;
    case "align-left":
      return <svg {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>;
    case "align-center":
      return <svg {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
    case "align-justify":
      return <svg {...props}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case "focus":
      return <svg {...props}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/></svg>;
    case "file-text":
      return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "more":
      return <svg {...props}><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
    case "warn":
      return <svg {...props}><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "sparkle":
      return <svg {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z"/></svg>;
    case "link":
      return <svg {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;
    case "folder":
      return <svg {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
    case "star":
      return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "lock":
      return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    default:
      return null;
  }
};

// =====================================================================
// Brand mark — locked-paragraph mark, ink with accent underline
// =====================================================================
const BrandMark = ({ size = 28 }) => (
  <div className="brand-mark" style={{ width: size, height: size }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" strokeLinecap="square" />
      <line x1="4" y1="12" x2="14" y2="12" strokeLinecap="square" />
      <line x1="4" y1="17" x2="18" y2="17" strokeLinecap="square" />
    </svg>
  </div>
);

// =====================================================================
// Button — convenience wrapper
// =====================================================================
const Button = ({ variant = "secondary", size = "md", icon, iconRight, children, className = "", ...rest }) => {
  const cls = ["btn", `btn-${variant}`, size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "", className].filter(Boolean).join(" ");
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={14} />}
    </button>
  );
};

// =====================================================================
// Segmented control
// =====================================================================
const Segmented = ({ value, onChange, options }) => (
  <div className="segmented">
    {options.map(opt => (
      <button
        key={opt.value}
        className={`segmented-item ${value === opt.value ? "is-active" : ""}`}
        onClick={() => onChange(opt.value)}
      >
        {opt.icon && <Icon name={opt.icon} size={11} />}
        {opt.label}
      </button>
    ))}
  </div>
);

// =====================================================================
// Status badge — text + dot
// =====================================================================
const StatusBadge = ({ tone = "ok", children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-2)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
    <span className={`dot dot-${tone} pulse-dot`} />
    {children}
  </span>
);

// =====================================================================
// Toast — bottom-right slide in
// =====================================================================
const Toast = ({ message, onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 1000,
      background: "var(--ink)", color: "#fff", padding: "10px 16px",
      borderRadius: 8, fontSize: 13, fontWeight: 500,
      boxShadow: "var(--shadow-pop)",
      display: "flex", alignItems: "center", gap: 10,
      animation: "fade-up 200ms ease-out both"
    }}>
      <Icon name="check" size={14} />
      {message}
    </div>
  );
};

// =====================================================================
// Download helper — builds a blob and triggers browser download
// =====================================================================
function downloadBlob(filename, content, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Generates a Word-openable HTML document (.doc). Word reads HTML transparently
// when the file extension is .doc and the MIME is application/msword. Uses Word's
// MSO XML extensions to set B5 page size, margins, and other section properties.
function buildWordHtml(title, paras, getStyleAt, articleInfo, opts = {}) {
  const logoSrc = opts.logoDataUrl || "";
  const headerData = opts.header || {};
  const footerData = opts.footer || {};
  // Word's reliable CSS subset — use mso-* hints where helpful
  const styleMap = {
    "Title":       'mso-style-name:"Title";font-size:17.0pt;font-family:"Times New Roman",serif;mso-bidi-font-family:"Times New Roman";text-align:center;mso-line-height-rule:exactly;line-height:20.0pt;margin:0in 0in 12.0pt 0in;',
    "Author":      'mso-style-name:"Author";font-size:13.0pt;font-family:"Times New Roman",serif;text-align:center;mso-line-height-rule:exactly;line-height:15.0pt;margin:0in 0in 8.0pt 0in;',
    "Affiliation": 'mso-style-name:"Affiliation";font-size:8.0pt;font-family:"Times New Roman",serif;font-style:italic;text-align:center;mso-line-height-rule:exactly;line-height:10.0pt;margin:0in;',
    "Abstract":    'font-size:9.0pt;font-family:"Times New Roman",serif;text-align:justify;mso-line-height-rule:exactly;line-height:11.0pt;margin:0in;',
    "Keywords":    'font-size:9.0pt;font-family:"Times New Roman",serif;mso-line-height-rule:exactly;line-height:11.0pt;margin:0in;',
    "Heading A":   'mso-style-name:"Heading A";font-size:10.0pt;font-family:"Times New Roman",serif;font-weight:bold;mso-line-height-rule:exactly;line-height:12.0pt;margin:18.0pt 0in 12.0pt 0in;',
    "Heading B":   'mso-style-name:"Heading B";font-size:10.0pt;font-family:"Times New Roman",serif;font-weight:bold;mso-line-height-rule:exactly;line-height:12.0pt;margin:12.0pt 0in 0in 0in;',
    "Heading C":   'font-size:10.0pt;font-family:"Times New Roman",serif;font-style:italic;mso-line-height-rule:exactly;line-height:12.0pt;margin:12.0pt 0in 3.0pt 0in;',
    "Main Text":   'font-size:9.0pt;font-family:"Times New Roman",serif;text-align:justify;mso-line-height-rule:exactly;line-height:11.0pt;text-indent:17.0pt;margin:0in 0in 6.0pt 0in;',
    "Reference":   'font-size:9.0pt;font-family:"Times New Roman",serif;text-align:justify;mso-line-height-rule:exactly;line-height:11.0pt;mso-pagination:widow-orphan;margin:0in 0in 9.0pt 17.85pt;text-indent:-17.85pt;',
    "Caption B":   'font-size:9.0pt;font-family:"Times New Roman",serif;text-align:left;mso-line-height-rule:exactly;line-height:10.0pt;margin:6.0pt 0in;',
    "Table Caption":'font-size:8.0pt;font-family:"Times New Roman",serif;font-weight:bold;text-align:left;mso-line-height-rule:exactly;line-height:10.0pt;margin:6.0pt 0in;',
    "Equation":    'font-size:9.0pt;font-family:"Times New Roman",serif;text-align:center;mso-line-height-rule:exactly;line-height:11.0pt;margin:12.0pt 0in;font-style:italic;',
    "Footnote":    'font-size:8.0pt;font-family:"Times New Roman",serif;text-align:justify;mso-line-height-rule:exactly;line-height:10.0pt;text-indent:12.0pt;margin:0in;'
  };

  let a = 0, b = 0;
  const num = {};
  paras.forEach((p, i) => {
    const s = getStyleAt(i);
    if (s === "Heading A") { a++; b = 0; num[i] = `${a}.`; }
    else if (s === "Heading B") { b++; num[i] = `${a}.${b}`; }
  });

  const escape = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const front = { title: "", authors: [], affs: [], abstract: "" };
  const body = [];
  paras.forEach((p, i) => {
    const s = getStyleAt(i);
    if (s === "Title")       { front.title = p.text; return; }
    if (s === "Author")      { front.authors.push(p.text); return; }
    if (s === "Affiliation") { front.affs.push(p.text); return; }
    if (s === "Abstract")    { front.abstract = p.text; return; }
    body.push({ p, i, s });
  });

  const renderBody = body.map(({ p, i, s }) => {
    const css = styleMap[s] || styleMap["Main Text"];

    if (s === "Table Placeholder" && p.props && p.props.table_data) {
      const rows = p.props.table_data.map((row, r) => {
        const topBorder    = r === 0 ? "1pt solid #000" : "none";
        const bottomBorder = (r === 0 || r === p.props.table_data.length - 1) ? "1pt solid #000" : "none";
        return `<tr>${row.map(c =>
          `<td style="padding:4pt 6pt;border-top:${topBorder};border-bottom:${bottomBorder};font-weight:${r===0?'bold':'normal'};font-size:8pt;font-family:'Times New Roman',serif;vertical-align:top;">${escape(c)}</td>`
        ).join("")}</tr>`;
      }).join("");
      return `<table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:6pt 0;">${rows}</table>`;
    }
    if (s === "Image Placeholder") {
      return `<p style="text-align:center;font-style:italic;color:#666;font-size:9.0pt;font-family:'Times New Roman',serif;margin:10pt 0;">[Figure: ${escape(p.text)}]</p>`;
    }
    if (s === "Equation") {
      const eqNum = (p.props && p.props.number) ? p.props.number : "1";
      return `<table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:12pt 0;"><tr><td style="width:85%;text-align:center;font-style:italic;font-size:9pt;font-family:'Times New Roman',serif;">${escape(p.text)}</td><td style="width:15%;text-align:right;font-size:9pt;font-family:'Times New Roman',serif;">(${escape(eqNum)})</td></tr></table>`;
    }

    // Heading A — apply uppercase to the raw text (text-transform isn't reliable in Word)
    let text = escape(p.text);
    if (s === "Heading A") text = text.toUpperCase();
    const prefix = num[i] ? `${escape(num[i])}\u2002` : "";
    return `<p style="${css}">${prefix}${text}</p>`;
  }).join("\n");

  // B5 JIS page size in points: 19.25cm × 26.25cm
  // Margins: 1.33 / 2.51 / 2.10 / 2.10 cm
  const sectPr = `
<!--[if gte mso 9]><xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml><![endif]-->
<style>
@page Section1 {
  size: 21cm 29.7cm;
  margin: 2.54cm;
  mso-page-orientation: portrait;
  mso-header-margin: 1.27cm;
  mso-footer-margin: 1.27cm;
  mso-title-page: yes;
  mso-first-header: url("#fh1");
  mso-header: url("#h1");
  mso-first-footer: url("#ff1");
  mso-footer: url("#f1");
  mso-paper-source: 0;
}
div.Section1 { page: Section1; }
body { font-family: 'Times New Roman', serif; font-size: 9pt; }
table { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
</style>`;

  // Article-info table — left col (history + keywords + DOI) + right col (abstract)
  const historyRows = (articleInfo && articleInfo.history) || [];
  const keywords = (articleInfo && articleInfo.keywords) || [];
  const doi = (articleInfo && articleInfo.doi) || "";

  // First-page header markup — mirrors the web preview
  const firstPageHeader = `
<div style="mso-element:header" id="fh1">
<table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0;">
<tr>
  <td style="width:30%;text-align:center;vertical-align:middle;">
    ${logoSrc ? `<img src="${logoSrc}" alt="GJSS" style="height:50pt;" />` : ""}
    <p style="font-family:'Times New Roman',serif;font-size:8pt;margin:3pt 0 0 0;text-align:center;">${escape(headerData.eissn || "e-ISSN: 2600-7568")}</p>
  </td>
  <td style="width:40%;text-align:center;vertical-align:middle;font-family:'Times New Roman',serif;">
    <p style="font-size:8pt;margin:0;">${escape(headerData.availableLabel || "Available online at")}</p>
    <p style="font-size:8pt;margin:0;">${escape(headerData.url || "https://gadingssuitm.com/index.php/gadingss")}</p>
    <p style="font-size:8pt;margin:8pt 0 0 0;">${escape(headerData.issueRef || "GADING Journal for the Social Sciences 10(2) 2026, 1 – 12")}</p>
  </td>
  <td style="width:30%;text-align:center;vertical-align:middle;">
    <p style="font-family:'Arial Narrow',Arial,sans-serif;font-size:11pt;font-weight:bold;margin:0;padding:6pt 0;border-top:1pt solid #000;border-bottom:1pt solid #000;line-height:1.15;">GADING Journal for<br/>the Social Sciences</p>
  </td>
</tr>
</table>
</div>`;

  // Running (subsequent pages) header
  const runningHeader = `
<div style="mso-element:header" id="h1">
<p style="font-family:'Times New Roman',serif;font-size:8pt;font-style:italic;text-align:left;margin:0;">${escape(headerData.runningLine || "Ujang et al. / GADING Journal for the Social Sciences (2026) Vol. 10, No. 2")}</p>
</div>`;

  // First-page footer
  const firstPageFooter = `
<div style="mso-element:footer" id="ff1">
<table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0;">
<tr><td colspan="2" style="font-family:'Times New Roman',serif;font-size:7.5pt;padding:0 0 4pt 0;">${escape(footerData.corrAuthor || "*Corresponding author. E-mail address: suriyati@uitm.edu.my")}</td></tr>
<tr>
  <td style="font-family:'Times New Roman',serif;font-size:7.5pt;text-align:left;">${escape(footerData.doi || ("https://doi.org/" + doi))}</td>
  <td style="font-family:'Times New Roman',serif;font-size:7.5pt;text-align:right;">${escape(footerData.copyright || "\u00a9UiTM Press, Universiti Teknologi MARA")}</td>
</tr>
</table>
</div>`;

  // Running footer
  const runningFooter = `
<div style="mso-element:footer" id="f1">
<table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0;">
<tr>
  <td style="font-family:'Times New Roman',serif;font-size:7.5pt;text-align:left;">${escape(footerData.doi || ("https://doi.org/" + doi))}</td>
  <td style="font-family:'Times New Roman',serif;font-size:7.5pt;text-align:right;">${escape(footerData.copyright || "\u00a9UiTM Press, Universiti Teknologi MARA")}</td>
</tr>
</table>
</div>`;

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="ProgId" content="Word.Document"><meta name="Generator" content="Microsoft Word 15"><meta name="Originator" content="Microsoft Word 15"><title>${escape(title)}</title>${sectPr}</head>
<body lang="EN-MY"><div class="Section1">

<p style="${styleMap.Title}">${escape(front.title)}</p>
${front.authors.map(au => `<p style="${styleMap.Author}">${escape(au)}</p>`).join("")}
${front.affs.map(af => `<p style="${styleMap.Affiliation}">${escape(af)}</p>`).join("")}

<table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border-top:0.75pt solid #000;border-bottom:0.75pt solid #000;margin:12pt 0;">
<tr>
  <td style="width:33.6%;padding:6pt 6pt 8pt 0;vertical-align:top;font-size:9pt;font-family:'Times New Roman',serif;">
    <p style="font-size:9pt;font-weight:bold;margin:0 0 2pt 0;line-height:11pt;">Article info</p>
    <p style="font-size:9pt;font-weight:bold;margin:6pt 0 2pt 0;line-height:11pt;">Article history:</p>
    ${historyRows.map(h => `<p style="font-size:9pt;line-height:11pt;margin:0;">${escape(h.label)}: ${escape(h.date)}</p>`).join("")}
    <p style="font-size:9pt;font-weight:bold;margin:8pt 0 2pt 0;line-height:11pt;">Keywords:</p>
    ${keywords.map(k => `<p style="font-size:9pt;line-height:11pt;margin:0;">${escape(k)}</p>`).join("")}
    <p style="font-size:9pt;line-height:11pt;margin:8pt 0 0 0;">DOI: ${escape(doi)}</p>
  </td>
  <td style="width:3%;"></td>
  <td style="width:63.4%;padding:6pt 0 8pt 0;vertical-align:top;">
    <p style="font-size:9pt;font-weight:bold;margin:0 0 2pt 0;line-height:11pt;">Abstract</p>
    <p style="${styleMap.Abstract}">${escape(front.abstract)}</p>
  </td>
</tr>
</table>

${renderBody}

${firstPageHeader}
${runningHeader}
${firstPageFooter}
${runningFooter}

</div></body></html>`;
}

// expose
Object.assign(window, { Icon, BrandMark, Button, Segmented, StatusBadge, Toast, downloadBlob, buildWordHtml });

// Opens a print-friendly version in a new window and triggers the browser's
// print dialog. User can then "Save as PDF" from the dialog.
function printAsPdf(title, htmlBody) {
  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) { alert("Please allow pop-ups to download as PDF."); return; }
  w.document.open();
  w.document.write(htmlBody);
  w.document.close();
  setTimeout(() => {
    try { w.focus(); w.print(); } catch (e) {}
  }, 500);
}
// Read GJSS logo as data URL (so it survives in exported .doc / PDF)
async function getLogoDataUrl() {
  // The logo is loaded by CSS background-image, which becomes a blob: URL after bundling.
  // We refetch it and convert to a base64 data URL.
  try {
    const el = document.querySelector(".gjss-img");
    if (!el) return null;
    const bg = getComputedStyle(el).backgroundImage;
    const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
    if (!m) return null;
    const res = await fetch(m[1]);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.readAsDataURL(blob);
    });
  } catch (e) {
    return null;
  }
}
window.getLogoDataUrl = getLogoDataUrl;
