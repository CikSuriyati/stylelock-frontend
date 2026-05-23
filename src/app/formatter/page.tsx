"use client";

/**
 * StyleLock — SciSpace-style formatter page.
 *
 * Pipeline:
 *   .docx upload  ->  POST /ingest             -> StructuredDocument (editable)
 *                  -> POST /render/{docx|pdf|html}  -> formatted output
 *
 * Same aesthetic as the legacy /transform page (dark glass, blue/orange accents),
 * different innards: we now edit the structured editorial model directly and
 * render to any target format from the same JSON.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ------------ Types (mirror backend/renderers/schema.py) ------------

type RunSpan = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    superscript?: boolean;
    subscript?: boolean;
};

type HeadingBlock = { type: "heading"; level: "A" | "B" | "C"; text: string; numbering?: string | null };
type ParagraphBlock = { type: "paragraph"; text?: string; runs?: RunSpan[]; style?: string; alignment?: string | null };
type TableBlock = { type: "table"; caption?: string | null; header?: string[] | null; rows: string[][] };
type FigureBlock = { type: "figure"; src?: string | null; caption?: string | null; alt?: string | null };
type ReferenceBlock = { type: "reference"; raw: string; runs?: RunSpan[] };
type EquationBlock = { type: "equation"; latex?: string | null; text?: string | null; number?: string | null };

type Block = HeadingBlock | ParagraphBlock | TableBlock | FigureBlock | ReferenceBlock | EquationBlock;

type DocumentMetadata = {
    title?: string | null;
    authors: string[];
    affiliations: string[];
    abstract?: string | null;
    keywords?: string | null;
    journal?: string | null;
    volume?: string | null;
    issue?: string | null;
    year?: string | null;
};

type StructuredDocument = {
    metadata: DocumentMetadata;
    blocks: Block[];
    extras?: Record<string, unknown>;
};

type IngestStats = {
    blocks: number;
    headings: number;
    references: number;
    tables: number;
    figures: number;
    paragraphs: number;
    equations: number;
};

type IngestResponse = {
    job_id: string;
    document: StructuredDocument;
    stats: IngestStats;
};

type RulesetName = "mjcet" | "uitm" | "gading";

// Fallback labels shown before the API responds
const RULESET_LABELS_DEFAULT: Record<RulesetName, string> = {
    mjcet: "MJCET — Malaysian Journal of Chemical Engineering & Tech",
    uitm: "UiTM / GADING — Social Sciences (v2)",
    gading: "GADING legacy ruleset",
};

const STORAGE_KEY = "stylelock_session";

// ------------ Component ------------

export default function FormatterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const [ingesting, setIngesting] = useState(false);
    const [quickRendering, setQuickRendering] = useState<"docx" | "pdf" | "html" | null>(null);
    const [rendering, setRendering] = useState<"docx" | "pdf" | "html" | null>(null);
    const [doc, setDoc] = useState<StructuredDocument | null>(null);
    const [stats, setStats] = useState<IngestStats | null>(null);
    const [ruleset, setRuleset] = useState<RulesetName>("mjcet");
    const [rulesetLabels, setRulesetLabels] = useState<Record<RulesetName, string>>(RULESET_LABELS_DEFAULT);
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ----- On mount: restore session + fetch live ruleset labels -----
    useEffect(() => {
        // Restore saved session from localStorage
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const { job_id, document, stats: savedStats } = JSON.parse(saved);
                setJobId(job_id);
                setDoc(document);
                setStats(savedStats);
            }
        } catch {
            // ignore corrupt storage
        }

        // Fetch live labels from the API in parallel
        const names: RulesetName[] = ["mjcet", "uitm", "gading"];
        Promise.all(
            names.map((name) =>
                fetch(`${API_URL}/render/ruleset?ruleset_name=${name}`)
                    .then((r) => r.json())
                    .then((data) => [name, data] as [RulesetName, Record<string, unknown>])
                    .catch(() => [name, null] as [RulesetName, null])
            )
        ).then((results) => {
            const labels: Partial<Record<RulesetName, string>> = {};
            for (const [name, data] of results) {
                if (!data) continue;
                const j = data.journal as Record<string, string> | undefined;
                if (j?.short_name && j?.name) {
                    labels[name] = `${j.short_name} — ${j.name}`;
                } else if (typeof data.ruleset_name === "string") {
                    labels[name] = data.ruleset_name;
                }
            }
            setRulesetLabels((prev) => ({ ...prev, ...labels }));
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ----- Persist session to localStorage whenever doc changes -----
    useEffect(() => {
        if (doc && jobId && stats) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ job_id: jobId, document: doc, stats }));
            } catch {
                // storage quota exceeded — skip silently
            }
        }
    }, [doc, jobId, stats]);

    // ----- Ingest (parse .docx → StructuredDocument) -----
    const handleIngest = async () => {
        if (!file) return;
        setIngesting(true);
        setError(null);
        setPreviewHtml(null);
        try {
            const fd = new FormData();
            fd.append("manuscript", file);
            const res = await fetch(`${API_URL}/ingest`, { method: "POST", body: fd });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.detail || `Ingest failed (${res.status})`);
            }
            const data: IngestResponse = await res.json();
            setJobId(data.job_id);
            setDoc(data.document);
            setStats(data.stats);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setIngesting(false);
        }
    };

    // ----- Quick reformat (ingest + render in one shot) -----
    const handleQuickRender = async (kind: "docx" | "pdf" | "html") => {
        if (!file) return;
        setQuickRendering(kind);
        setError(null);
        try {
            const fd = new FormData();
            fd.append("manuscript", file);
            const res = await fetch(
                `${API_URL}/ingest-and-render/${kind}?ruleset_name=${ruleset}`,
                { method: "POST", body: fd }
            );
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.detail || `Quick render failed (${res.status})`);
            }
            if (kind === "html") {
                const html = await res.text();
                const blob = new Blob([html], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank");
                URL.revokeObjectURL(url);
            } else {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `document.${kind}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setQuickRendering(null);
        }
    };

    // ----- Render from editor -----
    const handleRender = async (kind: "docx" | "pdf" | "html") => {
        if (!doc) return;
        setRendering(kind);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/render/${kind}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ document: doc, ruleset_name: ruleset, use_template: true }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.detail || `Render failed (${res.status})`);
            }
            if (kind === "html") {
                const html = await res.text();
                setPreviewHtml(html);
            } else {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `document.${kind}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setRendering(null);
        }
    };

    const reset = () => {
        setDoc(null);
        setStats(null);
        setPreviewHtml(null);
        setError(null);
        setFile(null);
        setJobId(null);
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    };

    // ----- Mutators -----
    const setMeta = <K extends keyof DocumentMetadata>(key: K, value: DocumentMetadata[K]) => {
        if (!doc) return;
        setDoc({ ...doc, metadata: { ...doc.metadata, [key]: value } });
    };

    const updateBlock = (idx: number, patch: Partial<Block>) => {
        if (!doc) return;
        const blocks = [...doc.blocks];
        blocks[idx] = { ...blocks[idx], ...patch } as Block;
        setDoc({ ...doc, blocks });
    };

    const deleteBlock = (idx: number) => {
        if (!doc) return;
        const blocks = doc.blocks.filter((_, i) => i !== idx);
        setDoc({ ...doc, blocks });
    };

    const moveBlock = (idx: number, dir: -1 | 1) => {
        if (!doc) return;
        const target = idx + dir;
        if (target < 0 || target >= doc.blocks.length) return;
        const blocks = [...doc.blocks];
        [blocks[idx], blocks[target]] = [blocks[target], blocks[idx]];
        setDoc({ ...doc, blocks });
    };

    return (
        <div className="min-h-screen w-full bg-[#0f172a] text-white font-['Plus_Jakarta_Sans',sans-serif] flex flex-col p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
            <Header
                hasDoc={!!doc}
                ruleset={ruleset}
                rulesetLabels={rulesetLabels}
                setRuleset={setRuleset}
                onReset={reset}
            />

            {error && (
                <div className="mx-2 mb-3 px-4 py-2 rounded-md bg-red-500/15 border border-red-500/40 text-red-200 text-sm">
                    {error}
                </div>
            )}

            {!doc ? (
                <UploadCard
                    file={file}
                    setFile={setFile}
                    ruleset={ruleset}
                    onIngest={handleIngest}
                    ingesting={ingesting}
                    onQuickRender={handleQuickRender}
                    quickRendering={quickRendering}
                />
            ) : (
                <EditorView
                    doc={doc}
                    stats={stats}
                    previewHtml={previewHtml}
                    rendering={rendering}
                    onRender={handleRender}
                    setMeta={setMeta}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                    moveBlock={moveBlock}
                />
            )}
        </div>
    );
}

// ------------ Header ------------

function Header(props: {
    hasDoc: boolean;
    ruleset: RulesetName;
    rulesetLabels: Record<RulesetName, string>;
    setRuleset: (r: RulesetName) => void;
    onReset: () => void;
}) {
    return (
        <div className="flex justify-between items-center mb-4 px-2 shrink-0">
            <div className="flex items-center gap-3">
                <Link href="/">
                    <div className="w-10 h-10 bg-[#0066cc] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-black text-xl">S</span>
                    </div>
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-white">
                        StyleLock <span className="text-white/40 font-normal">| SciSpace Editor</span>
                    </h1>
                    <div className="text-[10px] text-[#ff6b35] font-medium -mt-1 uppercase tracking-widest">
                        Structured editorial pipeline
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Template</span>
                    <select
                        value={props.ruleset}
                        onChange={(e) => props.setRuleset(e.target.value as RulesetName)}
                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                    >
                        {(Object.keys(props.rulesetLabels) as RulesetName[]).map((k) => (
                            <option key={k} value={k} className="text-black">
                                {props.rulesetLabels[k]}
                            </option>
                        ))}
                    </select>
                </div>
                {props.hasDoc && (
                    <button
                        onClick={props.onReset}
                        className="px-3 py-1.5 text-xs font-bold text-white/60 hover:bg-white/10 rounded-md transition border border-white/10 hover:text-white"
                    >
                        New document
                    </button>
                )}
            </div>
        </div>
    );
}

// ------------ Upload card (initial state) ------------

function UploadCard(props: {
    file: File | null;
    setFile: (f: File | null) => void;
    ruleset: RulesetName;
    onIngest: () => void;
    ingesting: boolean;
    onQuickRender: (kind: "docx" | "pdf" | "html") => void;
    quickRendering: "docx" | "pdf" | "html" | null;
}) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-6 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        Ingest a manuscript
                    </h2>
                    <p className="mt-2 text-slate-400 text-sm">
                        Upload your <code className="font-mono text-emerald-400">.docx</code> and we&apos;ll parse it into structured
                        content. Then edit and render to DOCX, PDF, or HTML.
                    </p>
                </div>

                <div
                    className={`p-10 rounded-2xl border-2 border-dashed transition-all ${
                        props.file
                            ? "border-emerald-500/50 bg-emerald-500/5"
                            : "border-slate-700 hover:border-blue-500/50"
                    }`}
                >
                    <label className="block text-center cursor-pointer">
                        <input
                            type="file"
                            accept=".docx"
                            className="hidden"
                            onChange={(e) => props.setFile(e.target.files?.[0] || null)}
                        />
                        <div className="text-5xl mb-3 opacity-50">📄</div>
                        <div className="text-sm font-semibold text-slate-200">
                            {props.file ? props.file.name : "Choose a .docx file"}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {props.file
                                ? `${(props.file.size / 1024).toFixed(1)} KB`
                                : "Click to browse or drag-and-drop"}
                        </div>
                    </label>
                </div>

                {/* Primary action: ingest → editor */}
                <button
                    onClick={props.onIngest}
                    disabled={!props.file || props.ingesting || !!props.quickRendering}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/20"
                >
                    {props.ingesting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Parsing...
                        </span>
                    ) : (
                        "Ingest manuscript → edit & render"
                    )}
                </button>

                {/* Quick reformat: skip the editor */}
                {props.file && (
                    <div className="space-y-2">
                        <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold text-center">
                            — or quick reformat (skip editor) —
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(["docx", "pdf", "html"] as const).map((kind) => {
                                const busy = props.quickRendering === kind;
                                const otherBusy = !!props.quickRendering && !busy;
                                const colors: Record<string, string> = {
                                    docx: "#7c3aed",
                                    pdf: "#ff6b35",
                                    html: "#0066cc",
                                };
                                return (
                                    <button
                                        key={kind}
                                        onClick={() => props.onQuickRender(kind)}
                                        disabled={busy || otherBusy || props.ingesting}
                                        style={{ background: busy ? "#444" : colors[kind] }}
                                        className="py-2.5 rounded-lg text-white text-xs font-bold transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {busy ? (
                                            <span className="flex items-center justify-center gap-1">
                                                <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
                                                {kind.toUpperCase()}
                                            </span>
                                        ) : (
                                            `↓ ${kind.toUpperCase()}`
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <p className="text-center text-xs text-slate-500">
                    Structured content stays the source of truth — DOCX, PDF, and HTML are all rendered from the
                    same JSON.
                </p>
            </div>
        </div>
    );
}

// ------------ Editor + preview view ------------

function EditorView(props: {
    doc: StructuredDocument;
    stats: IngestStats | null;
    previewHtml: string | null;
    rendering: "docx" | "pdf" | "html" | null;
    onRender: (kind: "docx" | "pdf" | "html") => void;
    setMeta: <K extends keyof DocumentMetadata>(key: K, value: DocumentMetadata[K]) => void;
    updateBlock: (idx: number, patch: Partial<Block>) => void;
    deleteBlock: (idx: number) => void;
    moveBlock: (idx: number, dir: -1 | 1) => void;
}) {
    return (
        <div className="flex-1 grid grid-cols-2 gap-6 h-0 min-h-0">
            {/* LEFT — structured editor */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[rgba(12,18,35,0.8)] backdrop-blur-[20px]">
                <div className="bg-black/20 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">
                        1. Structured content
                    </span>
                    {props.stats && (
                        <span className="text-[10px] text-white/40 font-medium">
                            {props.stats.blocks} blocks · {props.stats.headings} headings · {props.stats.references}{" "}
                            references · {props.stats.tables} tables · {props.stats.figures} figures
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <MetadataEditor metadata={props.doc.metadata} setMeta={props.setMeta} />

                    <div className="h-px bg-white/10" />

                    <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">
                            Body blocks
                        </div>
                        <div className="space-y-3">
                            {props.doc.blocks.map((b, i) => (
                                <BlockEditor
                                    key={i}
                                    index={i}
                                    block={b}
                                    canMoveUp={i > 0}
                                    canMoveDown={i < props.doc.blocks.length - 1}
                                    onChange={(patch) => props.updateBlock(i, patch)}
                                    onDelete={() => props.deleteBlock(i)}
                                    onMove={(d) => props.moveBlock(i, d)}
                                />
                            ))}
                            {props.doc.blocks.length === 0 && (
                                <div className="text-center text-xs text-slate-500 py-6 italic">
                                    No body blocks parsed.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT — render targets + preview */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[rgba(12,18,35,0.8)] backdrop-blur-[20px]">
                <div className="bg-black/20 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">
                        2. Render
                    </span>
                    <div className="flex gap-2">
                        <RenderButton
                            label="HTML preview"
                            kind="html"
                            color="#0066cc"
                            rendering={props.rendering}
                            onClick={() => props.onRender("html")}
                        />
                        <RenderButton
                            label="DOCX"
                            kind="docx"
                            color="#7c3aed"
                            rendering={props.rendering}
                            onClick={() => props.onRender("docx")}
                        />
                        <RenderButton
                            label="PDF"
                            kind="pdf"
                            color="#ff6b35"
                            rendering={props.rendering}
                            onClick={() => props.onRender("pdf")}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-black/40 p-6">
                    {props.previewHtml ? (
                        <div className="bg-white rounded-md shadow-2xl overflow-hidden">
                            <iframe
                                title="HTML preview"
                                srcDoc={props.previewHtml}
                                className="w-full h-[calc(100vh-220px)] border-0"
                            />
                        </div>
                    ) : (
                        <EmptyPreview />
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyPreview() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center px-6 text-slate-400">
            <div className="text-6xl mb-4 opacity-30">📑</div>
            <div className="text-sm font-semibold text-slate-300">No preview yet</div>
            <div className="text-xs text-slate-500 mt-2 max-w-sm">
                Hit <span className="text-[#0066cc] font-bold">HTML preview</span> to see your document rendered
                inline. Use <span className="text-[#7c3aed] font-bold">DOCX</span> or{" "}
                <span className="text-[#ff6b35] font-bold">PDF</span> to download a file.
            </div>
        </div>
    );
}

// ------------ Render button ------------

function RenderButton(props: {
    label: string;
    kind: "html" | "docx" | "pdf";
    color: string;
    rendering: "docx" | "pdf" | "html" | null;
    onClick: () => void;
}) {
    const busy = props.rendering === props.kind;
    const otherBusy = props.rendering !== null && !busy;
    return (
        <button
            onClick={props.onClick}
            disabled={busy || otherBusy}
            style={{ background: busy ? "#444" : props.color }}
            className="px-3 py-1.5 text-white rounded-md text-[11px] font-bold transition shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {busy ? "Rendering..." : props.label}
        </button>
    );
}

// ------------ Metadata editor ------------

function MetadataEditor(props: {
    metadata: DocumentMetadata;
    setMeta: <K extends keyof DocumentMetadata>(key: K, value: DocumentMetadata[K]) => void;
}) {
    const { metadata, setMeta } = props;

    return (
        <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Front matter</div>

            <FieldText
                label="Title"
                value={metadata.title || ""}
                onChange={(v) => setMeta("title", v)}
                placeholder="Manuscript title"
            />

            <FieldList
                label="Authors"
                values={metadata.authors}
                onChange={(arr) => setMeta("authors", arr)}
                placeholder="One author byline per line"
            />

            <FieldList
                label="Affiliations"
                values={metadata.affiliations}
                onChange={(arr) => setMeta("affiliations", arr)}
                placeholder="One affiliation per line"
            />

            <FieldTextarea
                label="Abstract"
                value={metadata.abstract || ""}
                onChange={(v) => setMeta("abstract", v)}
                placeholder="≤300 words"
                rows={5}
            />

            <FieldText
                label="Keywords"
                value={metadata.keywords || ""}
                onChange={(v) => setMeta("keywords", v)}
                placeholder="Comma-separated, up to 6"
            />
        </div>
    );
}

function FieldText(props: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <label className="block">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{props.label}</span>
            <input
                type="text"
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                placeholder={props.placeholder}
                className="mt-1 w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition"
            />
        </label>
    );
}

function FieldTextarea(props: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <label className="block">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{props.label}</span>
            <textarea
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                placeholder={props.placeholder}
                rows={props.rows || 4}
                className="mt-1 w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition resize-y font-serif leading-relaxed"
            />
        </label>
    );
}

function FieldList(props: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
    const text = useMemo(() => props.values.join("\n"), [props.values]);
    return (
        <label className="block">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                {props.label} <span className="text-white/30">({props.values.length})</span>
            </span>
            <textarea
                value={text}
                onChange={(e) => props.onChange(e.target.value.split("\n").filter((l) => l.trim().length > 0))}
                placeholder={props.placeholder}
                rows={Math.max(props.values.length || 1, 1) + 1}
                className="mt-1 w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition resize-y"
            />
        </label>
    );
}

// ------------ Block editors ------------

const BLOCK_TYPE_LABELS: Record<Block["type"], string> = {
    heading: "Heading",
    paragraph: "Paragraph",
    table: "Table",
    figure: "Figure",
    reference: "Reference",
    equation: "Equation",
};

const BLOCK_TYPE_COLORS: Record<Block["type"], string> = {
    heading: "#0066cc",
    paragraph: "#475569",
    table: "#7c3aed",
    figure: "#ec4899",
    reference: "#10b981",
    equation: "#f59e0b",
};

function BlockEditor(props: {
    index: number;
    block: Block;
    canMoveUp: boolean;
    canMoveDown: boolean;
    onChange: (patch: Partial<Block>) => void;
    onDelete: () => void;
    onMove: (dir: -1 | 1) => void;
}) {
    const { block } = props;
    const color = BLOCK_TYPE_COLORS[block.type];

    return (
        <div className="group rounded-lg border border-white/10 bg-black/30 overflow-hidden">
            <div
                className="flex items-center justify-between px-3 py-1.5 border-b border-white/5"
                style={{ background: `${color}15` }}
            >
                <div className="flex items-center gap-2">
                    <span
                        className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{ background: color, color: "white" }}
                    >
                        {BLOCK_TYPE_LABELS[block.type]}
                        {block.type === "heading" ? ` ${block.level}` : ""}
                    </span>
                    {block.type === "heading" && (
                        <select
                            value={block.level}
                            onChange={(e) => props.onChange({ level: e.target.value as "A" | "B" | "C" })}
                            className="bg-transparent text-[10px] font-bold text-white/70 outline-none cursor-pointer"
                        >
                            <option value="A" className="text-black">Level A</option>
                            <option value="B" className="text-black">Level B</option>
                            <option value="C" className="text-black">Level C</option>
                        </select>
                    )}
                    {block.type === "paragraph" && (
                        <select
                            value={block.style || "Main Text"}
                            onChange={(e) => props.onChange({ style: e.target.value })}
                            className="bg-transparent text-[10px] font-bold text-white/70 outline-none cursor-pointer"
                        >
                            {["Main Text", "Abstract", "Footnote", "Caption", "Source"].map((s) => (
                                <option key={s} value={s} className="text-black">{s}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => props.onMove(-1)}
                        disabled={!props.canMoveUp}
                        className="text-white/40 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move up"
                    >
                        ↑
                    </button>
                    <button
                        onClick={() => props.onMove(1)}
                        disabled={!props.canMoveDown}
                        className="text-white/40 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move down"
                    >
                        ↓
                    </button>
                    <button
                        onClick={props.onDelete}
                        className="text-white/40 hover:text-red-400 text-xs px-1.5 py-0.5 rounded hover:bg-red-500/10"
                        title="Delete"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="p-3">
                {block.type === "heading" && (
                    <input
                        type="text"
                        value={block.text}
                        onChange={(e) => props.onChange({ text: e.target.value })}
                        className="w-full bg-transparent border-0 outline-none text-base font-bold text-white placeholder-white/30"
                        placeholder="Heading text"
                    />
                )}

                {block.type === "paragraph" && (
                    <textarea
                        value={block.text || ""}
                        onChange={(e) => props.onChange({ text: e.target.value, runs: [] })}
                        className="w-full bg-transparent border-0 outline-none text-sm text-white/90 font-serif leading-relaxed resize-y"
                        rows={Math.max(2, Math.ceil((block.text?.length || 0) / 80))}
                        placeholder="Paragraph text"
                    />
                )}

                {block.type === "reference" && (
                    <textarea
                        value={block.raw}
                        onChange={(e) => props.onChange({ raw: e.target.value, runs: [] })}
                        className="w-full bg-transparent border-0 outline-none text-sm text-white/90 font-serif leading-relaxed resize-y"
                        rows={Math.max(2, Math.ceil(block.raw.length / 80))}
                        placeholder="APA 7 reference entry"
                    />
                )}

                {block.type === "table" && <TableBlockEditor block={block} onChange={props.onChange} />}

                {block.type === "figure" && (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={block.src || ""}
                            onChange={(e) => props.onChange({ src: e.target.value })}
                            placeholder="Image src (URL or filename)"
                            className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 outline-none focus:border-blue-500/50"
                        />
                        <input
                            type="text"
                            value={block.caption || ""}
                            onChange={(e) => props.onChange({ caption: e.target.value })}
                            placeholder="Caption (Fig. X. ...)"
                            className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 outline-none focus:border-blue-500/50"
                        />
                    </div>
                )}

                {block.type === "equation" && (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={block.latex || ""}
                            onChange={(e) => props.onChange({ latex: e.target.value })}
                            placeholder="LaTeX (optional)"
                            className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 outline-none focus:border-blue-500/50 font-mono"
                        />
                        <input
                            type="text"
                            value={block.text || ""}
                            onChange={(e) => props.onChange({ text: e.target.value })}
                            placeholder="Plain-text fallback"
                            className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 outline-none focus:border-blue-500/50"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function TableBlockEditor(props: {
    block: TableBlock;
    onChange: (patch: Partial<TableBlock>) => void;
}) {
    const { block, onChange } = props;
    const header = block.header || [];
    const rows = block.rows || [];

    const updateHeader = (i: number, v: string) => {
        const next = [...header];
        next[i] = v;
        onChange({ header: next });
    };
    const updateCell = (r: number, c: number, v: string) => {
        const next = rows.map((row) => [...row]);
        next[r][c] = v;
        onChange({ rows: next });
    };
    const addRow = () => {
        const cols = header.length || rows[0]?.length || 1;
        onChange({ rows: [...rows, Array(cols).fill("")] });
    };
    const deleteRow = (r: number) => {
        onChange({ rows: rows.filter((_, i) => i !== r) });
    };

    return (
        <div className="space-y-2">
            <input
                type="text"
                value={block.caption || ""}
                onChange={(e) => onChange({ caption: e.target.value })}
                placeholder="Caption (Table X. ...)"
                className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white/80 outline-none focus:border-blue-500/50"
            />
            <div className="overflow-x-auto rounded border border-white/10">
                <table className="w-full text-xs text-white/90">
                    {header.length > 0 && (
                        <thead className="bg-white/5">
                            <tr>
                                {header.map((h, i) => (
                                    <th key={i} className="p-1 border border-white/10">
                                        <input
                                            type="text"
                                            value={h}
                                            onChange={(e) => updateHeader(i, e.target.value)}
                                            className="w-full bg-transparent text-center font-bold outline-none focus:bg-blue-500/10 rounded"
                                        />
                                    </th>
                                ))}
                                <th className="w-6"></th>
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {rows.map((row, r) => (
                            <tr key={r}>
                                {row.map((cell, c) => (
                                    <td key={c} className="p-1 border border-white/10">
                                        <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => updateCell(r, c, e.target.value)}
                                            className="w-full bg-transparent outline-none focus:bg-blue-500/10 rounded"
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    <button
                                        onClick={() => deleteRow(r)}
                                        className="text-white/30 hover:text-red-400 text-[10px]"
                                        title="Delete row"
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={addRow}
                className="text-[10px] text-white/40 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30"
            >
                + Add row
            </button>
        </div>
    );
}
