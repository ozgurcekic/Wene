import React, { useState } from "react";
import { Code2, Copy, Check, Download, Play, FileCode, Folder, Terminal } from "lucide-react";
import JSZip from "jszip";
import { PYTHON_SOURCE_FILES } from "../data/pythonSourceCode";
import { PythonFileSpec } from "../types";

interface PythonCodeExplorerProps {
  onRunSimulation: () => void;
  simulationLogs?: string[];
  isSimulating?: boolean;
}

export const PythonCodeExplorer: React.FC<PythonCodeExplorerProps> = ({
  onRunSimulation,
  simulationLogs = [],
  isSimulating = false
}) => {
  const [selectedFile, setSelectedFile] = useState<PythonFileSpec>(PYTHON_SOURCE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPythonZip = async () => {
    const zip = new JSZip();
    const rootFolder = zip.folder("wene");

    PYTHON_SOURCE_FILES.forEach((f) => {
      if (rootFolder) {
        rootFolder.file(f.path, f.content);
      }
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wene_python_master_architecture.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="python-code-explorer" className="max-w-7xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold border border-orange-500/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white/90 flex items-center gap-2">
              Wêne Python 3.10+ Master Architecture Specification
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              100% Zero-Dependency Standalone Python Core Engine with PyExifTool, OpenCV & Local LLM Integration
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold rounded border border-white/10 transition"
          >
            <Play className={`w-3.5 h-3.5 text-orange-400 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isSimulating ? "Running Python..." : "Test Pipeline Run"}</span>
          </button>

          <button
            onClick={handleDownloadPythonZip}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs rounded shadow transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Python Source (.zip)</span>
          </button>
        </div>
      </div>

      {/* Main Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left File Tree Sidebar */}
        <div className="bg-black/40 border border-white/10 rounded-lg p-3 space-y-3 lg:col-span-1 shadow-xl">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block px-2">
            Project Architecture File Tree
          </span>

          <div className="space-y-1 font-mono text-xs">
            {PYTHON_SOURCE_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded text-left transition ${
                    isSelected
                      ? "bg-white/10 text-orange-400 font-semibold border border-white/20"
                      : "text-white/50 hover:text-white/90 hover:bg-white/5"
                  }`}
                >
                  <FileCode className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-orange-400" : "text-white/40"}`} />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Editor & Viewer */}
        <div className="bg-black/40 border border-white/10 rounded-lg lg:col-span-3 flex flex-col min-h-[500px] shadow-xl overflow-hidden">
          {/* Code Viewer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-orange-400">
                wene/{selectedFile.path}
              </span>
              <span className="text-[9px] text-white/50 px-2 py-0.5 bg-white/5 rounded border border-white/10 uppercase font-mono">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-xs rounded border border-white/10 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Code!" : "Copy Code"}</span>
            </button>
          </div>

          {/* Code Body */}
          <pre className="p-4 font-mono text-xs text-white/80 bg-[#121212] overflow-x-auto flex-1 leading-relaxed select-text">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>

      {/* Python Pipeline CLI Logs Simulation Box */}
      {simulationLogs.length > 0 && (
        <div className="bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-xs space-y-2 shadow-xl">
          <div className="flex items-center space-x-2 text-orange-400 border-b border-white/10 pb-2">
            <Terminal className="w-4 h-4" />
            <span className="font-semibold text-white/80">Python Pipeline Terminal Log Console</span>
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto pt-1">
            {simulationLogs.map((log, idx) => (
              <p
                key={idx}
                className={
                  log.includes("SUCCESS")
                    ? "text-emerald-400 font-semibold"
                    : log.includes("Error")
                    ? "text-rose-400 font-semibold"
                    : "text-white/70"
                }
              >
                {log}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
