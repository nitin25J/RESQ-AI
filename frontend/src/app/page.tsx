"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { EmergencyInput } from "@/components/EmergencyInput";
import { DemoPresets } from "@/components/DemoPresets";
import { SeverityBadge } from "@/components/SeverityBadge";
import { FirstAidCard } from "@/components/FirstAidCard";
import { HospitalList } from "@/components/HospitalList";
import { ReportCard } from "@/components/ReportCard";
import { AlertModal } from "@/components/AlertModal";
import { analyzeEmergency, checkBackendHealth } from "@/lib/api";
import { EmergencyResponse } from "@/types/emergency";
import { AlertTriangle, Activity, RefreshCw } from "lucide-react";

export default function Home() {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<EmergencyResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);

  useEffect(() => {
    async function verifyHealth() {
      const health = await checkBackendHealth();
      setIsBackendHealthy(health.healthy);
    }
    verifyHealth();
  }, []);

  const handleLocationChange = (lat: number | null, lng: number | null) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handlePresetSelect = (presetText: string) => {
    setDescription(presetText);
  };

  const handleSubmit = async (triageAnswers?: Record<string, string>) => {
    if (!description.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    const res = await analyzeEmergency({ description, latitude, longitude, triage_answers: triageAnswers });
    setIsLoading(false);

    if (res.success && res.analysis) {
      setResponse(res);
      setTimeout(() => {
        const resultsEl = document.getElementById("results-section");
        if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setErrorMessage(res.error || "Failed to analyze emergency. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Header isBackendHealthy={isBackendHealthy} />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        
        <div className="max-w-6xl mx-auto space-y-12">
          
          <section className="space-y-6 max-w-4xl mx-auto text-center sm:text-left mt-4 mb-8 animate-slide-up">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-500 pb-2 transition-colors">
              Agentic Emergency Response
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed transition-colors">
              Describe the medical or safety situation below. AI will instantly synthesize severity, first aid guidance, nearest verified hospitals, and prepare an SOS payload.
            </p>
          </section>

          <section className="max-w-4xl mx-auto space-y-6 relative z-20 animate-slide-up animate-delay-100">
            <DemoPresets onSelectPreset={handlePresetSelect} disabled={isLoading} />
            <EmergencyInput
              description={description}
              setDescription={setDescription}
              latitude={latitude}
              longitude={longitude}
              setLocation={handleLocationChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </section>



          {errorMessage && (
            <div className="max-w-4xl mx-auto bg-red-50/80 dark:bg-red-950/50 backdrop-blur-xl border border-red-200/60 dark:border-red-900/50 rounded-[2rem] p-5 flex items-center justify-between gap-3 text-red-900 dark:text-red-200 animate-slide-up shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-sm font-semibold">{errorMessage}</p>
              </div>
              <button
                onClick={() => handleSubmit()}
                className="text-xs px-5 py-2.5 rounded-xl bg-white dark:bg-red-900 hover:bg-red-50 dark:hover:bg-red-800 text-red-700 dark:text-red-100 font-bold transition shrink-0 flex items-center gap-1.5 border border-red-200 dark:border-red-800 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {isLoading && (
            <div className="max-w-4xl mx-auto ambient-card p-12 text-center space-y-5 animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-800 text-brand-600 dark:text-brand-300 flex items-center justify-center mx-auto shadow-inner border border-brand-200 dark:border-brand-700">
                <Activity className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">Analyzing Scenario...</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                  Synthesizing protocols • Locating dispatch centers • Preparing response
                </p>
              </div>
            </div>
          )}

          {response && response.analysis && (
            <section id="results-section" className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                <div className="lg:col-span-5 space-y-6 sm:space-y-8 animate-slide-up animate-delay-200">
                  <SeverityBadge analysis={response.analysis} />
                  {response.report && <ReportCard report={response.report} />}
                  {response.alert && <AlertModal alert={response.alert} />}
                </div>
                <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-slide-up animate-delay-300">
                  {response.first_aid && <FirstAidCard guidance={response.first_aid} />}
                  <HospitalList
                    hospitals={response.hospitals}
                    statusMessage={response.hospital_search_status}
                    hasLocation={latitude !== null && longitude !== null}
                  />
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      <footer className="w-full bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto relative z-10 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold">© RESQ AI — Agentic Emergency Response System</p>
          <p className="font-semibold text-slate-600 dark:text-slate-400">In a real life-threatening emergency, dial <strong className="text-brand-600 dark:text-brand-400">112</strong> immediately.</p>
        </div>
      </footer>
    </div>
  );
}
