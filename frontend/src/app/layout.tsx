import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RESQ AI — Ambient Emergency Response",
  description: "AI-powered emergency response assistant providing instant severity classification, safe first aid protocols, nearby hospital navigation, and SOS alert preparation.",
  keywords: ["Emergency Response", "AI Triage", "First Aid", "SOS System", "Medical AI", "Health Tech"],
  authors: [{ name: "RESQ AI Team" }],
  openGraph: {
    title: "RESQ AI — Ambient Emergency Response",
    description: "AI-powered emergency response assistant providing instant severity classification, safe first aid protocols, nearby hospital navigation, and SOS alert preparation.",
    url: "https://resq-ai.com",
    siteName: "RESQ AI",
    images: [
      {
        url: "https://resq-ai.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RESQ AI Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RESQ AI — Ambient Emergency Response",
    description: "AI-powered emergency response assistant providing instant severity classification, safe first aid protocols, nearby hospital navigation, and SOS alert preparation.",
    images: ["https://resq-ai.com/og-image.jpg"],
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen selection:bg-brand-500/20 dark:selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-50 relative transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Ambient Mesh Background Elements (Adapts to Dark/Light) */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/15 dark:bg-brand-600/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-mesh opacity-70"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/15 dark:bg-blue-600/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-mesh opacity-70" style={{ animationDelay: "2s" }}></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-500/15 dark:bg-purple-600/10 blur-[130px] mix-blend-multiply dark:mix-blend-screen animate-mesh opacity-50" style={{ animationDelay: "4s" }}></div>
          </div>
          
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
