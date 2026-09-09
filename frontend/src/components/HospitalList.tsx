"use client";

import React from "react";
import { HospitalInfo } from "@/types/emergency";
import { Building2, Navigation, MapPinOff, CheckCircle2, Phone, Clock } from "lucide-react";

interface HospitalListProps {
  hospitals: HospitalInfo[];
  statusMessage: string;
  hasLocation: boolean;
}

export const HospitalList: React.FC<HospitalListProps> = ({ hospitals, statusMessage, hasLocation }) => {
  return (
    <div className="w-full ambient-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">Location Services</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Nearby Hospitals</h3>
          </div>
        </div>

        {hospitals.length > 0 && (
          <span className="text-[10px] px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-black flex items-center gap-1.5 uppercase tracking-widest shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            Verified Centers
          </span>
        )}
      </div>
      
      <p className="text-[12px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5 font-bold">{statusMessage}</p>

      {/* No Location Callout */}
      {!hasLocation && hospitals.length === 0 && (
        <div className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[220px] shadow-inner">
          <div className="p-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-5 shadow-sm">
            <MapPinOff className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-lg font-black text-slate-800 dark:text-slate-200">Location Access Required</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2 font-semibold">
            Please enable location services and click "Use Location" above to discover nearby emergency medical facilities.
          </p>
        </div>
      )}

      {/* Hospital Cards */}
      {hospitals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hospitals.map((hospital, idx) => {
            const isNearest = idx === 0;
            return (
              <div
                key={idx}
                className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl hover:bg-white dark:hover:bg-slate-900 ${
                  isNearest 
                    ? "border-blue-300 dark:border-blue-500/50 shadow-[0_8px_30px_rgb(59,130,246,0.15)] relative overflow-hidden ring-2 ring-blue-500/20" 
                    : "border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {isNearest && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-l from-blue-500 to-blue-600 text-[10px] font-black uppercase tracking-widest text-white px-4 py-1.5 rounded-bl-2xl shadow-sm">Nearest</div>
                  </div>
                )}
                
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2 pt-1">
                    <h4 className="text-[16px] font-black text-slate-900 dark:text-white leading-snug pr-10">{hospital.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-3 leading-relaxed">{hospital.address}</p>
                  
                  {hospital.operating_hours && (
                    <div className="flex items-center gap-1.5 mb-5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-emerald-600 dark:text-emerald-400">
                        {hospital.operating_hours}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-2">
                  {hospital.distance_km !== null && hospital.distance_km !== undefined ? (
                    <span className="text-[12px] font-mono font-bold px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-1.5 shadow-inner">
                      <Navigation className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      {hospital.distance_km} km
                    </span>
                  ) : (
                    <span className="text-[12px] font-mono font-semibold text-slate-400 dark:text-slate-500">Distance unknown</span>
                  )}
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {hospital.phone_number && (
                      <a
                        href={`tel:${hospital.phone_number.replace(/\s+/g, '')}`}
                        className="p-2.5 rounded-xl font-black bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                        title={`Call ${hospital.phone_number}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    
                    {hospital.maps_url && (
                      <a
                        href={hospital.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`py-2.5 px-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 active:scale-95 whitespace-nowrap ${
                          isNearest
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 border border-blue-500"
                            : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow"
                        }`}
                      >
                        <span>Navigate</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
