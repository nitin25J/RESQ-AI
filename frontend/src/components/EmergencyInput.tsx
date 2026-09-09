"use client";

import React, { useRef, useEffect, useState } from "react";
import { Mic, MapPin, Send, AlertCircle, X, Activity, Loader2 } from "lucide-react";
import { generateTriageQuestions } from "@/lib/api";

interface EmergencyInputProps {
  description: string;
  setDescription: (val: string) => void;
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number | null, lng: number | null) => void;
  onSubmit: (triageAnswers?: Record<string, string>) => void;
  isLoading: boolean;
}

export const EmergencyInput: React.FC<EmergencyInputProps> = ({
  description,
  setDescription,
  latitude,
  longitude,
  setLocation,
  onSubmit,
  isLoading,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Triage Modal State
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [triageQuestions, setTriageQuestions] = useState<string[]>([]);
  const [triageAnswers, setTriageAnswers] = useState<Record<string, string>>({});
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setDescription(description + (description ? " " : "") + finalTranscript);
          }
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [description, setDescription]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleGetLocation = () => {
    setLocError(null);
    setIsLocating(true);
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        setLocError(err.message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const initiateAnalysis = async () => {
    if (!description.trim()) return;
    
    setIsGeneratingQuestions(true);
    // Fetch dynamic questions from backend
    const questions = await generateTriageQuestions(description);
    
    setTriageQuestions(questions);
    setTriageAnswers({});
    setIsGeneratingQuestions(false);
    setShowTriageModal(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      initiateAnalysis();
    }
  };

  const confirmTriageAndSubmit = () => {
    setShowTriageModal(false);
    onSubmit(triageAnswers);
  };

  return (
    <>
      <div className="ambient-card p-3 sm:p-5">
        <div className={`relative rounded-[1.25rem] bg-white/90 dark:bg-slate-950/80 backdrop-blur-lg border transition-all duration-300 overflow-hidden ${
          isListening ? "border-brand-300 dark:border-brand-600 shadow-[0_0_0_4px_rgba(239,68,68,0.1)] dark:shadow-[0_0_0_4px_rgba(239,68,68,0.2)]" : "border-slate-200/70 dark:border-slate-800/70 focus-within:border-brand-300 dark:focus-within:border-brand-600 focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.1)] dark:focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.2)]"
        }`}>
          
          {isListening && (
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400">Recording</span>
            </div>
          )}

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the medical emergency here (e.g. 'A person fell and hit their head, they are unconscious...')"
            className="w-full min-h-[160px] bg-transparent resize-none outline-none p-6 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-lg leading-relaxed font-medium transition-colors"
            disabled={isLoading || isGeneratingQuestions}
          />
        </div>

        {locError && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-bold px-2">
            <AlertCircle className="w-3.5 h-3.5" />
            {locError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 px-1">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading || !recognitionRef.current || isGeneratingQuestions}
              className={`flex-1 sm:flex-none text-sm font-bold px-5 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                isListening
                  ? "bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800 shadow-inner"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 active:scale-95"
              } disabled:opacity-50`}
            >
              <Mic className={`w-4 h-4 ${isListening ? "animate-pulse text-brand-500 dark:text-brand-400" : ""}`} />
              {isListening ? "Stop Voice" : "Voice Input"}
            </button>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLoading || isLocating || isGeneratingQuestions}
              className={`flex-1 sm:flex-none text-sm font-bold px-5 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                latitude !== null
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 shadow-inner"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 active:scale-95"
              } disabled:opacity-50`}
            >
              <MapPin className="w-4 h-4" />
              {isLocating ? "Locating..." : latitude ? "Location Ready" : "Use Location"}
            </button>
          </div>

          <button
            type="button"
            onClick={initiateAnalysis}
            disabled={isLoading || !description.trim() || isGeneratingQuestions}
            className="w-full sm:w-auto text-sm font-black px-10 py-3.5 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 active:scale-95 border border-brand-400 dark:border-brand-500"
          >
            {isGeneratingQuestions ? (
              <>
                <span>Preparing Triage...</span>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                <span>Analyze Emergency</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Triage Modal */}
      {showTriageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">Emergency Triage</h3>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">Please answer these questions</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTriageModal(false)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-6">
                To provide the most accurate medical guidance for this specific situation, we need to quickly confirm a few details.
              </p>
              
              <div className="space-y-6">
                {triageQuestions.map((question, idx) => (
                  <div key={idx} className="space-y-3">
                    <label className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      <span className="text-brand-500 mr-2">{idx + 1}.</span> 
                      {question}
                    </label>
                    <div className="flex gap-2">
                      {['Yes', 'No', 'Unsure'].map((ans) => {
                        const isSelected = triageAnswers[question] === ans;
                        return (
                          <button
                            key={ans}
                            onClick={() => setTriageAnswers({ ...triageAnswers, [question]: ans })}
                            className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all active:scale-95 ${
                              isSelected 
                                ? ans === 'Yes' ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-500 text-rose-700 dark:text-rose-300' 
                                : ans === 'No' ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300' 
                                : 'bg-slate-200 dark:bg-slate-800 border-slate-500 text-slate-700 dark:text-slate-300'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            {ans}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
              <button
                onClick={() => setShowTriageModal(false)}
                className="px-5 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmTriageAndSubmit}
                disabled={Object.keys(triageAnswers).length !== triageQuestions.length}
                className="flex-1 px-5 py-3 rounded-xl font-black bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                Confirm & Analyze
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
