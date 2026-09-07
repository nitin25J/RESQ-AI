"use client";

import React, { useState } from "react";
import { PreparedAlert } from "@/types/emergency";
import { Send, Copy, Check, Info } from "lucide-react";

interface AlertModalProps {
  alert: PreparedAlert;
}

export const AlertModal: React.FC<AlertModalProps> = ({ alert }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(alert.formatted_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800/40">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Prepared Emergency SOS Payload</h3>
            <p className="text-xs text-slate-400">Pre-formatted dispatch alert message</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-800/60 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Demo / Prepared Alert
        </span>
      </div>

      {/* Honesty Note Banner */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-4 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-snug">
          <strong>Notice:</strong> This is a pre-formatted emergency dispatch payload prepared by RESQ AI. No background cellular SMS was dispatched automatically. You can copy the message or trigger a native SMS draft below.
        </p>
      </div>

      {/* Formatted Text Payload Box */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4">
        <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
          {alert.formatted_text}
        </pre>

        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Text</span>
            </>
          )}
        </button>
      </div>

      {/* Native Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <p className="text-xs text-slate-400">
          Ready for dispatch via native SMS or local emergency contacts.
        </p>

        {alert.sms_uri && (
          <a
            href={alert.sms_uri}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch Native SMS Draft</span>
          </a>
        )}
      </div>
    </div>
  );
};
