"use client";

import React from "react";
import { EmergencyAnalysis, SeverityLevel } from "@/types/emergency";
import { AlertCircle, AlertTriangle, Info, Flame, Eye, HeartPulse, Stethoscope } from "lucide-react";

interface SeverityBadgeProps {
  analysis: EmergencyAnalysis;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ analysis }) => {
  const getSeverityStyle = (severity: SeverityLevel) => {
    switch (severity) {
      case "CRITICAL":
        return {
          bg: "bg-red-950/80 border-red-600/80 text-red-100",
          badge: "bg-red-600 text-white font-bold animate-pulse",
          icon: AlertCircle,
        };
      case "HIGH":
        return {
          bg: "bg-orange-950/70 border-orange-600/70 text-orange-100",
          badge: "bg-orange-600 text-white font-semibold",
          icon: AlertTriangle,
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-950/60 border-amber-600/60 text-amber-100",
          badge: "bg-amber-600 text-white font-semibold",
          icon: Info,
        };
      case "LOW":
      default:
        return {
          bg: "bg-sky-950/60 border-sky-600/60 text-sky-100",
          badge: "bg-sky-600 text-white font-semibold",
          icon: Info,
        };
    }
  };

  const style = getSeverityStyle(analysis.severity);
  const Icon = style.icon;

  return (
    <div className={`w-full border rounded-2xl p-5 shadow-xl backdrop-blur transition-all ${style.bg}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-black/30 border border-white/10">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold opacity-75">Identified Category</p>
            <h2 className="text-lg font-bold text-white">{analysis.emergency_type}</h2>
          </div>
        </div>

        {/* Prominent Severity Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider opacity-80">Severity Level:</span>
          <span className={`px-3.5 py-1 rounded-full text-xs uppercase tracking-wider ${style.badge}`}>
            {analysis.severity}
          </span>
        </div>
      </div>

      {/* Observations */}
      {analysis.observations && analysis.observations.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            Key Vital Observations:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.observations.map((obs, idx) => (
              <li key={idx} className="text-xs bg-black/20 border border-white/5 rounded-lg p-2.5 text-slate-200">
                • {obs}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Structured Vital Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
        {analysis.victim_conscious && (
          <span className="px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-slate-300 flex items-center gap-1">
            <HeartPulse className="w-3 h-3 text-red-400" />
            Conscious: <strong>{analysis.victim_conscious}</strong>
          </span>
        )}
        {analysis.visible_bleeding && (
          <span className="px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-slate-300 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            Bleeding: <strong>{analysis.visible_bleeding}</strong>
          </span>
        )}
        {analysis.breathing_concern && (
          <span className="px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-slate-300 flex items-center gap-1">
            <Stethoscope className="w-3 h-3 text-sky-400" />
            Breathing Concern: <strong>{analysis.breathing_concern}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
