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
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800/40">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Structured Incident Report</h3>
            <p className="text-xs text-slate-400">Synthesized workflow summary</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Incident Category</p>
          <p className="font-bold text-slate-200 text-sm">{report.emergency_type}</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-500 uppercase tracking-wider font-semibold mb-1">Severity Rating</p>
          <p className="font-bold text-red-400 text-sm">{report.severity}</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-start gap-2">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Location Status</p>
            <p className="font-medium text-slate-300">{report.location_status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
