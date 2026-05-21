"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ReferencePage() {
    const [inputObj, setInputObj] = useState("");
    const [output, setOutput] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleFormat = async () => {
        if (!inputObj.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/tools/format-references`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputObj })
            });
            const data = await res.json();
            if (res.ok) {
                setOutput(data);
            } else {
                alert("Error: " + data.detail);
            }
        } catch (e) {
            alert("Failed to connect to backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full overflow-auto bg-white font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center py-12 px-4">
            {/* Navbar / Header */}
            <div className="w-full max-w-7xl mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <h1 className="text-2xl font-bold tracking-tight text-[#ff6b35] hover:opacity-80 transition cursor-pointer">
                            StyleLock <span className="text-[#5a5a5a] font-normal text-lg">| Reference Tool</span>
                        </h1>
                    </Link>
                </div>
                <Link href="/" className="text-[#0066cc] hover:text-[#0052a3] text-sm font-semibold transition flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Home
                </Link>
            </div>

            {/* Main Glass Card */}
            <div className="w-full max-w-7xl flex-1 rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-[rgba(12,18,35,0.8)] backdrop-blur-[20px] border border-white/10">
                {/* Header */}
                <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <div>
                        <h2 className="text-xl font-bold text-white">Quick Reference Formatter</h2>
                        <p className="text-sm text-white/60">Paste raw text, get APA 7th layout instantly.</p>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Input */}
                    <div className="flex-1 p-6 flex flex-col border-r border-white/10 bg-white/5">
                        <label className="text-xs font-bold text-[#7c3aed] uppercase mb-3 tracking-wider">Source Text (Paste Here)</label>
                        <textarea
                            className="flex-1 w-full p-4 rounded-xl border border-white/10 bg-black/20 text-sm font-sans text-white focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent outline-none resize-none placeholder-white/20 transition-all"
                            placeholder="Paste reference list here..."
                            value={inputObj}
                            onChange={(e) => setInputObj(e.target.value)}
                        />
                        <button
                            onClick={handleFormat}
                            disabled={loading || !inputObj}
                            className="mt-6 w-full py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : "Format to APA 7th"}
                        </button>
                    </div>

                    {/* Output */}
                    <div className="flex-1 p-6 flex flex-col bg-black/20">
                        <label className="text-xs font-bold text-[#0066cc] uppercase mb-3 tracking-wider">Formatted Result (APA 7th)</label>
                        <div className="flex-1 border border-white/10 rounded-xl bg-white/5 overflow-y-auto p-8 shadow-inner relative">
                            {output ? (
                                <div className="space-y-4">
                                    {output.preview.map((item: any, i: number) => (
                                        <div key={i} style={item.css} className="text-white/90">
                                            {/* Override color in item.css didn't work because styles are inline, but text-white/90 helps basic text. 
                           However, `item.css` likely has `color: black` or similar? 
                           The backend doesn't send color. It sends font-family etc. 
                           So text-white/90 should work. */}
                                            <span dangerouslySetInnerHTML={{ __html: item.text }} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                                    <span className="text-5xl mb-4">✨</span>
                                    <span className="text-sm font-medium">Result will appear here</span>
                                </div>
                            )}
                        </div>

                        {output && (
                            <div className="mt-6 flex gap-3">
                                <a href={`${API_URL}${output.download_url}`} className="flex-1 py-4 bg-[#0066cc] hover:bg-[#0052a3] text-white rounded-xl font-bold shadow-lg text-center transition-all transform active:scale-[0.98]">
                                    Download .docx
                                </a>
                                <button onClick={() => {
                                    const text = output.preview.map((i: any) => i.text).join('\n');
                                    navigator.clipboard.writeText(text);
                                    alert("Copied raw text (Note: Indents may not copy to plain text editors. Use Download for Word.)");
                                }} className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10">
                                    Copy Text
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center mt-12">
                <p className="text-xs text-[#999999]">
                    © 2026 StyleLock for GADING Journal. Enterprise Formatting System.
                </p>
            </footer>
        </div>
    );
}
