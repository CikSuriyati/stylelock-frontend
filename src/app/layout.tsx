import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleLock — GADING Editorial Suite",
  description: "Enterprise formatting system for GADING Journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
