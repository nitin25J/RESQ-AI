"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Activity, ShieldAlert, HeartPulse, Flame, Droplets, Zap, Brain, Bone, ThermometerSun } from "lucide-react";
import { fetchCommonDiseases, Disease } from "@/lib/api";

interface DemoPresetsProps {
  onSelectPreset: (text: string) => void;
  disabled?: boolean;
}

type Category = "Critical" | "Trauma" | "Environmental" | "Minor";

export const DemoPresets: React.FC<DemoPresetsProps> = ({ onSelectPreset, disabled }) => {
  const [activeCategory, setActiveCategory] = useState<Category>("Minor");
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchCommonDiseases();
      setDiseases(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const getIconForDisease = (name: string, category: string) => {
    const n = name.toLowerCase();
    if (n.includes("cardiac") || n.includes("heart")) return HeartPulse;
    if (n.includes("stroke") || n.includes("head")) return Brain;
    if (n.includes("burn")) return Flame;
    if (n.includes("bleed") || n.includes("cut") || n.includes("scrape")) return Droplets;
    if (n.includes("heat") || n.includes("sun")) return Sun;
    if (n.includes("cold") || n.includes("flu") || n.includes("fever") || n.includes("viral")) return Thermometer;
    if (n.includes("bite") || n.includes("sting")) return Bug;
    if (n.includes("allergi") || n.includes("anaphylaxis")) return Syringe;
    if (n.includes("poison") || n.includes("overdose")) return Skull;
    if (n.includes("chok")) return Baby;
    if (n.includes("fracture") || n.includes("sprain") || n.includes("crush") || n.includes("amputat")) return Bandage;
    if (n.includes("bike") || n.includes("accident")) return Bike;
    if (category === "Critical") return ShieldAlert;
    return Activity;
  };

  const categories: Category[] = ["Critical", "Trauma", "Environmental", "Minor"];

  const filteredDiseases = diseases.filter(d => d.category === activeCategory);

  // Force Common Illnesses to the top of Minor
  const sortedDiseases = [...filteredDiseases].sort((a, b) => {
    if (activeCategory === "Minor") {
      const isCommonA = ["cold", "flu", "fever", "viral"].some(k => a.disease_name.toLowerCase().includes(k));
      const isCommonB = ["cold", "flu", "fever", "viral"].some(k => b.disease_name.toLowerCase().includes(k));
      if (isCommonA && !isCommonB) return -1;
      if (!isCommonA && isCommonB) return 1;
    }
    return 0;
  });

  return (
    <div className="mb-6 pt-2">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400 animate-pulse" />
          <span>Scenario Database</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? cat === "Critical" ? "bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50"
                  : cat === "Trauma" ? "bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50"
                  : cat === "Environmental" ? "bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50"
                  : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
                : "bg-white/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 animate-fade-in" key={activeCategory}>
        {isLoading ? (
          <div className="text-sm text-slate-400 font-medium px-2 py-1 flex items-center gap-2">
            <Activity className="w-4 h-4 animate-spin" /> Loading scenarios...
          </div>
        ) : sortedDiseases.map((preset) => {
          const Icon = getIconForDisease(preset.disease_name, preset.category);
          return (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPreset(preset.description)}
              className="text-[12px] font-medium px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-brand-200 dark:hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300 shadow-sm dark:shadow-none hover:shadow-[0_4px_15px_rgb(239,68,68,0.1)] dark:hover:shadow-[0_4px_15px_rgb(239,68,68,0.2)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
              title={preset.description}
            >
              <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
              <span>{preset.disease_name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
