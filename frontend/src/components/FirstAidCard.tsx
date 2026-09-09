"use client";

import React from "react";
import { FirstAidGuidance } from "@/types/emergency";
import { Cross, ShieldAlert, AlertTriangle, PhoneCall } from "lucide-react";

interface FirstAidCardProps {
  guidance: FirstAidGuidance;
}

export const FirstAidCard: React.FC<FirstAidCardProps> = ({ guidance }) => {
  return (
    <div className="w-full ambient-card p-6 sm:p-8">
      <div className="flex items-center gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-5 mb-6">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400">
          <Cross className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">Medical Action Plan</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Immediate First Aid</h3>
        </div>
      </div>

      {/* Emergency Callout Box */}
      {guidance.escalation_message && (
        <div className="mb-8 bg-brand-50/80 dark:bg-brand-950/40 backdrop-blur-md border-l-4 border-brand-500 rounded-r-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] uppercase font-black text-brand-700 dark:text-brand-400 tracking-widest mb-1">Emergency Escalation</p>
              <p className="text-sm font-bold text-brand-900 dark:text-brand-200 leading-snug">{guidance.escalation_message}</p>
            </div>
          </div>
          <a
            href="tel:112"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-brand-600/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 border border-brand-400 dark:border-brand-500"
          >
            <PhoneCall className="w-4 h-4" />
            Dial 112
          </a>
        </div>
      )}

      {/* Numbered Immediate Actions */}
      <div className="mb-8">
        <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-2">
          Step-by-Step Actions
        </h4>
        <div className="space-y-4">
          {guidance.immediate_actions.map((action, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow group">
              <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-black text-sm flex items-center justify-center shrink-0 shadow-sm border border-emerald-200 dark:border-emerald-800 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-white transition-colors">
                {idx + 1}
              </span>
              <p className="text-[15px] text-slate-800 dark:text-slate-200 leading-relaxed font-semibold mt-1">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Things to Avoid */}
      {guidance.things_to_avoid && guidance.things_to_avoid.length > 0 && (
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
          <h4 className="text-[12px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-5 flex items-center gap-2">
            Critical Things to Avoid
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guidance.things_to_avoid.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-orange-50/80 dark:bg-orange-950/40 backdrop-blur-md border border-orange-100 dark:border-orange-900/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0 mt-0.5" />
                <p className="text-[14px] text-orange-900 dark:text-orange-200 font-bold leading-snug">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
