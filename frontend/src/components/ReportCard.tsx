"use client";

import React from "react";
import { EmergencyReport } from "@/types/emergency";
import { ClipboardList, Clock, MapPin } from "lucide-react";

interface ReportCardProps {
  report: EmergencyReport;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const formattedDate = new Date(report.timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="w-full ambient-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">Synthesized Workflow</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Incident Report</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-slate-300 font-mono font-bold bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span className="uppercase">{formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-2">Incident Category</p>
          <p className="text-[15px] font-black text-slate-800 dark:text-slate-200">{report.emergency_type}</p>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-2">Severity Rating</p>
          <p className="text-[15px] font-black text-brand-600 dark:text-brand-400 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 shadow-sm"></span>
            {report.severity}
          </p>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-center md:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            Location Status
          </p>
          <p className="text-[15px] font-bold text-slate-800 dark:text-slate-200">{report.location_status}</p>
        </div>
      </div>
    </div>
  );
};
