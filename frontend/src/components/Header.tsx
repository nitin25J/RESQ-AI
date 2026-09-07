"use client";

import React from "react";
import { ShieldAlert, Activity, AlertTriangle } from "lucide-react";

interface HeaderProps {
  isBackendHealthy: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isBackendHealthy }) => {
  return (
    <header className="w-full bg-slate-900/80 border-b border-slate-800 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">RESQ AI</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-red-950 text-red-400 border border-red-800/50">
                Agentic SOS
              </span>
            </div>
            <p className="text-xs text-slate-400">Emergency Response Assistant</p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
            <Activity className={`w-3.5 h-3.5 ${isBackendHealthy ? "text-emerald-400 animate-pulse" : "text-amber-400"}`} />
            <span className="text-slate-300 font-medium">
              Backend: {isBackendHealthy ? "Online" : "Connecting..."}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="bg-amber-950/40 border-y border-amber-500/20 px-4 py-1.5 text-center">
        <p className="text-xs text-amber-200/90 flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Medical Safety Note:</strong> ResQ AI provides general emergency assistance and does not replace medical professionals. In a real emergency, dial <strong>112</strong> immediately.
          </span>
        </p>
      </div>
    </header>
  );
};
