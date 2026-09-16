"use client";

import React from "react";
import { ShieldAlert, Activity, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { isAuthenticated, clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  isBackendHealthy: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isBackendHealthy }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    setIsAuth(isAuthenticated());
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push("/dashboard/login");
  };

  return (
    <header className="w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40 border-b border-white dark:border-slate-800 shadow-sm transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand, Title */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl shadow-md shadow-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">Command Center</h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 shadow-sm uppercase tracking-wider transition-colors">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Theme Toggle */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors">
            <Activity className={`w-3.5 h-3.5 ${isBackendHealthy ? "text-emerald-500" : "text-amber-500"}`} />
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              Backend: {isBackendHealthy ? "Online" : "Connecting..."}
            </span>
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {mounted && isAuth && (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
