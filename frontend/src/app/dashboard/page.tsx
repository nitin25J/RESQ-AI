"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldAlert, MapPin, Radio, AlertTriangle, X, Navigation } from "lucide-react";
import { Header } from "@/components/Header";
import { checkBackendHealth } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://resq-ai-ls67.onrender.com";

interface DispatchAlert {
  dispatch_id: string;
  emergency_type: string;
  severity: string;
  text: string;
  timestamp: string;
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState<DispatchAlert[]>([]);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<DispatchAlert | null>(null);

  useEffect(() => {
    async function verifyHealth() {
      const health = await checkBackendHealth();
      setIsBackendHealthy(health.healthy);
    }
    verifyHealth();

    // Connect to Server-Sent Events (SSE) Stream
    const eventSource = new EventSource(`${API_BASE_URL}/api/dispatch-stream`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newAlert: DispatchAlert = {
          ...data,
          timestamp: new Date().toLocaleTimeString(),
        };
        
        // Play an alert sound
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play().catch(() => {}); // Catch if browser blocks autoplay

        setAlerts((prev) => [newAlert, ...prev]);
      } catch (e) {
        console.error("Failed to parse SSE data", e);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      // EventSource automatically attempts to reconnect
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans flex flex-col relative overflow-hidden transition-colors duration-500">
      {/* Ambient Background specific to Dashboard */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-rose-500/10 dark:bg-rose-500/20 blur-[100px]"></div>
      </div>

      <Header isBackendHealthy={isBackendHealthy} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10 flex flex-col h-[calc(100vh-80px)]">
        
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
              Command Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1 transition-colors">Multi-Responder Live Broadcast Network</p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors ${
              isConnected 
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400" 
                : "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400"
            }`}>
              {isConnected ? (
                <><Radio className="w-4 h-4 animate-pulse" /> Live Stream Connected</>
              ) : (
                <><Activity className="w-4 h-4 animate-spin" /> Connecting to Gateway...</>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-black font-mono leading-none text-slate-900 dark:text-white transition-colors">{alerts.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Active Alerts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Incoming Feed Column */}
          <div className="lg:col-span-1 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col h-full overflow-hidden shadow-xl dark:shadow-2xl transition-colors">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2 transition-colors">
              <Activity className="w-4 h-4" /> Incoming Stream
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-center space-y-3 transition-colors">
                  <Radio className="w-8 h-8 opacity-50" />
                  <p className="font-semibold text-sm">Monitoring network.<br/>Waiting for incoming dispatches...</p>
                </div>
              ) : (
                alerts.map((alert, idx) => {
                  const locMatch = alert.text.match(/LOCATION:\s*(.+)$/m);
                  const locationText = locMatch ? locMatch[1] : "Unknown Location";
                  
                  return (
                    <div 
                      key={`${alert.dispatch_id}-${idx}`} 
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 animate-slide-up hover:border-rose-400 dark:hover:border-rose-500/50 transition-colors shadow-sm dark:shadow-lg relative overflow-hidden group"
                    >
                      {/* Flashing indicator for new alerts */}
                      {idx === 0 && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 animate-pulse"></div>}
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest transition-colors ${
                          alert.severity === "CRITICAL" ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50" : "bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50"
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 transition-colors">{alert.timestamp}</span>
                      </div>
                      
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors">{alert.emergency_type}</h3>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{locationText}</span>
                      </div>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-mono line-clamp-3 transition-colors">
                        {alert.text}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono transition-colors">
                        <span>ID: {alert.dispatch_id}</span>
                        <button onClick={() => setSelectedAlert(alert)} className="text-rose-500 dark:text-rose-400 font-bold hover:text-rose-600 dark:hover:text-rose-300 transition-colors uppercase tracking-widest flex items-center gap-1">
                          View Details <Activity className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Map/Radar Simulation Column */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col relative overflow-hidden shadow-xl dark:shadow-2xl h-[400px] lg:h-auto transition-colors">
            
            {/* Simulated Radar UI */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-30 pointer-events-none transition-opacity">
              <div className="w-[500px] h-[500px] border border-emerald-600/30 dark:border-emerald-900/30 rounded-full"></div>
              <div className="absolute w-[350px] h-[350px] border border-emerald-600/30 dark:border-emerald-900/30 rounded-full"></div>
              <div className="absolute w-[200px] h-[200px] border border-emerald-600/50 dark:border-emerald-900/50 rounded-full"></div>
              <div className="absolute w-full h-[1px] bg-emerald-600/30 dark:bg-emerald-900/30"></div>
              <div className="absolute h-full w-[1px] bg-emerald-600/30 dark:bg-emerald-900/30"></div>
              {/* Radar Sweeper */}
              <div className="absolute w-[250px] h-[250px] bg-gradient-to-tr from-emerald-600/0 via-emerald-600/10 to-emerald-500/30 dark:from-emerald-900/0 dark:via-emerald-900/10 dark:to-emerald-500/40 rounded-full animate-spin origin-bottom-left" style={{ animationDuration: '4s', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
            </div>

            <div className="relative z-10 flex justify-between items-start w-full">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors">
                <MapPin className="w-4 h-4" /> Live Global Map
              </h2>
              
              {alerts.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse backdrop-blur-md transition-colors">
                  <AlertTriangle className="w-4 h-4" />
                  Active Emergencies In Area
                </div>
              )}
            </div>

            {/* Map Pings */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {alerts.map((alert, idx) => {
                // Randomize position slightly for visual effect
                const top = `${20 + (idx * 17) % 60}%`;
                const left = `${20 + (idx * 23) % 60}%`;
                return (
                  <div key={alert.dispatch_id} className="absolute" style={{ top, left }}>
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-rose-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white dark:border-slate-900 transition-colors"></span>
                      
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 p-2 rounded-lg backdrop-blur-md shadow-xl w-48 text-left animate-fade-in transition-colors">
                        <p className="text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest transition-colors">{alert.severity}</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate transition-colors">{alert.emergency_type}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md"
              onClick={() => setSelectedAlert(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {selectedAlert.emergency_type}
                    </h2>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      ID: {selectedAlert.dispatch_id} • {selectedAlert.timestamp}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      Location
                    </h4>
                    <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                        <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
                          {selectedAlert.text.match(/LOCATION:\s*(.+)$/m)?.[1] || "Unknown Location"}
                        </p>
                      </div>
                      
                      {selectedAlert.text.match(/LOCATION:\s*(.+)$/m)?.[1] && selectedAlert.text.match(/LOCATION:\s*(.+)$/m)?.[1] !== "Unknown Location" && (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAlert.text.match(/LOCATION:\s*(.+)$/m)![1])}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors font-bold text-sm"
                        >
                          <Navigation className="w-4 h-4" />
                          Navigate
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      Severity Level
                    </h4>
                    <p className={`inline-block font-black px-3 py-1.5 rounded-lg uppercase tracking-widest text-sm ${
                      selectedAlert.severity === "CRITICAL" ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50" : "bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50"
                    }`}>
                      {selectedAlert.severity}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Brief / Incident Log
                    </h4>
                    <div className="bg-slate-900 rounded-2xl p-5 shadow-inner">
                      <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedAlert.text}
                      </pre>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
