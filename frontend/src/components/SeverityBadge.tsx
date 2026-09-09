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
          bg: "bg-red-50/50 dark:bg-red-950/20",
          badge: "bg-gradient-to-r from-brand-500 to-brand-600 text-white font-black shadow-lg shadow-brand-600/30",
          icon: AlertCircle,
          iconColor: "text-brand-600 dark:text-brand-400",
          iconBg: "bg-brand-100 dark:bg-brand-900/50",
        };
      case "HIGH":
        return {
          bg: "bg-orange-50/50 dark:bg-orange-950/20",
          badge: "bg-gradient-to-r from-orange-400 to-orange-500 text-white font-black shadow-lg shadow-orange-500/30",
          icon: AlertTriangle,
          iconColor: "text-orange-600 dark:text-orange-400",
          iconBg: "bg-orange-100 dark:bg-orange-900/50",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-50/50 dark:bg-amber-950/20",
          badge: "bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black shadow-md shadow-amber-500/20",
          icon: Info,
          iconColor: "text-amber-600 dark:text-amber-400",
          iconBg: "bg-amber-100 dark:bg-amber-900/50",
        };
      case "LOW":
      default:
        return {
          bg: "bg-blue-50/50 dark:bg-blue-950/20",
          badge: "bg-gradient-to-r from-blue-400 to-blue-500 text-white font-black shadow-md shadow-blue-500/20",
          icon: Info,
          iconColor: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-100 dark:bg-blue-900/50",
        };
    }
  };

  const style = getSeverityStyle(analysis.severity);
  const Icon = style.icon;

  return (
    <div className={`w-full ambient-card p-6 sm:p-8 transition-all ${style.bg}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6 mb-6">
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl ${style.iconBg} shadow-sm border border-white dark:border-slate-800`}>
            <Icon className={`w-8 h-8 ${style.iconColor}`} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">Identified Emergency</p>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">{analysis.emergency_type}</h2>
          </div>
        </div>

        {/* Prominent Severity Tag */}
        <div className="flex flex-col items-end gap-1.5 shrink-0 mt-1 sm:mt-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Severity</span>
          <span className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest ${style.badge}`}>
            {analysis.severity}
          </span>
        </div>
      </div>

      {/* Observations */}
      {analysis.observations && analysis.observations.length > 0 && (
        <div className="mb-6">
          <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Key Vital Observations
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.observations.map((obs, idx) => (
              <li key={idx} className="text-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white dark:border-slate-700/50 rounded-xl p-4 text-slate-700 dark:text-slate-200 shadow-sm flex items-start gap-2 font-medium hover:shadow-md transition-shadow">
                <span className="text-brand-500 dark:text-brand-400 font-black mt-0.5">•</span>
                <span className="leading-snug">{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Structured Vital Chips */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {analysis.victim_conscious && (
          <div className="px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-white dark:border-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center gap-2 text-xs font-semibold shadow-sm hover:shadow-md transition-shadow cursor-default">
            <HeartPulse className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            <span>Conscious: <strong className="text-slate-900 dark:text-white">{analysis.victim_conscious}</strong></span>
          </div>
        )}
        {analysis.visible_bleeding && (
          <div className="px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-white dark:border-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center gap-2 text-xs font-semibold shadow-sm hover:shadow-md transition-shadow cursor-default">
            <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            <span>Bleeding: <strong className="text-slate-900 dark:text-white">{analysis.visible_bleeding}</strong></span>
          </div>
        )}
        {analysis.breathing_concern && (
          <div className="px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-white dark:border-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center gap-2 text-xs font-semibold shadow-sm hover:shadow-md transition-shadow cursor-default">
            <Stethoscope className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>Breathing: <strong className="text-slate-900 dark:text-white">{analysis.breathing_concern}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
