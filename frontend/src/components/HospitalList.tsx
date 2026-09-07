"use client";

import React from "react";
import { HospitalInfo } from "@/types/emergency";
import { Building2, Navigation, MapPinOff, CheckCircle2 } from "lucide-react";

interface HospitalListProps {
  hospitals: HospitalInfo[];
  statusMessage: string;
  hasLocation: boolean;
}

export const HospitalList: React.FC<HospitalListProps> = ({ hospitals, statusMessage, hasLocation }) => {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/40">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Nearby Hospitals & Trauma Centers</h3>
            <p className="text-xs text-slate-400">{statusMessage}</p>
          </div>
        </div>

        {hospitals.length > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Real Data
          </span>
        )}
      </div>

      {/* No Location Callout */}
      {!hasLocation && hospitals.length === 0 && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-center">
          <MapPinOff className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-200">Enable location to find nearby hospitals.</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Click &quot;Use My Location&quot; in the prompt input section above to automatically locate verified medical centers near you.
          </p>
        </div>
      )}

      {/* Hospital Cards */}
      {hospitals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hospitals.map((hospital, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-slate-100 leading-snug">{hospital.name}</h4>
                  {hospital.distance_km !== null && hospital.distance_km !== undefined && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 shrink-0">
                      {hospital.distance_km} km
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">{hospital.address}</p>
              </div>

              {hospital.maps_url && (
                <a
                  href={hospital.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate in Google Maps</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
