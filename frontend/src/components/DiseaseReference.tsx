"use client";

import React, { useEffect, useState } from "react";
import { fetchCommonDiseases, Disease } from "@/lib/api";
import { BookOpen, ChevronRight, Activity, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const DiseaseReference: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadDiseases() {
      const data = await fetchCommonDiseases();
      setDiseases(data);
    }
    loadDiseases();
  }, []);

  if (diseases.length === 0) return null;

  const filteredDiseases = diseases.filter(d => 
    d.disease_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-8 max-w-4xl mx-auto w-full">
      {/* Trigger Button on Homepage */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsLibraryOpen(true)}
        className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-lg shadow-brand-500/5 flex items-center justify-between p-6 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-800 text-brand-600 dark:text-brand-300 shadow-sm border border-brand-200/50 dark:border-brand-700/50">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Medical Knowledge Base</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Open the library of {diseases.length} emergency protocols</p>
          </div>
        </div>
        <div className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </div>
      </motion.button>

      {/* Main Library Modal */}
      <AnimatePresence>
        {isLibraryOpen && !selectedDisease && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsLibraryOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-slate-50 dark:bg-slate-950 w-full max-w-5xl rounded-[2.5rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden flex flex-col h-[85vh]"
            >
              <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Emergency Reference Library</h2>
                </div>
                <button 
                  onClick={() => setIsLibraryOpen(false)}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 shrink-0 bg-white/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search for an emergency (e.g., Burn, Choking, Fever)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white shadow-sm"
                  />
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto flex-1 scroll-smooth">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredDiseases.map((disease, i) => (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.01 }}
                      key={disease.id}
                      onClick={() => setSelectedDisease(disease)}
                      className="flex flex-col text-left p-5 rounded-[1.25rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-slate-800 shadow-sm hover:shadow-md hover:border-brand-200 dark:hover:border-brand-700 transition-all group relative overflow-hidden"
                    >
                      <div className="relative z-10 flex justify-between items-start w-full mb-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors text-[1.05rem] leading-tight pr-2">
                          {disease.disease_name}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-transform group-hover:translate-x-1 shrink-0" />
                      </div>
                      <p className="relative z-10 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {disease.description}
                      </p>
                    </motion.button>
                  ))}
                  {filteredDiseases.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 font-medium">
                      No emergencies found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDisease && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setSelectedDisease(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 shadow-sm border border-brand-200/50 dark:border-brand-800/50">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{selectedDisease.disease_name}</h2>
                    {selectedDisease.requires_hospital && (
                      <span className="inline-flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-400 px-3 py-1.5 rounded-full mt-2 shadow-sm border border-rose-200 dark:border-rose-900">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                        </span>
                        Hospital Care Required
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDisease(null)}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 scroll-smooth">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-3">
                    <div className="w-6 h-[2px] bg-slate-200 dark:bg-slate-700 rounded-full"></div> Overview
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-[1.05rem]">
                    {selectedDisease.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-3">
                    <div className="w-6 h-[2px] bg-slate-200 dark:bg-slate-700 rounded-full"></div> Key Symptoms
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedDisease.symptoms.map((symptom, i) => (
                      <span key={i} className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 rounded-xl text-sm font-bold shadow-sm">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border-2 border-emerald-100 dark:border-emerald-900/40 rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <Activity className="w-32 h-32 text-emerald-900 dark:text-emerald-100" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-6 flex items-center gap-2 relative z-10">
                    <Activity className="w-5 h-5" /> Immediate Action Plan
                  </h4>
                  <ul className="space-y-5 relative z-10">
                    {selectedDisease.immediate_first_aid.map((step, i) => (
                      <li key={i} className="flex gap-4 sm:gap-5 text-slate-800 dark:text-slate-200 font-semibold text-base items-start">
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-200/80 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-sm font-black shadow-sm mt-0.5">
                          {i + 1}
                        </span>
                        <span className="pt-1 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
