"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { checkBackendHealth, fetchCommonDiseases, Disease } from "@/lib/api";
import { BookOpen, Search, X, Activity, ChevronRight, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LibraryPage() {
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  useEffect(() => {
    async function init() {
      const health = await checkBackendHealth();
      setIsBackendHealthy(health.healthy);
      
      const data = await fetchCommonDiseases();
      setDiseases(data);
      setIsLoading(false);
    }
    init();
  }, []);

  const categories = Array.from(new Set(diseases.map(d => d.category)));
  
  const filteredDiseases = diseases.filter(d => {
    const matchesSearch = d.disease_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? d.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header isBackendHealthy={isBackendHealthy} />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header Section */}
          <section className="text-center space-y-4 animate-slide-up">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/50 dark:to-brand-800/30 rounded-2xl flex items-center justify-center border border-brand-200 dark:border-brand-800 shadow-sm mb-6">
              <BookOpen className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-500 pb-2">
              Emergency Reference Library
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A comprehensive, AI-curated medical database for instant access to critical first-aid protocols, symptoms, and emergency guidance.
            </p>
          </section>

          {/* Search & Filters */}
          <section className="max-w-3xl mx-auto space-y-6 animate-slide-up animate-delay-100">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for an emergency (e.g., Burn, Asthma, Fracture)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium transition-all text-lg"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                  selectedCategory === null 
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                    selectedCategory === cat 
                      ? "bg-brand-600 text-white" 
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Content Grid */}
          <section className="animate-slide-up animate-delay-200">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Activity className="w-8 h-8 text-brand-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium text-sm animate-pulse">Loading medical database...</p>
              </div>
            ) : filteredDiseases.length === 0 ? (
              <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No medical emergencies found for your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredDiseases.map((disease, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      key={disease.id}
                    >
                      <button
                        onClick={() => setSelectedDisease(disease)}
                        className="w-full text-left h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-black tracking-widest uppercase text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-full">
                              {disease.category}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-brand-50 dark:group-hover:bg-brand-900/50 transition-colors">
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                              {disease.disease_name}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                              {disease.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedDisease && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md"
              onClick={() => setSelectedDisease(null)}
            />
            
            <motion.div
              layoutId={`disease-${selectedDisease.id}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {selectedDisease.disease_name}
                    </h2>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {selectedDisease.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDisease(null)}
                  className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Overview
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {selectedDisease.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      Key Symptoms
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedDisease.symptoms.map((sym, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span className="text-sm font-semibold">{sym}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Immediate First Aid Action
                    </h4>
                    <ul className="space-y-2">
                      {selectedDisease.immediate_first_aid.map((aid, idx) => (
                        <li key={idx} className="flex gap-4 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-black shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100 leading-relaxed">{aid}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full bg-white/40 dark:bg-slate-950/40 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto relative z-10 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold">© RESQ AI — Agentic Emergency Response System</p>
          <p className="font-semibold text-slate-600 dark:text-slate-400">In a real life-threatening emergency, dial <strong className="text-brand-600 dark:text-brand-400">112</strong> immediately.</p>
        </div>
      </footer>
    </div>
  );
}
