import React from "react";
import { Camera, FileText, Download } from "lucide-react";
import { TechnicalExif, StockMetadata } from "../types";
import { generateCSVMetadata, generateSidecarJSON } from "../utils/exifUtils";

interface MetadataExifViewerProps {
  exif: TechnicalExif;
  metadata: StockMetadata;
  filename: string;
}

export const MetadataExifViewer: React.FC<MetadataExifViewerProps> = ({
  exif,
  metadata,
  filename
}) => {
  const downloadSidecarJSON = () => {
    const jsonStr = generateSidecarJSON(metadata, filename, exif);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename.replace(/\.[^/.]+$/, "")}_metadata.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSidecarCSV = () => {
    const csvStr = generateCSVMetadata(metadata, filename, exif);
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename.replace(/\.[^/.]+$/, "")}_metadata.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="metadata-exif-viewer" className="bg-black/40 border border-white/10 rounded-lg p-5 space-y-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-orange-400" />
          <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
            EXIF / IPTC / XMP Technical Metadata
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={downloadSidecarJSON}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-xs rounded border border-white/10 transition"
          >
            <FileText className="w-3.5 h-3.5 text-orange-400" />
            <span>JSON Sidecar</span>
          </button>

          <button
            onClick={downloadSidecarCSV}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-xs rounded border border-white/10 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Metadata</span>
          </button>
        </div>
      </div>

      {/* EXIF Data Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-black/60 p-2.5 rounded border border-white/10">
          <span className="text-white/40 block text-[9px] uppercase tracking-wider">Camera</span>
          <span className="text-white/90 font-semibold truncate block mt-0.5">
            {exif.cameraMake || "Sony"} {exif.cameraModel || "A7R IV"}
          </span>
        </div>

        <div className="bg-black/60 p-2.5 rounded border border-white/10">
          <span className="text-white/40 block text-[9px] uppercase tracking-wider">Lens / Focal</span>
          <span className="text-white/90 font-semibold truncate block mt-0.5">
            {exif.focalLength || "24mm"} ({exif.lens || "24-70mm"})
          </span>
        </div>

        <div className="bg-black/60 p-2.5 rounded border border-white/10">
          <span className="text-white/40 block text-[9px] uppercase tracking-wider">Aperture & Shutter</span>
          <span className="text-white/90 font-semibold truncate block mt-0.5">
            {exif.aperture || "f/8.0"} @ {exif.shutterSpeed || "1/125s"}
          </span>
        </div>

        <div className="bg-black/60 p-2.5 rounded border border-white/10">
          <span className="text-white/40 block text-[9px] uppercase tracking-wider">ISO & Color Space</span>
          <span className="text-white/90 font-semibold truncate block mt-0.5">
            ISO {exif.iso || 100} • {exif.colorSpace || "sRGB"}
          </span>
        </div>
      </div>
    </div>
  );
};
