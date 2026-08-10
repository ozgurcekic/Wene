import React from "react";
import { UserCheck, AlertTriangle, ShieldCheck, UserX } from "lucide-react";
import { FaceAnalysis } from "../types";

interface FacePrivacyInspectorProps {
  faceAnalysis: FaceAnalysis;
  onToggleModelRelease?: () => void;
}

export const FacePrivacyInspector: React.FC<FacePrivacyInspectorProps> = ({
  faceAnalysis,
  onToggleModelRelease
}) => {
  const { hasHumanFace, facesCount, faces, modelReleaseRequired } = faceAnalysis;

  return (
    <div id="face-privacy-inspector" className="bg-black/40 border border-white/10 rounded-lg p-5 space-y-4 shadow-2xl">
      {/* Inspector Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          {hasHumanFace ? (
            <UserCheck className="w-4 h-4 text-orange-400" />
          ) : (
            <UserX className="w-4 h-4 text-emerald-400" />
          )}
          <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            Offline Face & Privacy Inspector
          </h3>
        </div>

        <span
          className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded border ${
            hasHumanFace
              ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          }`}
        >
          has_human_face = {hasHumanFace ? "True" : "False"}
        </span>
      </div>

      {hasHumanFace ? (
        <div className="space-y-3">
          {/* Detected Face Cards Grid */}
          <div className="flex items-center space-x-3 bg-black/60 p-3 rounded border border-white/10">
            {faces.map((face, idx) => (
              <div key={face.id || idx} className="relative group flex-shrink-0">
                <img
                  src={face.croppedDataUrl}
                  alt={`Detected face ${idx + 1}`}
                  className="w-14 h-14 rounded object-cover border border-orange-500/70 shadow-md"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/90 text-[8px] font-mono text-orange-300 text-center py-0.5">
                  {Math.round(face.confidence * 100)}% Conf
                </span>
              </div>
            ))}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/90">
                {facesCount} Human {facesCount === 1 ? "Face" : "Faces"} Isolated
              </p>
              <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">
                Identified via offline facial feature tensor scan. Photographed subjects require signed model release for commercial submission.
              </p>
            </div>
          </div>

          {/* Model Release Warning Banner */}
          <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-semibold text-orange-300 block">
                Model Release Required for Microstock Approval
              </span>
              <p className="text-orange-200/70 text-[11px]">
                Adobe Stock, Shutterstock, Freepik, and Getty Images will reject commercial licensing without a signed Model Release.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded flex items-center space-x-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-emerald-300 block">
              Clear Privacy Clearance (No Human Faces Detected)
            </span>
            <p className="text-emerald-200/70 text-[11px] mt-0.5">
              This photo does not contain visible human faces. No Model Release form is needed for commercial microstock submission.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
