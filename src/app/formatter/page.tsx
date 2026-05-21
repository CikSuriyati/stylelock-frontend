"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function FormatterPage() {
    const [manuscript, setManuscript] = useState<File | null>(null);
    const [template, setTemplate] = useState<File | null>(null);
    const [useSystemTemplate, setUseSystemTemplate] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<{ job_id: string; formatted_url: string; report_url: string; review_url: string } | null>(null);
    const [reviewData, setReviewData] = useState<{ original: any[]; formatted: any[]; mapping?: number[] } | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [rightPaneMode, setRightPaneMode] = useState<'output' | 'reference'>('output');
    const [referenceData, setReferenceData] = useState<any[] | null>(null);
    const [styleOverrides, setStyleOverrides] = useState<Record<number, string>>({});
    const [focusMode, setFocusMode] = useState(true);

    const availableStyles = [
        "Title", "Author", "Affiliation", "Abs-Title", "Abstract", "Keywords",
        "Heading A", "Heading B", "Heading C", "Main Text", "Reference",
        "Caption B", "Equation", "Footnote"
    ];

    const fetchReference = async () => {
        try {
            const res = await fetch(`${API_URL}/template/reference`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setReferenceData(data);
            } else {
                setReferenceData([]);
            }
        } catch (e) {
            setReferenceData([]);
        }
    };

    // Get formatting properties for a specific style
    const getStyleFormatting = (styleName: string) => {
        const styleMap: Record<string, any> = {
            "Title": { fontSize: '17pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '12pt', marginTop: '0' },
            "Author": { fontSize: '11pt', fontWeight: 'normal', textAlign: 'center', marginBottom: '0', marginTop: '0' },
            "Affiliation": { fontSize: '10pt', fontStyle: 'italic', textAlign: 'center', marginBottom: '2pt', color: '#FF0000' },
            "Abs-Title": { fontSize: '10pt', fontWeight: 'bold', marginBottom: '0', marginTop: '0' },
            "Abstract": { fontSize: '10pt', textAlign: 'justify', marginBottom: '0', lineHeight: '1.0', fontStyle: 'italic' },
            "Keywords": { fontSize: '10pt', marginBottom: '0' },
            "Heading A": { fontSize: '10pt', fontWeight: 'bold', marginBottom: '0', marginTop: '0', lineHeight: '1.0' },
            "Heading B": { fontSize: '10pt', fontWeight: 'bold', marginBottom: '0', marginTop: '0', lineHeight: '1.0', marginLeft: '18pt', textIndent: '-18pt' },
            "Heading C": { fontSize: '10pt', fontStyle: 'italic', marginBottom: '0', marginTop: '0', lineHeight: '1.0' },
            "Main Text": { fontSize: '10pt', textAlign: 'justify', marginBottom: '0', lineHeight: '1.0' },
            "Reference": { fontSize: '10pt', textAlign: 'left', marginBottom: '0', lineHeight: '1.0', marginLeft: '18pt', textIndent: '-18pt' },
            "Caption B": { fontSize: '9pt', marginBottom: '0', lineHeight: '1.0' },
            "Equation": { fontSize: '10pt', textAlign: 'right', marginBottom: '0', marginTop: '0' },
            "Footnote": { fontSize: '8pt', marginBottom: '0', lineHeight: '1.0' }
        };

        return styleMap[styleName] || { fontSize: '10pt', marginBottom: '0', lineHeight: '1.0' };
    };

    const handleUpload = async () => {
        if (!manuscript || (!template && !useSystemTemplate)) return;
        setProcessing(true);
        setResult(null);
        setReviewData(null);

        const formData = new FormData();
        formData.append("manuscript", manuscript);
        if (!useSystemTemplate && template) {
            formData.append("template", template);
        }

        try {
            const res = await fetch(`${API_URL}/transform?use_system_template=${useSystemTemplate}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
                const reviewRes = await fetch(`${API_URL}/review/${data.job_id}`);
                const rData = await reviewRes.json();
                setReviewData(rData);
            } else {
                alert("Error: " + (data.detail || "Transformation failed"));
            }
        } catch (e) {
            alert("Processing failed. Make sure the backend is running.");
        } finally {
            setProcessing(false);
        }
    };

    const handleSync = async () => {
        if (!result?.job_id || !reviewData?.original) return;
        setSyncing(true);
        try {
            // Collect text for EVERY original paragraph, preserving hidden ones
            const paras = reviewData.original.map((para, i) => {
                const el = document.getElementById(`para-editor-${i}`);
                // Use DOM text if editable, otherwise current para text
                return el ? el.textContent : (para.text || "");
            });

            const res = await fetch(`${API_URL}/update/${result.job_id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    manuscript_text: paras,
                    overrides: styleOverrides
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setReviewData(data);
                alert("Sync complete! Result preview updated.");
            }
        } catch (e) {
            alert("Sync failed.");
        } finally {
            setSyncing(false);
        }
    };

    if (reviewData) {
        return (
            <div className="min-h-screen w-full bg-[#0f172a] text-white font-['Plus_Jakarta_Sans',sans-serif] flex flex-col p-4 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <div className="w-10 h-10 bg-[#0066cc] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white font-black text-xl">W</span>
                            </div>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                StyleLock <span className="text-white/40 font-normal">| GADING Editor</span>
                            </h1>
                            <div className="text-[10px] text-[#ff6b35] font-medium -mt-1 uppercase tracking-widest">Enterprise Formatting Suite</div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setReviewData(null)} className="px-3 py-1.5 text-xs font-bold text-white/60 hover:bg-white/10 rounded-md transition border border-white/10 hover:text-white">
                            Close Document
                        </button>
                    </div>
                </div>

                {/* Side-by-Side Grid */}
                <div className="flex-1 grid grid-cols-2 gap-6 h-0 min-h-0">

                    {/* LEFT: Word Editor (Dark Glass) */}
                    <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[rgba(12,18,35,0.8)] backdrop-blur-[20px]">
                        {/* Header */}
                        <div className="bg-black/20 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                            <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">1. Source Editor (Your Content)</span>
                            <span className="text-[9px] text-white/40 font-medium">Verify categorization here</span>
                        </div>
                        {/* Ribbon */}
                        <div className="bg-black/10 border-b border-white/10">
                            <div className="bg-white/5 p-2 flex items-center justify-between border-b border-white/10 shadow-sm">
                                <div className="flex items-center gap-1 text-white">
                                    <div className="flex border-r border-white/10 pr-2 mr-2 gap-0.5">
                                        <button onClick={() => document.execCommand('bold')} className="p-1.5 hover:bg-white/10 rounded transition font-bold w-8 h-8 flex items-center justify-center">B</button>
                                        <button onClick={() => document.execCommand('italic')} className="p-1.5 hover:bg-white/10 rounded transition italic w-8 h-8 flex items-center justify-center">I</button>
                                        <button onClick={() => document.execCommand('underline')} className="p-1.5 hover:bg-white/10 rounded transition underline w-8 h-8 flex items-center justify-center">U</button>
                                    </div>
                                    <div className="flex border-r border-white/10 pr-2 mr-2 gap-2">
                                        <button
                                            onClick={() => setFocusMode(!focusMode)}
                                            className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${focusMode ? 'bg-[#ff6b35] text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-white/40 hover:text-white border border-white/10'}`}
                                            title={focusMode ? "Show all elements" : "Focus on paragraphs only"}
                                        >
                                            <span className="text-xs">{focusMode ? "★" : "☆"}</span>
                                            {focusMode ? "Focus Active" : "Focus Mode"}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-white/80">
                                        <button onClick={() => document.execCommand('justifyLeft')} className="p-1.5 hover:bg-white/10 rounded transition w-8 h-8 flex items-center justify-center text-lg leading-none">≡</button>
                                        <button onClick={() => document.execCommand('justifyCenter')} className="p-1.5 hover:bg-white/10 rounded transition w-8 h-8 flex items-center justify-center text-lg leading-none">≂</button>
                                        <button onClick={() => document.execCommand('justifyFull')} className="p-1.5 hover:bg-white/10 rounded transition w-8 h-8 flex items-center justify-center text-lg leading-none">≣</button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleSync} disabled={syncing} className="px-4 py-1.5 bg-[#0066cc] hover:bg-[#0052a3] text-white rounded-md text-[11px] font-bold transition shadow-sm active:scale-95 disabled:opacity-50">
                                        {syncing ? "Syncing..." : "Sync & Format"}
                                    </button>
                                    <a href={`${API_URL}${result?.formatted_url}`} className="px-4 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md text-[11px] font-bold transition shadow-sm" download>
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Ruler */}
                        <div className="h-6 bg-black/20 border-b border-white/10 flex items-end px-[2.5cm] relative">
                            <div className="flex-1 h-2 border-l border-r border-white/20 flex justify-between px-2 text-[8px] text-white/30">
                                <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                            </div>
                        </div>

                        {/* Paper Container */}
                        <div className="flex-1 overflow-y-auto bg-black/40 p-8 flex flex-col items-center">
                            {/* A4 Pages */}
                            <div className="w-[21cm] bg-white shadow-xl mb-8 text-black font-serif relative" style={{ padding: '2.54cm', minHeight: '29.7cm' }}>
                                {Array.isArray(reviewData?.original) && reviewData.original.map((para, i) => (
                                    <div key={i} className="group relative mb-6" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                                        <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <select
                                                value={styleOverrides[i] || para.style || "Main Text"}
                                                onChange={(e) => setStyleOverrides(prev => ({ ...prev, [i]: e.target.value }))}
                                                className="bg-[#0066cc]/10 text-[#0066cc] text-[9px] font-bold px-2 py-0.5 rounded border border-[#0066cc]/30 outline-none focus:ring-1 focus:ring-[#0066cc] cursor-pointer appearance-none uppercase"
                                            >
                                                {availableStyles.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <div className="h-[1px] flex-1 bg-[#0066cc]/20"></div>
                                        </div>
                                        {para.style === "Table Placeholder" ? (
                                            !focusMode && (
                                                <div className="w-full my-4 bg-slate-50 border border-slate-300 rounded overflow-hidden">
                                                    <div className="bg-slate-100 p-2 border-b border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-sans select-none">
                                                        <span className="font-bold flex items-center gap-1">📊 TABLE PREVIEW ({para.props.rows} Rows)</span>
                                                        <span className="italic">Standard formatting enforced in download</span>
                                                    </div>
                                                    <div className="overflow-x-auto p-2">
                                                        {para.props.table_data ? (
                                                            <table className="min-w-full border-collapse border border-slate-300 bg-white text-[9px] font-serif leading-none">
                                                                <tbody>
                                                                    {para.props.table_data.map((row: string[], rIndex: number) => (
                                                                        <tr key={rIndex}>
                                                                            {row.map((cell: string, cIndex: number) => (
                                                                                <td key={cIndex} className="border border-slate-300 p-1 align-top text-black">
                                                                                    {cell}
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <div className="text-center text-slate-400 text-xs py-4">No preview data available</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        ) : focusMode && (para.style === "Image Placeholder") ? null : (
                                            <div
                                                id={`para-editor-${i}`}
                                                contentEditable
                                                suppressContentEditableWarning={true}
                                                className="manuscript-para outline-none focus:ring-1 focus:ring-blue-100 p-1 rounded transition leading-normal text-[11pt]"
                                                style={{ fontFamily: "'Times New Roman', serif" }}
                                            >
                                                {para.text}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Compliant Preview (Glass) */}
                    <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[rgba(12,18,35,0.8)] backdrop-blur-[20px]">
                        <div className="p-2 border-b border-white/10 bg-black/20 flex items-center justify-between z-10">
                            <div className="flex bg-black/40 rounded-lg p-1 scale-90 origin-left">
                                <button onClick={() => setRightPaneMode('output')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${rightPaneMode === 'output' ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
                                    Final Result
                                </button>
                                <button onClick={() => { setRightPaneMode('reference'); fetchReference(); }} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${rightPaneMode === 'reference' ? 'bg-[#0066cc] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
                                    GADING Guide
                                </button>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${rightPaneMode === 'output' ? 'text-[#7c3aed]' : 'text-[#0066cc]'} pr-3`}>
                                {rightPaneMode === 'output' ? '2. Final Preview' : 'Reference Guide'}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-black/40 p-8 flex flex-col items-center">
                            {/* A4 Pages */}
                            <div className="w-[21cm] bg-white shadow-xl mb-8 text-black font-serif relative" style={{ padding: '2.54cm', minHeight: '29.7cm' }}>
                                {/* Header from template */}
                                <div className="w-full border-b border-slate-200 pb-4 mb-12">
                                    <table className="w-full" style={{ fontFamily: "'Times New Roman', serif" }}>
                                        <tbody>
                                            <tr>
                                                <td className="align-middle text-center" style={{ width: '30%' }}>
                                                    <img src="/image2.png" alt="GADING Logo" className="inline-block" style={{ width: '120px', height: 'auto' }} />
                                                    <div className="text-[6pt] mt-1">e-ISSN: 2600-7568</div>
                                                </td>
                                                <td className="align-top text-center" style={{ width: '40%' }}>
                                                    <div className="text-[7pt]">Available online at https://gadingssuitm.com/index.php/gadingss</div>
                                                </td>
                                                <td className="align-middle text-center border-t border-b border-black" style={{ width: '30%' }}>
                                                    <div className="text-[12pt] font-bold" style={{ fontFamily: "'Arial Narrow', Arial, sans-serif" }}>GADING Journal for the Social Sciences</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                                {rightPaneMode === 'reference' && !referenceData ? (
                                    <div className="flex items-center justify-center py-20 italic text-slate-400 font-sans">Loading GADING Guide...</div>
                                ) : (
                                    (rightPaneMode === 'output' ? (reviewData?.formatted || []) : (referenceData || [])).map((para: any, i: number) => {
                                        // MAPPING LOGIC
                                        const originalIndex = (rightPaneMode === 'output' && reviewData?.mapping)
                                            ? reviewData.mapping[i]
                                            : -1;

                                        // Style Lookup
                                        const currentStyle = (originalIndex !== -1 && styleOverrides[originalIndex])
                                            ? styleOverrides[originalIndex]
                                            : para.style;

                                        return (
                                            <div key={i} className="group relative mb-4" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {rightPaneMode === 'output' ? (
                                                        <select
                                                            value={currentStyle}
                                                            onChange={(e) => {
                                                                if (originalIndex !== -1) {
                                                                    setStyleOverrides(prev => ({ ...prev, [originalIndex]: e.target.value }));
                                                                }
                                                            }}
                                                            disabled={originalIndex === -1}
                                                            className={`bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded outline-none focus:ring-1 focus:ring-emerald-500 uppercase cursor-pointer appearance-none ${originalIndex === -1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            title={originalIndex === -1 ? "Template-generated content (cannot change style)" : `Mapped to Source ¶${originalIndex + 1}`}
                                                        >
                                                            {availableStyles.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    ) : (
                                                        <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase select-none">{para.style}</span>
                                                    )}
                                                    <div className={`h-[1px] flex-1 ${rightPaneMode === 'output' ? 'bg-emerald-100' : 'bg-blue-100'} opacity-30`}></div>
                                                </div>
                                                {para.style === "Table Placeholder" ? (
                                                    <div className="w-full my-4 bg-white border border-slate-200 shadow-sm">
                                                        {para.props.table_data ? (
                                                            <table className="w-full border-collapse border border-black text-[8pt] font-serif leading-none">
                                                                <tbody>
                                                                    <tr className="border-b border-black">
                                                                        {para.props.table_data[0]?.map((header: string, hIndex: number) => (
                                                                            <td key={hIndex} className="p-1 font-bold text-center border-b border-black">{header}</td>
                                                                        ))}
                                                                    </tr>
                                                                    {para.props.table_data.slice(1).map((row: string[], rIndex: number) => (
                                                                        <tr key={rIndex} className="border-b border-slate-200 last:border-black">
                                                                            {row.map((cell: string, cIndex: number) => (
                                                                                <td key={cIndex} className="p-1 text-left align-top">{cell}</td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <div className="text-center text-[9pt] italic py-2">Table Data Placeholder</div>
                                                        )}
                                                        <div className="bg-slate-50 text-[7pt] text-center text-slate-400 py-1">Table formatted to APA 7th Style (Horizontal Lines Only)</div>
                                                    </div>
                                                ) : para.style === "Image Placeholder" ? (
                                                    <div className="w-full my-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center py-8 px-4 select-none">
                                                        <div className="w-12 h-12 mb-2 opacity-20 bg-slate-900 mask-image">🖼️</div>
                                                        <span className="text-[10pt] font-bold text-slate-500 font-serif italic">Image Preserved</span>
                                                        <span className="text-[8pt] text-slate-400 mt-1">Content retained in final output</span>
                                                    </div>
                                                ) : (
                                                    <p
                                                        className="text-black"
                                                        style={{
                                                            fontFamily: "'Times New Roman', serif",
                                                            ...getStyleFormatting(currentStyle),
                                                        }}
                                                    >
                                                        {para.text}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    })
                                )
                                }
                                <div className="mt-20 pt-4 border-t border-slate-200 text-center text-[8pt] text-slate-400 italic">
                                    Copyright © GADING Journal. All rights reserved.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Status Bar */}
                <div className="h-6 mt-4 flex items-center justify-between px-4 bg-[#ff6b35] text-white text-[10px] font-medium rounded-md shadow-inner shrink-0">
                    <div className="flex gap-4">
                        <span>Page 1 of 1</span>
                        <span>{reviewData?.original?.length || 0} Paragraphs</span>
                        <span className="opacity-70">English (United States)</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Connected to GADING Engine
                        </span>
                        <span>100% Zoom</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
            {/* Header with Back Button */}
            <div className="absolute top-8 left-8">
                <a href="/" className="text-slate-400 hover:text-white text-sm font-bold transition">
                    &larr; Back to Home
                </a>
            </div>

            <div className="max-w-2xl w-full space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-center relative">
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        StyleLock
                    </h1>
                    <p className="mt-2 text-slate-400 font-medium">GADING Journal DOCX Formatting System</p>
                </div>

                <div className="space-y-6">
                    <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
                        <button
                            onClick={() => setUseSystemTemplate(true)}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${useSystemTemplate ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            System GADING Template
                        </button>
                        <button
                            onClick={() => setUseSystemTemplate(false)}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${!useSystemTemplate ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Manual Template
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-6 rounded-2xl border-2 border-dashed transition-all ${manuscript ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:border-blue-500/50'}`}>
                            <label className="block text-center cursor-pointer">
                                <span className="block text-sm font-semibold text-slate-300 mb-2">Manuscript</span>
                                <input type="file" className="hidden" onChange={(e) => setManuscript(e.target.files?.[0] || null)} />
                                <span className="text-xs text-slate-500 truncate block">
                                    {manuscript ? manuscript.name : "Select author submission"}
                                </span>
                            </label>
                        </div>
                        <div className={`p-6 rounded-2xl border-2 border-dashed transition-all ${useSystemTemplate ? 'opacity-50 border-slate-800' : (template ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 hover:border-blue-500/50')}`}>
                            <label className={`block text-center ${useSystemTemplate ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                <span className="block text-sm font-semibold text-slate-300 mb-2">Journal Template</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    disabled={useSystemTemplate}
                                    onChange={(e) => setTemplate(e.target.files?.[0] || null)}
                                />
                                <span className="text-xs text-slate-500 truncate block">
                                    {useSystemTemplate ? "Using default GADING template" : (template ? template.name : "Select UiTM template")}
                                </span>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={processing || !manuscript || (!template && !useSystemTemplate)}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Processing Manuscript...
                            </span>
                        ) : "Transform Document"}
                    </button>
                </div>

                {result && (
                    <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Processing Complete
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <a href={`${API_URL}${result.formatted_url}`} className="flex items-center justify-center p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5" download>
                                Download DOCX
                            </a>
                            <a href={`${API_URL}${result.report_url}`} className="flex items-center justify-center p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5" target="_blank" rel="noreferrer">
                                View Audit Report
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-8 text-slate-500 text-xs text-center max-w-md">
                This system enforces strict GADING Journal styling. <br />
                Editorial discipline, predictability, and compliance are guaranteed.
            </p>
        </div>
    );
}
