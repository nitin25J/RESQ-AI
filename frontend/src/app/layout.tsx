import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RESQ AI — Agentic Emergency Response System",
  description:
    "AI-powered emergency response assistant providing instant severity classification, safe first aid protocols, nearby hospital navigation, and SOS alert preparation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
