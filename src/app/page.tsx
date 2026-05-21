"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full overflow-auto bg-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Gradient equivalent to provided HTML's gradient-bg (white) but we can spice it up if needed.
          Keeping it simple white as per user code .gradient-bg { background: #ffffff; } */}

      <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-[#ff6b35]">
            StyleLock
          </h1>
          <p className="text-lg sm:text-xl tracking-widest uppercase text-[#5a5a5a]">
            GADING Journal Automation Suite
          </p>
        </div>

        {/* Feature Cards */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20 px-2">

          {/* Left Card: Manuscript Formatter */}
          <Link href="/formatter" className="group">
            <div className="relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ease-out shadow-2xl h-full border border-white/10 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-[rgba(12,18,35,0.8)] backdrop-blur-[20px] hover:bg-[rgba(12,18,35,0.9)] hover:border-[rgba(255,255,255,0.18)]">
              {/* Document Icon */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-white/25">
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 pr-12 text-white">
                Manuscript Formatter
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-6 text-white/80">
                Full-document DOCX formatting engine designed specifically for academic journal submissions. Automatically applies consistent styling, heading hierarchy, citation formats, and layout standards to ensure compliance with GADING Journal requirements.
              </p>

              <span className="text-[#0066cc] group-hover:text-[#0052a3] text-sm sm:text-base font-semibold inline-flex items-center gap-2 transition-colors duration-200">
                Launch Editor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Right Card: APA 7th Reference Tool */}
          <Link href="/references" className="group">
            <div className="relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ease-out shadow-2xl h-full border border-white/10 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] bg-[rgba(12,18,35,0.8)] backdrop-blur-[20px] hover:bg-[rgba(12,18,35,0.9)] hover:border-[rgba(255,255,255,0.18)]">
              {/* Reference Icon */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-white/25">
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 pr-12 text-white">
                APA 7th Reference Tool
              </h2>
              <p className="text-sm sm:text-base leading-relaxed mb-6 text-white/80">
                Automated APA 7th Edition reference formatting and validation system. Detects citation errors, corrects formatting inconsistencies, and generates properly structured reference lists with DOI linking and author name standardization.
              </p>

              <span className="text-[#7c3aed] group-hover:text-[#6d28d9] text-sm sm:text-base font-semibold inline-flex items-center gap-2 transition-colors duration-200">
                Launch Tool
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-xs sm:text-sm tracking-wide text-[#999999]">
            © 2026 StyleLock for GADING Journal. Enterprise Formatting System.
          </p>
        </footer>

      </div>
    </div>
  );
}
