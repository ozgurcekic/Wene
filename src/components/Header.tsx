import React from "react";
import { Camera, Code2, Download, Play, Sparkles, FolderDown, ShieldCheck } from "lucide-react";

interface HeaderProps {
  activeTab: "workspace" | "python-code";
  setActiveTab: (tab: "workspace" | "python-code") => void;
  onOpenExporter: () => void;
  onDownloadPythonZip: () => void;
  onRunPythonSim: () => void;
  photosCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExporter,
  onDownloadPythonZip,
  onRunPythonSim,
  photosCount
}) => {
  return (
    <header id="wene-app-header" className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                WÊNE
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                Microstock AI Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Zero-Dependency Standalone Engine & Photo Quality Manager
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            id="tab-workspace-btn"
            onClick={() => setActiveTab("workspace")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "workspace"
                ? "bg-slate-800 text-amber-400 shadow-sm border border-slate-700"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Photo Studio</span>
            {photosCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 rounded-full">
                {photosCount}
              </span>
            )}
          </button>

          <button
            id="tab-python-code-btn"
            onClick={() => setActiveTab("python-code")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "python-code"
                ? "bg-slate-800 text-amber-400 shadow-sm border border-slate-700"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Python Engine Code</span>
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          {activeTab === "workspace" ? (
            <>
              <button
                id="header-run-sim-btn"
                onClick={onRunPythonSim}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
                title="Simulate Python Pipeline Execution"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Engine</span>
              </button>

              <button
                id="header-export-btn"
                onClick={onOpenExporter}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-semibold text-xs rounded-lg shadow-md transition"
              >
                <Download className="w-4 h-4" />
                <span>Batch Export</span>
              </button>
            </>
          ) : (
            <button
              id="header-download-python-zip"
              onClick={onDownloadPythonZip}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-lg shadow-md transition"
            >
              <FolderDown className="w-4 h-4" />
              <span>Download Python Code (.zip)</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
