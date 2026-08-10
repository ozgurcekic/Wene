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
    <header id="wene-app-header" className="bg-black/80 border-b border-white/10 text-white sticky top-0 z-40 backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-orange-500 text-black flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                WÊNE
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">
                Microstock AI Studio
              </span>
            </div>
            <p className="text-[11px] text-white/50 hidden sm:block">
              Zero-Dependency Standalone Engine & Photo Quality Manager
            </p>
          </div>
        </div>

        {/* View Switcher Tabs - Prominent & Clearly Visible */}
        <div className="flex items-center bg-black/60 p-1 rounded border border-white/10">
          <button
            id="tab-workspace-btn"
            onClick={() => setActiveTab("workspace")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "workspace"
                ? "bg-orange-500 text-black shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Photo Studio</span>
            {photosCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded font-mono ${
                activeTab === "workspace" ? "bg-black/20 text-black font-bold" : "bg-orange-500/20 text-orange-300"
              }`}>
                {photosCount}
              </span>
            )}
          </button>

          <button
            id="tab-python-code-btn"
            onClick={() => setActiveTab("python-code")}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "python-code"
                ? "bg-orange-500 text-black shadow-md"
                : "text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
            }`}
            title="Switch to Python 3.10+ Architecture Code View"
          >
            <Code2 className="w-4 h-4 text-orange-400 group-hover:text-black" />
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
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium rounded border border-white/10 transition"
                title="Simulate Python Pipeline Execution"
              >
                <Play className="w-3.5 h-3.5 text-orange-400" />
                <span>Simulate Engine</span>
              </button>

              <button
                id="header-export-btn"
                onClick={onOpenExporter}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs rounded shadow transition"
              >
                <Download className="w-4 h-4" />
                <span>Batch Export</span>
              </button>
            </>
          ) : (
            <button
              id="header-download-python-zip"
              onClick={onDownloadPythonZip}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs rounded shadow transition"
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
