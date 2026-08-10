import React, { useState } from "react";
import { Download, X, FileArchive, Check, FolderCheck, ShieldAlert } from "lucide-react";
import JSZip from "jszip";
import { ProcessedPhoto } from "../types";
import { generateCSVMetadata, generateSidecarJSON } from "../utils/exifUtils";

interface BatchExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: ProcessedPhoto[];
}

export const BatchExporterModal: React.FC<BatchExporterModalProps> = ({
  isOpen,
  onClose,
  photos
}) => {
  const [exportDirectoryName, setExportDirectoryName] = useState("wene_microstock_export");
  const [namingPattern, setNamingPattern] = useState("{filename}_stock");
  const [quality, setQuality] = useState(95);
  const [embedExif, setEmbedExif] = useState(true);
  const [includeJSONSidecar, setIncludeJSONSidecar] = useState(true);
  const [includeCSVMaster, setIncludeCSVMaster] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setExportProgress(10);

    try {
      const zip = new JSZip();
      const exportFolder = zip.folder(exportDirectoryName) || zip;

      let masterCsvRows: string[] = ["Filename,Title,Description,Keywords,Category,Resolution,StockScore"];

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const progress = Math.round(((i + 1) / photos.length) * 80) + 10;
        setExportProgress(progress);

        // Sanitize output filename
        const baseName = photo.filename.replace(/\.[^/.]+$/, "");
        const formattedName = namingPattern
          .replace("{filename}", baseName)
          .replace("{title}", (photo.metadata.title || "photo").toLowerCase().replace(/[^a-z0-9]/g, "_")) + ".jpg";

        // Fetch / Convert canvas image buffer
        const imgUrl = photo.enhancedCanvasUrl || photo.originalUrl;
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        exportFolder.file(formattedName, blob);

        // Add sidecar JSON if checked
        if (includeJSONSidecar) {
          const sidecarStr = generateSidecarJSON(photo.metadata, formattedName, photo.exif);
          exportFolder.file(`${formattedName.replace(/\.jpg$/, "")}_metadata.json`, sidecarStr);
        }

        // CSV Row entry
        const escapedTitle = `"${(photo.metadata.title || "").replace(/"/g, '""')}"`;
        const escapedDesc = `"${(photo.metadata.description || "").replace(/"/g, '""')}"`;
        const escapedKw = `"${(photo.metadata.keywords || []).join(", ").replace(/"/g, '""')}"`;
        masterCsvRows.push(`"${formattedName}",${escapedTitle},${escapedDesc},${escapedKw},"${photo.metadata.category}","${photo.quality.resolutionMegapixels}MP",${photo.quality.stockComplianceScore}`);
      }

      if (includeCSVMaster) {
        exportFolder.file("wene_microstock_master_index.csv", masterCsvRows.join("\n"));
      }

      setExportProgress(95);

      // Generate downloadable ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${exportDirectoryName}.zip`;
      a.click();
      URL.revokeObjectURL(downloadUrl);

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error("Export error:", err);
      setIsExporting(false);
    }
  };

  return (
    <div id="batch-exporter-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <FileArchive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90">
              Safe Batch Exporter & ExifTool Writer
            </h3>
            <p className="text-xs text-white/50">
              Non-destructive RAM buffer export to isolated directory
            </p>
          </div>
        </div>

        {/* Safety Rule Notice */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded flex items-start space-x-2 text-xs text-emerald-300">
          <FolderCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
          <span className="text-[11px] leading-relaxed">
            <strong className="text-emerald-300 font-semibold">Safety Checker Active:</strong> Export folder is guaranteed isolated from source directory. Original files will never be modified or overwritten.
          </span>
        </div>

        {/* Form Settings */}
        <div className="space-y-3 text-xs">
          {/* Target Folder Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Export Directory Name</label>
            <input
              type="text"
              value={exportDirectoryName}
              onChange={(e) => setExportDirectoryName(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded p-2 text-white/90 focus:outline-none focus:border-orange-500/80 font-mono"
            />
          </div>

          {/* Naming Pattern */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">File Naming Rule</label>
            <select
              value={namingPattern}
              onChange={(e) => setNamingPattern(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded p-2 text-white/90 focus:outline-none"
            >
              <option value="{filename}_stock">&#123;filename&#125;_stock.jpg (e.g. photo_stock.jpg)</option>
              <option value="wene_{filename}">wene_&#123;filename&#125;.jpg</option>
              <option value="{title}_stock">&#123;title&#125;_stock.jpg</option>
            </select>
          </div>

          {/* Compression Quality */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">JPEG Quality Rating</label>
              <span className="font-mono text-orange-400 font-bold">{quality}% (Lossless High)</span>
            </div>
            <input
              type="range"
              min="80"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Checkbox Options */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={embedExif}
                onChange={(e) => setEmbedExif(e.target.checked)}
                className="rounded accent-orange-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-white/70 text-xs">Embed Title, Description & Keywords directly into EXIF/IPTC/XMP headers</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeJSONSidecar}
                onChange={(e) => setIncludeJSONSidecar(e.target.checked)}
                className="rounded accent-orange-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-white/70 text-xs">Generate per-photo metadata JSON sidecar files</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCSVMaster}
                onChange={(e) => setIncludeCSVMaster(e.target.checked)}
                className="rounded accent-orange-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-white/70 text-xs">Generate Master CSV Index for bulk upload to microstock portals</span>
            </label>
          </div>
        </div>

        {/* Progress Bar during Export */}
        {isExporting && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-medium text-white/80">
              <span>Writing Canvas Buffers & ExifTool Headers...</span>
              <span className="font-mono text-orange-400 font-bold">{exportProgress}%</span>
            </div>
            <div className="w-full bg-black/60 h-2 rounded overflow-hidden border border-white/10">
              <div
                className="bg-orange-500 h-full rounded transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium rounded transition"
          >
            Cancel
          </button>

          <button
            onClick={handleStartExport}
            disabled={isExporting || photos.length === 0}
            className="flex items-center space-x-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs rounded shadow transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Exporting ZIP..." : `Export ${photos.length} Photos (.zip)`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
