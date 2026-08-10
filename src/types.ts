export interface ImageAdjustments {
  exposure: number; // -100 to +100
  contrast: number; // -100 to +100
  saturation: number; // -100 to +100
  temperature: number; // -100 to +100 (cool to warm)
  sharpness: number; // 0 to 100
  denoise: number; // 0 to 100
  highlights: number; // -100 to +100
  shadows: number; // -100 to +100
}

export interface QualityAnalysis {
  sharpnessScore: number; // 0-100
  laplacianVariance: number;
  noiseScore: number; // 0-100 (higher is cleaner)
  noiseIndex: number;
  exposureScore: number; // 0-100
  dynamicRangeScore: number; // 0-100
  underexposedPixelsPercent: number;
  overexposedPixelsPercent: number;
  resolutionMegapixels: number;
  width: number;
  height: number;
  stockComplianceScore: number; // Overall 0-100
  stockAgencyChecklist: {
    adobeStock: boolean;
    shutterstock: boolean;
    freepik: boolean;
    gettyImages: boolean;
  };
  recommendations: string[];
}

export interface HistogramData {
  r: number[];
  g: number[];
  b: number[];
  luma: number[];
}

export interface DominantColor {
  hex: string;
  rgb: [number, number, number];
  name: string;
  percent: number;
}

export interface DetectedFace {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  croppedDataUrl: string;
}

export interface FaceAnalysis {
  hasHumanFace: boolean;
  facesCount: number;
  faces: DetectedFace[];
  modelReleaseRequired: boolean;
  privacyRiskLevel: "None" | "Low" | "Medium" | "High";
}

export interface StockMetadata {
  title: string;
  description: string;
  keywords: string[];
  category: string;
  objects: string[];
  dominantColors: string[];
  complianceTips: string[];
}

export interface TechnicalExif {
  cameraMake?: string;
  cameraModel?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  colorSpace?: string;
  dateTimeOriginal?: string;
  copyright?: string;
}

export interface ProcessedPhoto {
  id: string;
  filename: string;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  fileSizeFormatted: string;
  adjustments: ImageAdjustments;
  quality: QualityAnalysis;
  histogram: HistogramData;
  dominantColors: DominantColor[];
  faceAnalysis: FaceAnalysis;
  metadata: StockMetadata;
  exif: TechnicalExif;
  enhancedCanvasUrl?: string;
  isProcessingAI?: boolean;
}

export interface PythonFileSpec {
  path: string;
  title: string;
  language: string;
  content: string;
  category: "core" | "modules" | "utils" | "config" | "root";
}
