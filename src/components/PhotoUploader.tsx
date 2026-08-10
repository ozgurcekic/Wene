import React, { useRef } from "react";
import { Upload, Sparkles, Check, Images, Trash2 } from "lucide-react";
import { ProcessedPhoto } from "../types";

interface PhotoUploaderProps {
  activePhoto: ProcessedPhoto | null;
  onSelectPhoto: (photo: ProcessedPhoto) => void;
  onCustomPhotosUpload: (files: File[]) => void;
  allPhotos: ProcessedPhoto[];
  onRemovePhoto?: (photoId: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  activePhoto,
  onSelectPhoto,
  onCustomPhotosUpload,
  allPhotos,
  onRemovePhoto
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onCustomPhotosUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onCustomPhotosUpload(Array.from(e.target.files));
    }
  };

  return (
    <div id="photo-uploader-container" className="bg-black/40 border border-white/10 rounded-lg p-4 shadow-2xl">
      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        
        {/* Upload Drop Zone (Multiple Files Supported) */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="lg:w-1/3 border-2 border-dashed border-white/20 hover:border-orange-500/80 bg-black/60 hover:bg-black/80 transition-all rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer text-center group min-h-[110px]"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/tiff"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-9 h-9 rounded bg-white/5 group-hover:bg-orange-500/20 text-white/50 group-hover:text-orange-400 flex items-center justify-center mb-2 transition border border-white/10">
            <Upload className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-white/90">
            Select <span className="text-orange-400 underline">multiple photos</span> or drag & drop
          </p>
          <p className="text-[10px] text-white/40 mt-0.5">
            Bulk upload JPG, PNG, TIFF files (Batch Processing Ready)
          </p>
        </div>

        {/* Loaded Photos Batch Carousel / Grid */}
        <div className="lg:w-2/3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white/80">
              <Images className="w-4 h-4 text-orange-400" />
              <span className="uppercase text-[10px] tracking-wider text-white/50">
                Batch Photo Queue ({allPhotos.length} Items Loaded)
              </span>
            </div>
            <span className="text-[10px] font-mono text-orange-400/90 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              Batch Mode Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
            {allPhotos.map((photo) => {
              const isSelected = activePhoto?.id === photo.id;
              return (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  className={`relative flex items-center space-x-2 p-1.5 rounded border text-left transition overflow-hidden group cursor-pointer ${
                    isSelected
                      ? "bg-white/10 border-orange-500/80 shadow-md ring-1 ring-orange-500/40"
                      : "bg-black/60 border-white/10 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <img
                    src={photo.enhancedCanvasUrl || photo.originalUrl}
                    alt={photo.filename}
                    className="w-10 h-10 rounded object-cover flex-shrink-0 border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-white/90 truncate group-hover:text-orange-300">
                      {photo.filename}
                    </p>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
                        {photo.quality.stockComplianceScore}%
                      </span>
                      {photo.faceAnalysis.hasHumanFace && (
                        <span className="text-[9px] font-mono text-orange-400 bg-orange-500/10 px-1 py-0.2 rounded">
                          Face
                        </span>
                      )}
                    </div>
                  </div>

                  {onRemovePhoto && allPhotos.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePhoto(photo.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-rose-400 transition"
                      title="Remove from batch"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}

                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded bg-orange-500 text-black flex items-center justify-center font-bold text-[9px]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

