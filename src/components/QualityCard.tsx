import React from "react";
import { Award, CheckCircle2, AlertTriangle, ShieldCheck, Eye, Sun, Cpu } from "lucide-react";
import { QualityAnalysis } from "../types";

interface QualityCardProps {
  quality: QualityAnalysis;
}

export const QualityCard: React.FC<QualityCardProps> = ({ quality }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 70) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  return (
    <div id="quality-card-container" className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      {/* Top Title & Overall Score Gauge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Stock Compliance Score
          </h3>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border font-bold text-base ${getScoreColor(quality.stockComplianceScore)}`}>
          <span>{quality.stockComplianceScore}</span>
          <span className="text-xs opacity-75">/ 100</span>
        </div>
      </div>

      {/* Stock Agency Verification Badges */}
      <div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Microstock Agency Compliance Status
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries({
            "Adobe Stock": quality.stockAgencyChecklist.adobeStock,
            "Shutterstock": quality.stockAgencyChecklist.shutterstock,
            "Freepik": quality.stockAgencyChecklist.freepik,
            "Getty / iStock": quality.stockAgencyChecklist.gettyImages
          }).map(([agency, passed]) => (
            <div
              key={agency}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                passed
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              <span className="truncate">{agency}</span>
              {passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 ml-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical Quality Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Sharpness (Laplacian) */}
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-400" /> Sharpness
            </span>
            <span className="font-mono text-slate-200 font-semibold">
              {quality.sharpnessScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all"
              style={{ width: `${quality.sharpnessScore}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Laplacian Var: {quality.laplacianVariance}
          </p>
        </div>

        {/* Noise Level */}
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Denoise Index
            </span>
            <span className="font-mono text-slate-200 font-semibold">
              {quality.noiseScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${quality.noiseScore}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Local Var Index: {quality.noiseIndex}
          </p>
        </div>

        {/* Exposure Balance */}
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-300" /> Exposure Balance
            </span>
            <span className="font-mono text-slate-200 font-semibold">
              {quality.exposureScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-300 h-full rounded-full transition-all"
              style={{ width: `${quality.exposureScore}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Clip: {quality.overexposedPixelsPercent}% High | {quality.underexposedPixelsPercent}% Shadow
          </p>
        </div>

        {/* Resolution */}
        <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Resolution
            </span>
            <span className="font-mono text-slate-200 font-semibold">
              {quality.resolutionMegapixels} MP
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (quality.resolutionMegapixels / 12) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            {quality.width} × {quality.height} px
          </p>
        </div>
      </div>

      {/* Actionable Recommendations */}
      {quality.recommendations.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 space-y-1">
          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Quality & Acceptance Feedback:
          </span>
          <ul className="space-y-0.5 pl-4 list-disc text-xs text-slate-400">
            {quality.recommendations.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
