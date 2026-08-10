import React, { useState, useEffect } from "react";
import { Sparkles, Download, Layers } from "lucide-react";
import { Header } from "./components/Header";
import { PhotoUploader } from "./components/PhotoUploader";
import { QualityCard } from "./components/QualityCard";
import { HistogramView } from "./components/HistogramView";
import { EnhancerStudio } from "./components/EnhancerStudio";
import { FacePrivacyInspector } from "./components/FacePrivacyInspector";
import { AITagSEOStudio } from "./components/AITagSEOStudio";
import { MetadataExifViewer } from "./components/MetadataExifViewer";
import { BatchExporterModal } from "./components/BatchExporterModal";
import { PythonCodeExplorer } from "./components/PythonCodeExplorer";
import { SAMPLE_PHOTOS } from "./data/samplePhotos";
import { ProcessedPhoto, ImageAdjustments } from "./types";
import { analyzeCanvasImage } from "./utils/imageAnalyzer";
import { renderEnhancedCanvas } from "./utils/canvasEnhancer";
import { detectFacesOnCanvas } from "./utils/faceDetector";
import JSZip from "jszip";
import { PYTHON_SOURCE_FILES } from "./data/pythonSourceCode";

export default function App() {
  const [allPhotos, setAllPhotos] = useState<ProcessedPhoto[]>(SAMPLE_PHOTOS);
  const [activePhoto, setActivePhoto] = useState<ProcessedPhoto>(SAMPLE_PHOTOS[0]);
  const [activeTab, setActiveTab] = useState<"workspace" | "python-code">("workspace");
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSimulatingPython, setIsSimulatingPython] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  // Update canvas adjustments in real-time
  const handleUpdateAdjustments = (newAdjustments: ImageAdjustments) => {
    if (!activePhoto) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = activePhoto.originalUrl;
    img.onload = () => {
      const enhancedDataUrl = renderEnhancedCanvas(img, newAdjustments);
      const updatedPhoto: ProcessedPhoto = {
        ...activePhoto,
        adjustments: newAdjustments,
        enhancedCanvasUrl: enhancedDataUrl
      };

      setActivePhoto(updatedPhoto);
      setAllPhotos((prev) =>
        prev.map((p) => (p.id === activePhoto.id ? updatedPhoto : p))
      );
    };
  };

  // Re-run quality & face analysis on photo selection
  const handleSelectPhoto = (photo: ProcessedPhoto) => {
    setActivePhoto(photo);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = photo.originalUrl;
    img.onload = () => {
      const analysis = analyzeCanvasImage(img);
      const faces = detectFacesOnCanvas(img);
      const enhancedDataUrl = renderEnhancedCanvas(img, photo.adjustments);

      const updated: ProcessedPhoto = {
        ...photo,
        quality: analysis.quality,
        histogram: analysis.histogram,
        dominantColors: analysis.dominantColors,
        faceAnalysis: faces,
        enhancedCanvasUrl: enhancedDataUrl
      };

      setActivePhoto(updated);
      setAllPhotos((prev) => prev.map((p) => (p.id === photo.id ? updated : p)));
    };
  };

  // Custom user photo upload handler (Batch / Multiple files)
  const handleCustomPhotosUpload = (files: File[]) => {
    if (!files || files.length === 0) return;

    const newPhotos: ProcessedPhoto[] = [];
    let processedCount = 0;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const analysis = analyzeCanvasImage(img);
          const faces = detectFacesOnCanvas(img);
          const defaultAdj: ImageAdjustments = {
            exposure: 0,
            contrast: 0,
            saturation: 0,
            temperature: 0,
            sharpness: 20,
            denoise: 10,
            highlights: 0,
            shadows: 0
          };

          const enhancedUrl = renderEnhancedCanvas(img, defaultAdj);

          const newPhoto: ProcessedPhoto = {
            id: `custom-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
            filename: file.name,
            originalUrl: dataUrl,
            originalWidth: img.width,
            originalHeight: img.height,
            fileSizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            adjustments: defaultAdj,
            quality: analysis.quality,
            histogram: analysis.histogram,
            dominantColors: analysis.dominantColors,
            faceAnalysis: faces,
            enhancedCanvasUrl: enhancedUrl,
            metadata: {
              title: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
              description: "High resolution commercial stock photo.",
              keywords: [
                "stock photo", "commercial", "high resolution", "professional",
                "microstock", "photography", "adobe stock", "shutterstock", "freepik",
                "vibrant", "detailed", "sharp focus"
              ],
              category: "General",
              objects: ["subject"],
              dominantColors: analysis.dominantColors.map((c) => c.name),
              complianceTips: ["Check quality metrics for stock agency approval"]
            },
            exif: {
              cameraMake: "Digital Camera",
              cameraModel: "High-Res Sensor",
              focalLength: "35mm",
              aperture: "f/2.8",
              shutterSpeed: "1/125s",
              iso: 100,
              colorSpace: "sRGB",
              copyright: "Wêne Commercial License"
            }
          };

          newPhotos.push(newPhoto);
          processedCount++;

          if (processedCount === files.length) {
            setAllPhotos((prev) => [...newPhotos, ...prev]);
            setActivePhoto(newPhotos[0]);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    setAllPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== photoId);
      if (activePhoto?.id === photoId && filtered.length > 0) {
        setActivePhoto(filtered[0]);
      }
      return filtered;
    });
  };

  // Batch Auto-Tag All Photos with AI (Parallel Promise.all Execution)
  const handleBatchAITagging = async () => {
    if (allPhotos.length === 0) return;
    setIsGeneratingAI(true);

    try {
      const promises = allPhotos.map(async (photo) => {
        try {
          const res = await fetch("/api/generate-metadata", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageBase64: photo.enhancedCanvasUrl || photo.originalUrl,
              mimeType: "image/jpeg",
              customContext: `Filename: ${photo.filename}`
            })
          });

          if (res.ok) {
            const data = await res.json();
            return {
              ...photo,
              metadata: {
                title: data.title || photo.metadata.title,
                description: data.description || photo.metadata.description,
                keywords: data.keywords || photo.metadata.keywords,
                category: data.category || photo.metadata.category,
                objects: data.objects || photo.metadata.objects,
                dominantColors: data.dominantColors || photo.metadata.dominantColors,
                complianceTips: data.complianceTips || photo.metadata.complianceTips
              }
            };
          }
        } catch (e) {
          console.error(`Failed AI tag for photo ${photo.filename}`, e);
        }
        return photo;
      });

      const updatedList = await Promise.all(promises);

      setAllPhotos(updatedList);
      if (activePhoto) {
        const updatedActive = updatedList.find((p) => p.id === activePhoto.id);
        if (updatedActive) setActivePhoto(updatedActive);
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Call Server-Side Gemini API for AI SEO & Keywords
  const handleGenerateAI = async () => {
    if (!activePhoto) return;
    setIsGeneratingAI(true);

    try {
      const res = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: activePhoto.enhancedCanvasUrl || activePhoto.originalUrl,
          mimeType: "image/jpeg",
          customContext: `Filename: ${activePhoto.filename}`
        })
      });

      if (!res.ok) {
        throw new Error("Failed to generate AI metadata");
      }

      const data = await res.json();

      const updatedPhoto: ProcessedPhoto = {
        ...activePhoto,
        metadata: {
          title: data.title || activePhoto.metadata.title,
          description: data.description || activePhoto.metadata.description,
          keywords: data.keywords || activePhoto.metadata.keywords,
          category: data.category || activePhoto.metadata.category,
          objects: data.objects || activePhoto.metadata.objects,
          dominantColors: data.dominantColors || activePhoto.metadata.dominantColors,
          complianceTips: data.complianceTips || activePhoto.metadata.complianceTips
        }
      };

      setActivePhoto(updatedPhoto);
      setAllPhotos((prev) =>
        prev.map((p) => (p.id === activePhoto.id ? updatedPhoto : p))
      );
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Run Python Execution Simulation
  const handleRunPythonSim = async () => {
    setIsSimulatingPython(true);
    try {
      const res = await fetch("/api/python/run-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageName: activePhoto.filename,
          qualityScore: activePhoto.quality.stockComplianceScore,
          hasFaces: activePhoto.faceAnalysis.hasHumanFace,
          keywordsCount: activePhoto.metadata.keywords.length
        })
      });

      const data = await res.json();
      if (data.logs) {
        setSimulationLogs(data.logs);
      }
    } catch (err) {
      console.error("Python Sim error:", err);
    } finally {
      setIsSimulatingPython(false);
    }
  };

  // Download complete Python package .zip
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExporter={() => setIsExporterOpen(true)}
        onDownloadPythonZip={handleDownloadPythonZip}
        onRunPythonSim={handleRunPythonSim}
        photosCount={allPhotos.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === "workspace" ? (
          <>
            {/* Top Photo Carousel & Uploader (Batch Upload Supported) */}
            <PhotoUploader
              activePhoto={activePhoto}
              onSelectPhoto={handleSelectPhoto}
              onCustomPhotosUpload={handleCustomPhotosUpload}
              allPhotos={allPhotos}
              onRemovePhoto={handleRemovePhoto}
            />

            {/* Batch Processing Controls Toolbar */}
            <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center space-x-2 text-xs">
                <Layers className="w-4 h-4 text-orange-400" />
                <span className="font-mono text-orange-400 font-bold bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">
                  BATCH QUEUE: {allPhotos.length} PHOTOS
                </span>
                <span className="text-white/60 hidden md:inline">
                  Select multiple files to process simultaneously
                </span>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <button
                  onClick={handleBatchAITagging}
                  disabled={isGeneratingAI}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs rounded transition disabled:opacity-50 shadow"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? "animate-spin" : ""}`} />
                  <span>{isGeneratingAI ? "Auto-Tagging All Photos..." : `Batch AI Auto-Tag (${allPhotos.length} Photos)`}</span>
                </button>

                <button
                  onClick={() => setIsExporterOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded border border-white/20 transition"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Batch Export All ZIP</span>
                </button>
              </div>
            </div>

            {/* Active Studio Grid */}
            {activePhoto && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Enhancer Studio & Face Privacy Inspector */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Non-Destructive Live Enhancer Canvas */}
                  <EnhancerStudio
                    adjustments={activePhoto.adjustments}
                    onChangeAdjustments={handleUpdateAdjustments}
                    originalUrl={activePhoto.originalUrl}
                    enhancedUrl={activePhoto.enhancedCanvasUrl}
                  />

                  {/* Face Privacy & Model Release Inspector */}
                  <FacePrivacyInspector
                    faceAnalysis={activePhoto.faceAnalysis}
                  />

                  {/* Technical EXIF & IPTC Viewer */}
                  <MetadataExifViewer
                    exif={activePhoto.exif}
                    metadata={activePhoto.metadata}
                    filename={activePhoto.filename}
                  />
                </div>

                {/* Right Column: Stock Compliance Quality & AI SEO Keywords */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Stock Compliance Score Card */}
                  <QualityCard quality={activePhoto.quality} />

                  {/* Real-time RGB Histogram */}
                  <HistogramView histogram={activePhoto.histogram} />

                  {/* AI Metadata & SEO Keyword Studio */}
                  <AITagSEOStudio
                    metadata={activePhoto.metadata}
                    dominantColors={activePhoto.dominantColors}
                    onUpdateMetadata={(newMeta) => {
                      const updated = { ...activePhoto, metadata: newMeta };
                      setActivePhoto(updated);
                      setAllPhotos((prev) =>
                        prev.map((p) => (p.id === activePhoto.id ? updated : p))
                      );
                    }}
                    onGenerateAI={handleGenerateAI}
                    isGenerating={isGeneratingAI}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          /* Python Engine Architecture Code Explorer View */
          <PythonCodeExplorer
            onRunSimulation={handleRunPythonSim}
            simulationLogs={simulationLogs}
            isSimulating={isSimulatingPython}
          />
        )}
      </main>

      {/* Batch Export Modal */}
      <BatchExporterModal
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
        photos={allPhotos}
      />
    </div>
  );
}
