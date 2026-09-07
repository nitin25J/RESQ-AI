"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, MapPin, Send, Loader2, Compass } from "lucide-react";

interface EmergencyInputProps {
  description: string;
  setDescription: (text: string) => void;
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number | null, lng: number | null) => void;
  onSubmit: () => void;
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
  const [speechSupported, setSpeechSupported] = useState(true);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setDescription(description ? `${description} ${transcript}` : transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleFetchLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords.latitude, position.coords.longitude);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocError("Location permission denied. Nearby hospital search requires location access.");
        } else {
          setLocError("Unable to retrieve location coordinates.");
        }
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur">
      <label htmlFor="emergency-description" className="block text-sm font-semibold text-slate-200 mb-2">
        Describe the Emergency Situation:
      </label>
      
      <div className="relative">
        <textarea
          id="emergency-description"
          rows={4}
          disabled={isLoading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g., Bike accident on the road. The victim is conscious but bleeding heavily from the leg..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition resize-none disabled:opacity-60"
        />

        {/* Floating Voice Indicator inside textarea when listening */}
        {isListening && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs bg-red-950/90 text-red-400 border border-red-800 px-2.5 py-1 rounded-full animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Listening...
          </div>
        )}
      </div>

      {/* Control Buttons Bar */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={isLoading || !speechSupported}
            className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition flex items-center gap-2 ${
              isListening
                ? "bg-red-600 text-white border-red-500 animate-pulse"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:border-slate-600"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title={speechSupported ? "Click to speak emergency details" : "Web Speech API not supported"}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-red-400" />}
            <span>{isListening ? "Stop Listening" : "Voice Input"}</span>
          </button>

          {/* Location Button */}
          <button
            type="button"
            onClick={handleFetchLocation}
            disabled={isLoading || locating}
            className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition flex items-center gap-2 ${
              latitude !== null
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:border-slate-600"
            } disabled:opacity-60`}
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <MapPin className={`w-3.5 h-3.5 ${latitude !== null ? "text-emerald-400" : "text-slate-400"}`} />
            )}
            <span>
              {latitude !== null ? `GPS: ${latitude.toFixed(3)}, ${longitude?.toFixed(3)}` : "Use My Location"}
            </span>
          </button>
        </div>

        {/* Submit Primary Button */}
        <button
          type="button"
          disabled={isLoading || !description.trim()}
          onClick={onSubmit}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-sm transition shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Emergency...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Analyze Emergency</span>
            </>
          )}
        </button>
      </div>

      {/* Warnings & Notes */}
      {!speechSupported && (
        <p className="text-[11px] text-slate-500 mt-2">
          Voice input is unavailable in this browser. Please type emergency details.
        </p>
      )}
      {locError && <p className="text-xs text-amber-400/90 mt-2 flex items-center gap-1"><Compass className="w-3.5 h-3.5" />{locError}</p>}
    </div>
  );
};
