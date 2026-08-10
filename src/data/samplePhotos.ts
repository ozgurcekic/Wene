import { ProcessedPhoto } from "../types";

export const SAMPLE_PHOTOS: ProcessedPhoto[] = [
  {
    id: "sample-1",
    filename: "nordic_mountain_fjord_sunset.jpg",
    originalUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
    originalWidth: 4000,
    originalHeight: 2667,
    fileSizeFormatted: "12.4 MB",
    adjustments: {
      exposure: 0,
      contrast: 10,
      saturation: 15,
      temperature: 5,
      sharpness: 25,
      denoise: 10,
      highlights: -15,
      shadows: 15
    },
    quality: {
      sharpnessScore: 92,
      laplacianVariance: 184.5,
      noiseScore: 95,
      noiseIndex: 0.45,
      exposureScore: 89,
      dynamicRangeScore: 94,
      underexposedPixelsPercent: 1.2,
      overexposedPixelsPercent: 0.8,
      resolutionMegapixels: 10.6,
      width: 4000,
      height: 2667,
      stockComplianceScore: 94,
      stockAgencyChecklist: {
        adobeStock: true,
        shutterstock: true,
        freepik: true,
        gettyImages: true
      },
      recommendations: [
        "Excellent technical sharpness and dynamic range",
        "Slight highlight recovery applied for optimal sky detail",
        "Zero trademark or logo compliance risks detected"
      ]
    },
    histogram: {
      r: Array.from({ length: 256 }, (_, i) => Math.floor(Math.sin(i / 30) * 100 + 120)),
      g: Array.from({ length: 256 }, (_, i) => Math.floor(Math.sin(i / 25) * 80 + 100)),
      b: Array.from({ length: 256 }, (_, i) => Math.floor(Math.sin(i / 35) * 110 + 130)),
      luma: Array.from({ length: 256 }, (_, i) => Math.floor(Math.sin(i / 28) * 95 + 115))
    },
    dominantColors: [
      { hex: "#2B4C6F", rgb: [43, 76, 111], name: "Deep Fjord Blue", percent: 38 },
      { hex: "#D87A4A", rgb: [216, 122, 74], name: "Sunset Copper", percent: 26 },
      { hex: "#7E8D9B", rgb: [126, 141, 155], name: "Slate Mist", percent: 18 },
      { hex: "#1C2D37", rgb: [28, 45, 55], name: "Alpine Shadow", percent: 12 },
      { hex: "#F3C092", rgb: [243, 192, 146], name: "Warm Glow", percent: 6 }
    ],
    faceAnalysis: {
      hasHumanFace: false,
      facesCount: 0,
      faces: [],
      modelReleaseRequired: false,
      privacyRiskLevel: "None"
    },
    metadata: {
      title: "Majestic Mountain Fjord Landscape During Golden Hour Sunset",
      description: "Dramatic scenic view of calm mountain lake surrounded by rugged alpine peaks reflecting vibrant golden hour sunset sky in Nordic wilderness.",
      keywords: [
        "mountain", "fjord", "sunset", "reflection", "lake", "landscape", "nature",
        "scenic", "tranquil", "wilderness", "alpine", "dramatic sky", "golden hour",
        "norway", "scandinavia", "travel", "tourism", "adventure", "calm", "water",
        "outdoors", "horizon", "peaks", "copper sky", "majestic", "environment",
        "peaceful", "destination", "dusk", "twilight", "sunset glow", "clean air",
        "pristine", "geography", "geological", "vacation", "panoramic", "serene",
        "stock photo", "natural beauty", "eco tourism", "hiking trail", "clear reflection"
      ],
      category: "Nature & Landscapes",
      objects: ["mountain peak", "lake reflection", "sunset sky", "fjord water", "rocky cliff"],
      dominantColors: ["Deep Azure", "Sunset Copper", "Slate Blue"],
      complianceTips: ["Ready for instant commercial microstock licensing", "No model release required"]
    },
    exif: {
      cameraMake: "Sony",
      cameraModel: "ILCE-7RM4 (A7R IV)",
      lens: "FE 16-35mm F2.8 GM",
      focalLength: "24mm",
      aperture: "f/8.0",
      shutterSpeed: "1/125s",
      iso: 100,
      colorSpace: "sRGB",
      dateTimeOriginal: "2026-06-18 19:42:10",
      copyright: "Wêne Commercial License"
    }
  },
  {
    id: "sample-2",
    filename: "creative_female_architect_studio_portrait.jpg",
    originalUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1600&auto=format&fit=crop",
    originalWidth: 3840,
    originalHeight: 2560,
    fileSizeFormatted: "9.8 MB",
    adjustments: {
      exposure: 5,
      contrast: 5,
      saturation: 0,
      temperature: -2,
      sharpness: 20,
      denoise: 15,
      highlights: -10,
      shadows: 10
    },
    quality: {
      sharpnessScore: 96,
      laplacianVariance: 210.2,
      noiseScore: 92,
      noiseIndex: 0.52,
      exposureScore: 95,
      dynamicRangeScore: 91,
      underexposedPixelsPercent: 0.4,
      overexposedPixelsPercent: 0.2,
      resolutionMegapixels: 9.8,
      width: 3840,
      height: 2560,
      stockComplianceScore: 92,
      stockAgencyChecklist: {
        adobeStock: true,
        shutterstock: true,
        freepik: true,
        gettyImages: true
      },
      recommendations: [
        "Model detected! Ensure Model Release agreement is uploaded for commercial licensing.",
        "Razor-sharp focus on subject eyes and face",
        "Clean neutral studio background with soft natural catchlight"
      ]
    },
    histogram: {
      r: Array.from({ length: 256 }, (_, i) => Math.floor(Math.exp(-Math.pow(i - 140, 2) / 2000) * 200 + 20)),
      g: Array.from({ length: 256 }, (_, i) => Math.floor(Math.exp(-Math.pow(i - 130, 2) / 2000) * 180 + 20)),
      b: Array.from({ length: 256 }, (_, i) => Math.floor(Math.exp(-Math.pow(i - 120, 2) / 2000) * 160 + 20)),
      luma: Array.from({ length: 256 }, (_, i) => Math.floor(Math.exp(-Math.pow(i - 132, 2) / 2000) * 190 + 20))
    },
    dominantColors: [
      { hex: "#2A2E35", rgb: [42, 46, 53], name: "Charcoal Blazer", percent: 42 },
      { hex: "#E8C8B5", rgb: [232, 200, 181], name: "Warm Skin Tone", percent: 28 },
      { hex: "#EBECEC", rgb: [235, 236, 236], name: "Studio Soft White", percent: 18 },
      { hex: "#8A796E", rgb: [138, 121, 110], name: "Chestnut Brown", percent: 12 }
    ],
    faceAnalysis: {
      hasHumanFace: true,
      facesCount: 1,
      faces: [
        {
          id: "face-1",
          x: 35,
          y: 18,
          width: 30,
          height: 38,
          confidence: 0.98,
          croppedDataUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
        }
      ],
      modelReleaseRequired: true,
      privacyRiskLevel: "High"
    },
    metadata: {
      title: "Confident Professional Female Engineer Sitting in Modern Office Studio",
      description: "Portrait of smiling young businesswoman or architect sitting at office desk looking at camera with arms crossed in bright contemporary workspace.",
      keywords: [
        "woman", "portrait", "businesswoman", "professional", "architect", "engineer",
        "office", "confident", "smiling", "corporate", "executive", "female", "career",
        "worker", "designer", "studio", "modern office", "adult", "caucasian", "leader",
        "success", "entrepreneur", "smart", "expertise", "workplace", "blazer", "clothing",
        "face", "human", "sitting", "desk", "business portrait", "looking at camera",
        "competent", "manager", "technology", "contemporary", "headshot", "commercial"
      ],
      category: "People & Lifestyle",
      objects: ["woman face", "charcoal blazer", "studio background", "desk"],
      dominantColors: ["Charcoal Slate", "Warm Cream", "Chestnut"],
      complianceTips: ["Model release required for commercial microstock approval", "Face sharp and well-lit"]
    },
    exif: {
      cameraMake: "Canon",
      cameraModel: "EOS R5",
      lens: "RF 85mm F1.2 L USM",
      focalLength: "85mm",
      aperture: "f/2.8",
      shutterSpeed: "1/200s",
      iso: 160,
      colorSpace: "sRGB",
      dateTimeOriginal: "2026-05-12 11:15:30",
      copyright: "Wêne Commercial License"
    }
  },
  {
    id: "sample-3",
    filename: "artisan_espresso_barista_coffee_flatlay.jpg",
    originalUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1600&auto=format&fit=crop",
    originalWidth: 3600,
    originalHeight: 2400,
    fileSizeFormatted: "8.2 MB",
    adjustments: {
      exposure: 0,
      contrast: 15,
      saturation: 10,
      temperature: 12,
      sharpness: 30,
      denoise: 5,
      highlights: -20,
      shadows: 20
    },
    quality: {
      sharpnessScore: 98,
      laplacianVariance: 245.8,
      noiseScore: 96,
      noiseIndex: 0.38,
      exposureScore: 91,
      dynamicRangeScore: 92,
      underexposedPixelsPercent: 1.8,
      overexposedPixelsPercent: 0.5,
      resolutionMegapixels: 8.6,
      width: 3600,
      height: 2400,
      stockComplianceScore: 96,
      stockAgencyChecklist: {
        adobeStock: true,
        shutterstock: true,
        freepik: true,
        gettyImages: true
      },
      recommendations: [
        "Outstanding macro contrast and bean texture sharpness",
        "Rich warm earthy tonality suitable for food & beverage marketing",
        "Clean logo-free wooden background"
      ]
    },
    histogram: {
      r: Array.from({ length: 256 }, (_, i) => Math.floor(Math.sin(i / 20) * 120 + 130)),
      g: Array.from({ length: 256 }, (_, i) => Math.floor(Math.sin(i / 25) * 80 + 90)),
      b: Array.from({ length: 256 }, (_, i) => Math.floor(Math.sin(i / 30) * 50 + 60)),
      luma: Array.from({ length: 256 }, (_, i) => Math.floor(Math.sin(i / 22) * 90 + 100))
    },
    dominantColors: [
      { hex: "#3B2314", rgb: [59, 35, 20], name: "Roasted Espresso", percent: 45 },
      { hex: "#8C5835", rgb: [140, 88, 53], name: "Caramel Crema", percent: 25 },
      { hex: "#D6BF9D", rgb: [214, 191, 157], name: "Warm Oak Table", percent: 20 },
      { hex: "#FDFBF7", rgb: [253, 251, 247], name: "Ceramic Milk White", percent: 10 }
    ],
    faceAnalysis: {
      hasHumanFace: false,
      facesCount: 0,
      faces: [],
      modelReleaseRequired: false,
      privacyRiskLevel: "None"
    },
    metadata: {
      title: "Fresh Roasted Espresso Coffee Cup with Coffee Beans on Dark Wooden Table",
      description: "Top view flatlay of white ceramic cup filled with hot espresso coffee featuring rich foam crema, surrounded by scattered dark roasted coffee beans on rustic wood surface.",
      keywords: [
        "coffee", "espresso", "beans", "crema", "caffeine", "cup", "ceramic", "flatlay",
        "top view", "rustic", "wood", "table", "barista", "aroma", "beverage", "drink",
        "morning", "breakfast", "roast", "roasted", "dark", "warm", "cozy", "cafe",
        "coffee shop", "gourmet", "fresh", "hot", "steam", "concept", "lifestyle",
        "background", "texture", "food photography", "snack", "energy", "brown",
        "foam", "creamy", "roasted coffee", "still life", "commercial photo"
      ],
      category: "Food & Beverage",
      objects: ["espresso cup", "coffee crema", "roasted coffee beans", "wooden table"],
      dominantColors: ["Roasted Espresso", "Caramel Crema", "Rustic Oak"],
      complianceTips: ["Perfect high-converting commercial stock subject", "100% trademark clean"]
    },
    exif: {
      cameraMake: "Nikon",
      cameraModel: "Z 7II",
      lens: "NIKKOR Z 50mm f/1.8 S",
      focalLength: "50mm",
      aperture: "f/4.0",
      shutterSpeed: "1/160s",
      iso: 200,
      colorSpace: "sRGB",
      dateTimeOriginal: "2026-04-03 08:30:12",
      copyright: "Wêne Commercial License"
    }
  }
];
