"use client";

import React from "react";
import { FirstAidGuidance } from "@/types/emergency";
import { Cross, ShieldAlert, AlertTriangle, PhoneCall } from "lucide-react";

interface FirstAidCardProps {
  guidance: FirstAidGuidance;
}

export const FirstAidCard: React.FC<FirstAidCardProps> = ({ guidance }) => {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
        <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800/40">
          <Cross className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-100">Immediate First Aid Protocol</h3>
      </div>

      {/* Emergency Callout Box */}
      {guidance.escalation_message && (
        <div className="mb-5 bg-red-950/60 border-2 border-red-600/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-red-950/30">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs uppercase font-bold text-red-300 tracking-wider">Emergency Escalation Notice</p>
              <p className="text-sm font-semibold text-white mt-0.5">{guidance.escalation_message}</p>
            </div>
          </div>
          <a
            href="tel:112"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Dial 112
          </a>
        </div>
      )}

      {/* Numbered Immediate Actions */}
      <div className="mb-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
          1. Step-by-Step Immediate Actions
        </h4>
        <ol className="space-y-2.5">
          {guidance.immediate_actions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
              <span className="w-6 h-6 rounded-full bg-red-900/60 text-red-300 font-bold text-xs flex items-center justify-center shrink-0 border border-red-700/50">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-200 leading-snug">{action}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Things to Avoid */}
      {guidance.things_to_avoid && guidance.things_to_avoid.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            2. Critical Things to Avoid
          </h4>
          <ul className="space-y-2">
            {guidance.things_to_avoid.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-amber-950/30 border border-amber-500/20 rounded-xl p-3">
                <span className="text-amber-400 font-bold text-sm leading-none shrink-0">•</span>
                <p className="text-xs text-amber-200/90 leading-snug">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
