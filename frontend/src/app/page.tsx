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

  // Check health on mount
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

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const res = await analyzeEmergency({
      description,
      latitude,
      longitude,
    });

    setIsLoading(false);

    if (res.success && res.analysis) {
      setResponse(res);
      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById("results-section");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      setErrorMessage(res.error || "Failed to analyze emergency. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Header Banner */}
      <Header isBackendHealthy={isBackendHealthy} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 space-y-8">
        
        {/* Main Emergency Input Card */}
        <section className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Emergency Response Assistant
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Describe the medical or safety situation below for immediate AI analysis, first aid guidance, nearby hospital navigation, and SOS alert dispatch payload.
            </p>
          </div>

          {/* Exhibition Demo Presets */}
          <DemoPresets onSelectPreset={handlePresetSelect} disabled={isLoading} />

          {/* Emergency Text/Voice/Location Input Box */}
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

        {/* Global Error Notice Banner */}
        {errorMessage && (
          <div className="bg-red-950/80 border border-red-600/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-red-200 shadow-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
            <button
              onClick={handleSubmit}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-900 hover:bg-red-800 text-white font-semibold transition shrink-0 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading Indicator Indicator Bar */}
        {isLoading && (
          <div className="bg-slate-900/90 border border-red-600/40 rounded-2xl p-6 text-center space-y-3 shadow-2xl backdrop-blur animate-pulse">
            <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto">
              <Activity className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">RESQ AI Agentic Pipeline Executing...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Analyzing emergency prompt • Generating safe first aid guidance • Searching nearby hospitals • Synthesizing incident report
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {response && response.analysis && (
          <section id="results-section" className="space-y-6 pt-4 border-t border-slate-800/80">
            {/* 1. Severity & Category Badge */}
            <SeverityBadge analysis={response.analysis} />

            {/* 2. First Aid Guidance */}
            {response.first_aid && <FirstAidCard guidance={response.first_aid} />}

            {/* 3. Nearby Hospitals */}
            <HospitalList
              hospitals={response.hospitals}
              statusMessage={response.hospital_search_status}
              hasLocation={latitude !== null && longitude !== null}
            />

            {/* 4. Incident Summary Report */}
            {response.report && <ReportCard report={response.report} />}

            {/* 5. Prepared SOS Alert */}
            {response.alert && <AlertModal alert={response.alert} />}
          </section>
        )}
      </main>

      {/* Modern Minimal Footer */}
      <footer className="w-full border-t border-slate-800/60 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© RESQ AI — Agentic Emergency Response System (College Exhibition Prototype)</p>
          <p className="text-slate-400">In a real life-threatening emergency, dial <strong>112</strong> immediately.</p>
        </div>
      </footer>
    </div>
  );
}
