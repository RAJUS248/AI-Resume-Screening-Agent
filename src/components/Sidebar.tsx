/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Users, 
  FileText, 
  BarChart3, 
  RotateCcw, 
  Cpu,
  Download,
  Terminal,
  Activity
} from "lucide-react";

interface SidebarProps {
  activeTab: "dashboard" | "upload" | "analytics";
  setActiveTab: (tab: "dashboard" | "upload" | "analytics") => void;
  onReset: () => void;
  hasResults: boolean;
  onDownloadCSV: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onReset, 
  hasResults,
  onDownloadCSV 
}: SidebarProps) {
  return (
    <aside id="ats-sidebar" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300">
      {/* Brand Logo & Name */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight text-sm">ScreenAgent</h1>
          <p className="text-xs text-indigo-400 font-mono font-medium">ATS Screening AI</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-mono text-slate-500 px-3 mb-2 tracking-wider uppercase">
          Workspace
        </div>

        <button
          id="nav-upload"
          onClick={() => setActiveTab("upload")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "upload"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "hover:bg-slate-800 hover:text-white"
          }`}
        >
          <FileText className="w-4.5 h-4.5" />
          <span>Upload Center</span>
        </button>

        <button
          id="nav-dashboard"
          onClick={() => setActiveTab("dashboard")}
          disabled={!hasResults}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            !hasResults 
              ? "opacity-50 cursor-not-allowed text-slate-600" 
              : activeTab === "dashboard"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          <span>Candidate Leaderboard</span>
        </button>

        <button
          id="nav-analytics"
          onClick={() => setActiveTab("analytics")}
          disabled={!hasResults}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            !hasResults 
              ? "opacity-50 cursor-not-allowed text-slate-600" 
              : activeTab === "analytics"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "hover:bg-slate-800 hover:text-white"
          }`}
        >
          <BarChart3 className="w-4.5 h-4.5" />
          <span>Talent Analytics</span>
        </button>

        {hasResults && (
          <>
            <div className="text-xs font-mono text-slate-500 px-3 pt-6 mb-2 tracking-wider uppercase">
              Actions
            </div>
            <button
              id="action-csv"
              onClick={onDownloadCSV}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Export CSV</span>
            </button>
          </>
        )}
      </nav>

      {/* Connection Info in Margin */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs font-mono space-y-2">
        <div className="flex items-center gap-2 text-slate-500">
          <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>SYSTEM CONNECTED</span>
        </div>
        <div className="text-slate-500 text-[10px]">
          Gemini Flash AI Engine Active
        </div>
      </div>

      {/* Danger Zone Bottom */}
      <div className="p-4 border-t border-slate-800">
        <button
          id="action-reset"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-rose-500/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Screening Project</span>
        </button>
      </div>
    </aside>
  );
}
