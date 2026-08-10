import React, { useState } from "react";
import { Sliders, RotateCcw, Zap, SplitSquareVertical, Eye } from "lucide-react";
import { ImageAdjustments } from "../types";

interface EnhancerStudioProps {
  adjustments: ImageAdjustments;
  onChangeAdjustments: (adj: ImageAdjustments) => void;
  originalUrl: string;
  enhancedUrl?: string;
}

export const EnhancerStudio: React.FC<EnhancerStudioProps> = ({
  adjustments,
  onChangeAdjustments,
  originalUrl,
  enhancedUrl
}) => {
  const [viewMode, setViewMode] = useState<"split" | "side-by-side" | "enhanced-only">("split");
  const [splitPos, setSplitPos] = useState<number>(50);

  const handleSlider = (key: keyof ImageAdjustments, value: number) => {
    onChangeAdjustments({
      ...adjustments,
      [key]: value
    });
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case "natural-pop":
        onChangeAdjustments({
          exposure: 4,
          contrast: 12,
          saturation: 10,
          temperature: 0,
          sharpness: 25,
          denoise: 10,
          highlights: -10,
          shadows: 10
        });
        break;
      case "vibrant-landscape":
        onChangeAdjustments({
          exposure: 0,
          contrast: 18,
          saturation: 25,
          temperature: 8,
          sharpness: 35,
          denoise: 15,
          highlights: -20,
          shadows: 15
        });
        break;
      case "clean-portrait":
        onChangeAdjustments({
          exposure: 6,
          contrast: 6,
          saturation: -2,
          temperature: -4,
          sharpness: 20,
          denoise: 25,
          highlights: -12,
          shadows: 12
        });
        break;
      case "high-contrast":
        onChangeAdjustments({
          exposure: 2,
          contrast: 28,
          saturation: 15,
          temperature: 2,
          sharpness: 40,
          denoise: 5,
          highlights: -25,
          shadows: 20
        });
        break;
      case "reset":
        onChangeAdjustments({
          exposure: 0,
          contrast: 0,
          saturation: 0,
          temperature: 0,
          sharpness: 0,
          denoise: 0,
          highlights: 0,
          shadows: 0
        });
        break;
    }
  };

  const currentEnhancedSrc = enhancedUrl || originalUrl;

  return (
    <div id="enhancer-studio-container" className="bg-black/40 border border-white/10 rounded-lg p-5 space-y-4 shadow-2xl">
      {/* Studio Header & View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-orange-400" />
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
              Non-Destructive RAM Memory Enhancer
            </h3>
            <p className="text-xs text-white/80">
              Live GPU Canvas Matrix • Read-only safety active
            </p>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center space-x-1 bg-black/60 p-1 rounded border border-white/10">
          <button
            onClick={() => setViewMode("split")}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded transition ${
              viewMode === "split"
                ? "bg-white/10 text-white shadow border border-white/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            onClick={() => setViewMode("side-by-side")}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded transition ${
              viewMode === "side-by-side"
                ? "bg-white/10 text-white shadow border border-white/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Comparison Viewer */}
      <div className="relative bg-[#151515] rounded-lg overflow-hidden border border-white/10 aspect-[16/10] max-h-[420px] flex items-center justify-center group shadow-inner">
        {viewMode === "side-by-side" ? (
          <div className="grid grid-cols-2 w-full h-full divide-x divide-white/10">
            <div className="relative h-full overflow-hidden flex items-center justify-center bg-[#101010]">
              <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[10px] px-2 py-1 border border-white/10 text-white/80">
                ORIGINAL
              </span>
            </div>
            <div className="relative h-full overflow-hidden flex items-center justify-center bg-[#151515]">
              <img src={currentEnhancedSrc} alt="Enhanced" className="max-h-full max-w-full object-contain" />
              <span className="absolute top-3 left-3 bg-orange-500/20 backdrop-blur-md text-[10px] px-2 py-1 border border-orange-500/40 text-orange-300 font-semibold">
                ENHANCED
              </span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
            {/* Base Enhanced Image */}
            <img
              src={currentEnhancedSrc}
              alt="Enhanced"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Clipped Original Image - Perfectly Aligned */}
            <img
              src={originalUrl}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` }}
            />

            {/* Labels */}
            <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] px-2 py-1 border border-white/10 text-white/90 z-10 pointer-events-none">
              ORIGINAL
            </span>

            <span className="absolute top-3 right-3 bg-orange-500/20 backdrop-blur-md text-[10px] px-2 py-1 border border-orange-500/30 text-orange-300 font-semibold z-10 pointer-events-none">
              ENHANCED (RAM)
            </span>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-orange-400 z-20 pointer-events-none shadow-[0_0_8px_rgba(249,115,22,0.8)]"
              style={{ left: `${splitPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-orange-500 text-black flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold">
                ↔
              </div>
            </div>

            {/* Split Slider Drag Range Control */}
            <input
              type="range"
              min="0"
              max="100"
              value={splitPos}
              onChange={(e) => setSplitPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        )}
      </div>

      {/* Instant Adjustment Presets */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
        <span className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-1 flex-shrink-0 font-semibold">
          <Zap className="w-3.5 h-3.5 text-orange-400" /> Presets:
        </span>

        <button
          onClick={() => applyPreset("natural-pop")}
          className="px-3 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded whitespace-nowrap transition"
        >
          Natural Stock Pop
        </button>

        <button
          onClick={() => applyPreset("vibrant-landscape")}
          className="px-3 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded whitespace-nowrap transition"
        >
          HDR Landscape
        </button>

        <button
          onClick={() => applyPreset("clean-portrait")}
          className="px-3 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded whitespace-nowrap transition"
        >
          Clean Portrait
        </button>

        <button
          onClick={() => applyPreset("high-contrast")}
          className="px-3 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded whitespace-nowrap transition"
        >
          High Contrast
        </button>

        <button
          onClick={() => applyPreset("reset")}
          className="px-3 py-1 text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded whitespace-nowrap transition flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Adjustment Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* Exposure */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-white/70">
            <span className="uppercase text-[9px] tracking-wider text-white/40">Exposure</span>
            <span className="font-mono text-orange-400 font-bold">{adjustments.exposure}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.exposure}
            onChange={(e) => handleSlider("exposure", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-white/70">
            <span className="uppercase text-[9px] tracking-wider text-white/40">Contrast</span>
            <span className="font-mono text-orange-400 font-bold">{adjustments.contrast}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.contrast}
            onChange={(e) => handleSlider("contrast", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-white/70">
            <span className="uppercase text-[9px] tracking-wider text-white/40">Saturation</span>
            <span className="font-mono text-orange-400 font-bold">{adjustments.saturation}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.saturation}
            onChange={(e) => handleSlider("saturation", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Temperature */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-white/70">
            <span className="uppercase text-[9px] tracking-wider text-white/40">Temperature</span>
            <span className="font-mono text-orange-400 font-bold">{adjustments.temperature}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.temperature}
            onChange={(e) => handleSlider("temperature", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Sharpness */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-white/70">
            <span className="uppercase text-[9px] tracking-wider text-white/40">Sharpness</span>
            <span className="font-mono text-orange-400 font-bold">{adjustments.sharpness}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.sharpness}
            onChange={(e) => handleSlider("sharpness", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Denoise */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-white/70">
            <span className="uppercase text-[9px] tracking-wider text-white/40">Denoise</span>
            <span className="font-mono text-orange-400 font-bold">{adjustments.denoise}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.denoise}
            onChange={(e) => handleSlider("denoise", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Highlights */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-white/70">
            <span className="uppercase text-[9px] tracking-wider text-white/40">Highlights</span>
            <span className="font-mono text-orange-400 font-bold">{adjustments.highlights}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.highlights}
            onChange={(e) => handleSlider("highlights", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Shadows */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-white/70">
            <span className="uppercase text-[9px] tracking-wider text-white/40">Shadows</span>
            <span className="font-mono text-orange-400 font-bold">{adjustments.shadows}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.shadows}
            onChange={(e) => handleSlider("shadows", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
