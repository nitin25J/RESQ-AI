"use client";

import React from "react";
import { ShieldAlert, Activity, AlertTriangle, Moon, Sun, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

interface HeaderProps {
  isBackendHealthy: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isBackendHealthy }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40 border-b border-white dark:border-slate-800 shadow-sm transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand, Title & Navigation */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <Link href="/" className="flex items-center gap-2.5 group">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">RESQ AI</h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 shadow-sm uppercase tracking-wider transition-colors">
                  Agentic SOS
                </span>
              </Link>
            </div>
          </div>
          
          <nav className="hidden sm:flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            <Link href="/" className="px-4 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
              Scanner
            </Link>
            <Link href="/library" className="px-4 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Library
            </Link>
          </nav>
        </div>

        {/* Status & Theme Toggle */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors">
            <Activity className={`w-3.5 h-3.5 ${isBackendHealthy ? "text-emerald-500" : "text-amber-500"}`} />
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              Backend: {isBackendHealthy ? "Online" : "Connecting..."}
            </span>
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-rose-50/80 dark:bg-rose-950/40 backdrop-blur-2xl border-b border-rose-200/50 dark:border-rose-900/50 px-4 py-3 transition-colors relative overflow-hidden animate-slide-down shadow-sm">
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 border-b border-rose-400/30 dark:border-rose-500/30 animate-pulse-glow pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2.5 text-rose-900 dark:text-rose-100">
            <div className="p-1.5 rounded-full bg-rose-200/50 dark:bg-rose-900/50">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm font-semibold tracking-wide">
              <strong className="text-rose-700 dark:text-rose-300 mr-1">MEDICAL EMERGENCY?</strong> 
              Call emergency services immediately.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a 
              href="tel:112" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-950 hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_rgba(244,63,94,0.15)] dark:shadow-none border border-rose-100 dark:border-rose-900/50 active:scale-95"
            >
              <span>112</span>
              <span className="text-[9px] opacity-70 border-l border-rose-200 dark:border-rose-800 pl-2">Police</span>
            </a>
            
            <a 
              href="tel:108" 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md text-rose-600 dark:text-rose-400 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-950 hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_rgba(244,63,94,0.15)] dark:shadow-none border border-rose-100 dark:border-rose-900/50 active:scale-95"
            >
              <span>108</span>
              <span className="text-[9px] opacity-70 border-l border-rose-200 dark:border-rose-800 pl-2">Ambulance</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
