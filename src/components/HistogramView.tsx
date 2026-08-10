import React, { useState } from "react";
import { BarChart3 } from "lucide-react";
import { HistogramData } from "../types";

interface HistogramViewProps {
  histogram: HistogramData;
}

export const HistogramView: React.FC<HistogramViewProps> = ({ histogram }) => {
  const [activeChannel, setActiveChannel] = useState<"rgb" | "luma" | "r" | "g" | "b">("rgb");

  // Sample or downsample to 64 bins for smooth SVG graph rendering
  const getBins = (channelData: number[]) => {
    if (!channelData || channelData.length === 0) return new Array(64).fill(0);
    const bins: number[] = [];
    const step = Math.floor(channelData.length / 64);
    for (let i = 0; i < 64; i++) {
      const slice = channelData.slice(i * step, (i + 1) * step);
      const avg = slice.reduce((a, b) => a + b, 0) / Math.max(1, slice.length);
      bins.push(avg);
    }
    return bins;
  };

  const rBins = getBins(histogram.r);
  const gBins = getBins(histogram.g);
  const bBins = getBins(histogram.b);
  const lumaBins = getBins(histogram.luma);

  return (
    <div id="histogram-view-container" className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-orange-400" />
          <h4 className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">
            RGB & Luminance Histogram
          </h4>
        </div>

        {/* Channel Selector Pills */}
        <div className="flex items-center space-x-1 bg-black/60 p-1 rounded border border-white/10">
          {(["rgb", "luma", "r", "g", "b"] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase transition ${
                activeChannel === ch
                  ? "bg-white/10 text-orange-400 border border-white/20"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Histogram */}
      <div className="h-28 bg-[#121212] rounded p-2 border border-white/10 relative overflow-hidden flex items-end">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 256 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="64" y1="0" x2="64" y2="100" stroke="#ffffff15" strokeDasharray="2,2" strokeWidth="1" />
          <line x1="128" y1="0" x2="128" y2="100" stroke="#ffffff15" strokeDasharray="2,2" strokeWidth="1" />
          <line x1="192" y1="0" x2="192" y2="100" stroke="#ffffff15" strokeDasharray="2,2" strokeWidth="1" />

          {/* Render Active Channels */}
          {(activeChannel === "rgb" || activeChannel === "r") && (
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              points={rBins.map((val, idx) => `${(idx / 63) * 256},${100 - val}`).join(" ")}
            />
          )}

          {(activeChannel === "rgb" || activeChannel === "g") && (
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              points={gBins.map((val, idx) => `${(idx / 63) * 256},${100 - val}`).join(" ")}
            />
          )}

          {(activeChannel === "rgb" || activeChannel === "b") && (
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              points={bBins.map((val, idx) => `${(idx / 63) * 256},${100 - val}`).join(" ")}
            />
          )}

          {(activeChannel === "luma") && (
            <polyline
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeOpacity="0.9"
              points={lumaBins.map((val, idx) => `${(idx / 63) * 256},${100 - val}`).join(" ")}
            />
          )}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-1 left-2 text-[9px] font-mono text-white/40 flex space-x-3 bg-black/80 px-1.5 py-0.5 rounded border border-white/5">
          <span>0 (Shadows)</span>
          <span>128 (Midtones)</span>
          <span>255 (Highlights)</span>
        </div>
      </div>
    </div>
  );
};
