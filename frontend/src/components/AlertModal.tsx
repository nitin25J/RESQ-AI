"use client";

import React, { useState } from "react";
import { PreparedAlert } from "@/types/emergency";
import { Send, Copy, Check, Info, Radio, Activity } from "lucide-react";
import { autoDispatchAlert } from "@/lib/api";

interface AlertModalProps {
  alert: PreparedAlert;
}

export const AlertModal: React.FC<AlertModalProps> = ({ alert }) => {
  const [copied, setCopied] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  const handleCopy = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(alert.formatted_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAutoDispatch = async () => {
    setIsDispatching(true);
    setDispatchError(null);
    
    const response = await autoDispatchAlert(
      alert.formatted_text,
      alert.severity,
      alert.emergency_type
    );
    
    setIsDispatching(false);
    
    if (response.success) {
      setDispatchSuccess(true);
    } else {
      setDispatchError(response.message);
    }
  };

  const isHighPriority = alert.severity === "HIGH" || alert.severity === "CRITICAL";

  return (
    <div className="w-full ambient-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-500/30 border border-rose-400">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">Pre-formatted Dispatch</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">SOS Payload</h3>
          </div>
        </div>

        <span className="text-[10px] font-black px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 uppercase tracking-widest shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-sm" />
          Prepared Alert
        </span>
      </div>

      {/* Honesty Note Banner */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white dark:border-slate-800 rounded-2xl p-5 mb-6 flex items-start gap-4 shadow-sm">
        <Info className="w-6 h-6 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[13px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Notice:</strong> This is a pre-formatted emergency dispatch payload prepared locally by RESQ AI. <strong className="text-brand-600 dark:text-brand-400">No background cellular SMS was dispatched automatically.</strong> You can auto-dispatch via server below.
        </p>
      </div>

      {/* Formatted Text Payload Box */}
      <div className="relative bg-slate-900 dark:bg-black/50 rounded-3xl p-7 mb-6 shadow-xl shadow-slate-900/10 dark:shadow-black/20 border border-slate-800 dark:border-slate-700/50">
        <pre className="text-[14px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed pr-12">
          {alert.formatted_text}
        </pre>

        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-5 right-5 p-3 rounded-xl bg-slate-800 dark:bg-slate-800/80 hover:bg-slate-700 dark:hover:bg-slate-700/80 text-slate-300 transition-all flex items-center justify-center group border border-slate-700 dark:border-slate-600 active:scale-95 shadow-sm"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-5 h-5 text-emerald-400" />
          ) : (
            <Copy className="w-5 h-5 text-slate-400 group-hover:text-white" />
          )}
        </button>
      </div>

      {/* Native Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 mt-2">
        <p className="text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
          Ready for dispatch
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* High Priority Auto-Dispatch Button */}
          {isHighPriority && (
            <button
              onClick={handleAutoDispatch}
              disabled={isDispatching || dispatchSuccess}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-lg border ${
                dispatchSuccess 
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30 cursor-default" 
                  : isDispatching
                    ? "bg-slate-800 text-slate-300 border-slate-700 cursor-wait"
                    : "bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-rose-600/30 border-rose-400 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {dispatchSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Alert Dispatched Successfully</span>
                </>
              ) : isDispatching ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Dispatching to Twilio Gateway...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Auto-Dispatch via Server</span>
                </>
              )}
            </button>
          )}

          {alert.sms_uri && (
            <a
              href={alert.sms_uri}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-slate-900/20 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 border border-slate-700 dark:border-slate-600"
            >
              <Send className="w-4 h-4" />
              <span>Launch Native SMS</span>
            </a>
          )}
        </div>
      </div>
      
      {dispatchError && (
        <p className="text-red-500 text-xs text-right font-semibold mt-3">
          Failed to dispatch: {dispatchError}
        </p>
      )}
    </div>
  );
};
