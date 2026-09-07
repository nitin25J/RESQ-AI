"use client";

import React from "react";
import { Sparkles, Bike, HeartPulse, Flame, UserX, Droplets, Wind, Zap, Skull } from "lucide-react";

interface DemoPresetsProps {
  onSelectPreset: (text: string) => void;
  disabled?: boolean;
}

export const DemoPresets: React.FC<DemoPresetsProps> = ({ onSelectPreset, disabled }) => {
  const presets = [
    {
      label: "Bike Accident",
      icon: Bike,
      text: "There has been a bike accident on the main road. The rider is conscious but has heavy bleeding from the leg.",
    },
    {
      label: "Chest Pain",
      icon: HeartPulse,
      text: "A 55-year-old person is experiencing sudden severe chest pain radiating to the left arm and sweating profusely.",
    },
    {
      label: "Severe Burn",
      icon: Flame,
      text: "A kitchen grease fire caused severe second-degree thermal burns on the person's forearm with active blistering.",
    },
    {
      label: "Unconscious Person",
      icon: UserX,
      text: "An individual collapsed suddenly in the hallway and is completely unresponsive to touch or voice.",
    },
    {
      label: "Heavy Bleeding",
      icon: Droplets,
      text: "Deep laceration on the forearm from broken glass with continuous heavy arterial bleeding.",
    },
    {
      label: "Breathing Difficulty",
      icon: Wind,
      text: "An adult experiencing severe acute shortness of breath, wheezing, and struggling to speak.",
    },
    {
      label: "Electric Shock",
      icon: Zap,
      text: "A high-voltage electrical shock accident at work. Victim was knocked down and is disoriented.",
    },
    {
      label: "Poisoning",
      icon: Skull,
      text: "Accidental ingestion of household chemical cleaning fluid causing severe nausea and throat burning.",
    },
  ];

  return (
    <div className="mb-3.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
      <div className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Exhibition Demo Scenarios (Select to auto-fill description):</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPreset(preset.text)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed truncate text-left"
              title={preset.label}
            >
              <Icon className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="truncate">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
