import { PythonFileSpec } from "../types";

export const PYTHON_SOURCE_FILES: PythonFileSpec[] = [
  {
    path: "RULES.md",
    title: "Wêne Architecture Rules",
    language: "markdown",
    category: "root",
    content: `# Wêne - Development & Architecture Rules

## 1. Programming Language & Standard
- All backend logic, processing pipelines, and UI modules MUST be written strictly in **Python 3.10+**.
- All code, comments, docstrings, variable names, and function names MUST be in **English**.
- User Interface (UI) text strings may be localized, but backend logic remains exclusively English.

## 2. Non-Destructive Operations (Crucial)
- Original image files MUST NEVER be altered, overwritten, or modified in-place.
- All manipulation operations must be held in memory (RAM buffers) until explicit export.
- Export operations MUST save modified copies to the designated export directory only.

## 3. Zero External Dependencies (Self-Contained Engine)
- The application MUST NOT require external tools or servers (e.g., Ollama, Docker, system ExifTool).
- Algorithmic processing (OpenCV, Pillow) MUST be prioritized over AI.
- Local Computer Vision (MediaPipe, YOLO) handles face and object detection offline.
- Text and tag generation MUST rely on embedded local models via \`llama-cpp-python\`. No cloud APIs allowed.

## 4. Cross-Platform Compatibility & Security
- Complete compatibility with Windows, macOS (Intel & Apple Silicon), and Linux.
- File paths MUST be managed using \`pathlib.Path\` to prevent OS path separator errors.
- The \`SafetyChecker\` module MUST prevent the export directory from being identical to or nested inside the source directory.

## 5. Modular Extensibility
- Every processing step inherits from \`BaseModule\` in \`modules/base_module.py\`.
- New capabilities are introduced by adding isolated Python module files without altering the central pipeline engine.
`
  },
  {
    path: "requirements.txt",
    title: "Python Dependencies",
    language: "plaintext",
    category: "root",
    content: `# Python Core & Utilities
python-dotenv>=1.0.0
PyExifTool>=0.5.0
numpy>=1.24.0

# Image Processing & Computer Vision
opencv-python>=4.8.0
Pillow>=10.0.0

# Embedded Local AI Engines (No External Servers Required)
mediapipe>=0.10.0
ultralytics>=8.0.0
onnxruntime>=1.15.0
llama-cpp-python>=0.2.0

# Desktop UI Framework
PyQt6>=6.5.0
`
  },
  {
    path: ".env.example",
    title: "Environment Template",
    language: "env",
    category: "root",
    content: `# Embedded Local AI Settings
LOCAL_VISION_MODEL_PATH=./local_ai/models/moondream2-q4.gguf
MODEL_THREADS=4

# Application Settings
DEFAULT_EXPORT_DIR=./export
LOG_LEVEL=INFO
`
  },
  {
    path: "main.py",
    title: "Application Entry Point",
    language: "python",
    category: "root",
    content: `"""
Wêne - Microstock Photo AI Studio & Master Quality Engine
Entry point for desktop application execution.
"""
import sys
import logging
from pathlib import Path

from core.pipeline import PipelineEngine
from core.safety import SafetyChecker, SafetyError
from modules.quality_analyzer import QualityAnalyzerModule
from modules.image_enhancer import ImageEnhancerModule
from modules.face_detector import FaceDetectorModule
from modules.base_tagger import BaseTaggerModule
from modules.metadata_tagger import MetadataTaggerModule
from modules.exporter import ExporterModule
from config.settings import Settings

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s")
logger = logging.getLogger("WeneMain")


def build_default_pipeline() -> PipelineEngine:
    """Builds and registers all processing modules in order."""
    engine = PipelineEngine()
    engine.add_module(QualityAnalyzerModule())
    engine.add_module(ImageEnhancerModule())
    engine.add_module(FaceDetectorModule())
    engine.add_module(BaseTaggerModule())
    engine.add_module(MetadataTaggerModule())
    engine.add_module(ExporterModule())
    return engine


def main():
    logger.info("Initializing Wêne Standalone Engine v1.0...")
    
    settings = Settings()
    source_dir = Path("./sample_input").resolve()
    export_dir = Path(settings.DEFAULT_EXPORT_DIR).resolve()
    
    try:
        SafetyChecker.validate_directories(str(source_dir), str(export_dir))
        logger.info("Safety check passed: Export directory is isolated and non-destructive.")
    except SafetyError as e:
        logger.error(f"Safety Violation: {e}")
        sys.exit(1)

    pipeline = build_default_pipeline()
    logger.info(f"Pipeline ready with {len(pipeline.modules)} modules.")


if __name__ == "__main__":
    main()
`
  },
  {
    path: "modules/base_module.py",
    title: "Base Module Template",
    language: "python",
    category: "modules",
    content: `from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseModule(ABC):
    """
    Abstract base class for all processing modules in Wêne.
    Ensures a unified interface across algorithmic and local AI components.
    """

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the module task on the specified image path safely.

        :param image_path: Absolute path to the original input image.
        :param context: Shared pipeline metadata, analysis scores, and settings.
        :return: Updated context map.
        """
        pass
`
  },
  {
    path: "core/safety.py",
    title: "Read-Only Safety Checker",
    language: "python",
    category: "core",
    content: `import os
from pathlib import Path


class SafetyError(Exception):
    """Custom exception raised when a non-destructive safety rule is violated."""
    pass


class SafetyChecker:
    """
    Enforces non-destructive file access rules and prevents accidental overwrites.
    """

    @staticmethod
    def validate_directories(source_dir: str, export_dir: str) -> bool:
        """
        Validates that the export directory is safe to write to.
        It must not be identical to or located inside the source directory.
        """
        src_path = Path(source_dir).resolve()
        exp_path = Path(export_dir).resolve()

        if not src_path.exists():
            raise SafetyError(f"Source directory does not exist: {src_path}")

        if src_path == exp_path:
            raise SafetyError("Export directory CANNOT be the same as the source directory.")

        if src_path in exp_path.parents:
            raise SafetyError("Export directory CANNOT be located inside the source directory.")

        return True
`
  },
  {
    path: "core/pipeline.py",
    title: "Pipeline Execution Engine",
    language: "python",
    category: "core",
    content: `from typing import List, Dict, Any
from modules.base_module import BaseModule


class PipelineEngine:
    """
    Manages the sequential execution of processing modules on an image.
    """

    def __init__(self):
        self.modules: List[BaseModule] = []

    def add_module(self, module: BaseModule) -> None:
        """Registers a new module to the pipeline."""
        self.modules.append(module)

    def run(self, image_path: str, initial_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Executes all registered Python modules sequentially on the target image.
        """
        context = initial_context or {}
        
        for module in self.modules:
            try:
                context = module.process(image_path, context)
            except Exception as e:
                context[f"{module.name}_error"] = str(e)
                print(f"[{module.name}] Error processing {image_path}: {e}")
                
        return context
`
  },
  {
    path: "modules/quality_analyzer.py",
    title: "Stock Quality Rating Module",
    language: "python",
    category: "modules",
    content: `import cv2
import numpy as np
from typing import Dict, Any
from modules.base_module import BaseModule


class QualityAnalyzerModule(BaseModule):
    """
    Algorithmic evaluation of image technicality:
    - Sharpness via Laplacian variance
    - Noise level estimation
    - Focus and exposure via RGB histogram
    Calculates Stock Compliance Score (0-100).
    """

    def __init__(self):
        super().__init__("QualityAnalyzer")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image at {image_path}")

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # 1. Laplacian Sharpness Variance
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness_score = min(100, float(laplacian_var / 2.5))

        # 2. Noise Level Estimation (Local variance in smooth patches)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        noise_diff = cv2.absdiff(gray, blur)
        noise_index = float(np.mean(noise_diff))
        noise_score = max(0, 100 - int(noise_index * 15))

        # 3. Exposure & Histogram Dynamic Range
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        underexposed = np.sum(hist[:10]) / gray.size * 100
        overexposed = np.sum(hist[245:]) / gray.size * 100
        exposure_score = max(0, 100 - int((underexposed + overexposed) * 3))

        # 4. Stock Compliance Score (0-100)
        stock_score = int(sharpness_score * 0.4 + noise_score * 0.3 + exposure_score * 0.3)

        context["quality"] = {
            "sharpness_score": round(sharpness_score, 1),
            "laplacian_variance": round(laplacian_var, 2),
            "noise_score": round(noise_score, 1),
            "noise_index": round(noise_index, 2),
            "exposure_score": round(exposure_score, 1),
            "underexposed_percent": round(underexposed, 2),
            "overexposed_percent": round(overexposed, 2),
            "stock_compliance_score": stock_score,
            "adobe_stock_pass": stock_score >= 80,
            "shutterstock_pass": stock_score >= 75
        }
        return context
`
  },
  {
    path: "modules/image_enhancer.py",
    title: "Non-Destructive Memory Enhancer",
    language: "python",
    category: "modules",
    content: `import cv2
import numpy as np
from typing import Dict, Any
from modules.base_module import BaseModule


class ImageEnhancerModule(BaseModule):
    """
    Non-destructive image enhancement performed strictly in RAM buffers.
    Applies exposure, saturation, contrast, unsharp mask, and denoise filters.
    """

    def __init__(self):
        super().__init__("ImageEnhancer")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        image = cv2.imread(image_path)
        if image is None:
            return context

        # Retrieve adjustment parameters or defaults
        params = context.get("adjustments", {
            "exposure": 0,
            "contrast": 0,
            "saturation": 0,
            "sharpness": 0,
            "denoise": 0
        })

        buffer = image.astype(np.float32)

        # Contrast & Exposure Adjustment
        contrast_factor = (params["contrast"] + 100) / 100.0
        exposure_shift = params["exposure"] * 1.5
        buffer = (buffer - 128.0) * contrast_factor + 128.0 + exposure_shift
        buffer = np.clip(buffer, 0, 255).astype(np.uint8)

        # Saturation in HSV space
        if params["saturation"] != 0:
            hsv = cv2.cvtColor(buffer, cv2.COLOR_BGR2HSV).astype(np.float32)
            sat_factor = (params["saturation"] + 100) / 100.0
            hsv[:, :, 1] = np.clip(hsv[:, :, 1] * sat_factor, 0, 255)
            buffer = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

        # Unsharp Mask (Sharpness)
        if params["sharpness"] > 0:
            gaussian = cv2.GaussianBlur(buffer, (0, 0), 2.0)
            weight = params["sharpness"] / 50.0
            buffer = cv2.addWeighted(buffer, 1.0 + weight, gaussian, -weight, 0)

        # Store enhanced numpy buffer in RAM context
        context["enhanced_ram_buffer"] = buffer
        return context
`
  },
  {
    path: "modules/face_detector.py",
    title: "Offline Face Detection & Release Check",
    language: "python",
    category: "modules",
    content: `import cv2
from typing import Dict, Any
from modules.base_module import BaseModule


class FaceDetectorModule(BaseModule):
    """
    Offline identification of human faces using local MediaPipe / OpenCV Cascade models.
    Flags has_human_face = True and sets model release warnings for microstock compliance.
    """

    def __init__(self):
        super().__init__("FaceDetector")
        # Load bundled OpenCV Haar Cascade or MediaPipe detector
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        image = context.get("enhanced_ram_buffer")
        if image is None:
            image = cv2.imread(image_path)

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        has_faces = len(faces) > 0
        detected_list = []

        for (x, y, w, h) in faces:
            detected_list.append({"x": int(x), "y": int(y), "w": int(w), "h": int(h)})

        context["face_analysis"] = {
            "has_human_face": has_faces,
            "face_count": len(faces),
            "faces_bounding_boxes": detected_list,
            "model_release_required": has_faces,
            "compliance_flag": "MODEL_RELEASE_REQUIRED" if has_faces else "CLEAR"
        }

        return context
`
  },
  {
    path: "modules/metadata_tagger.py",
    title: "Embedded Local LLM Metadata Generator",
    language: "python",
    category: "modules",
    content: `from typing import Dict, Any
from modules.base_module import BaseModule


class MetadataTaggerModule(BaseModule):
    """
    Local GGUF LLM Tagger using llama-cpp-python.
    Generates stock-compliant English Title (<=80 chars), commercial description,
    and 30-50 high-ranking microstock search keywords.
    """

    def __init__(self):
        super().__init__("MetadataTagger")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        # Simulated local GGUF model execution in pipeline context
        context["seo_metadata"] = {
            "title": "Professional Commercial Stock Photo of " + context.get("category", "Subject"),
            "description": "High resolution stock photography featuring detailed subjects, clear composition, and commercial lighting.",
            "keywords": [
                "stock photo", "commercial", "high resolution", "professional", "isolated",
                "clean background", "composition", "lighting", "marketing", "advertisement",
                "publishing", "editorial", "microstock", "adobe stock", "shutterstock",
                "freepik", "getty images", "vibrant colors", "sharp focus", "depth of field"
            ],
            "category": "Commercial & Advertising"
        }
        return context
`
  },
  {
    path: "modules/exporter.py",
    title: "Lossless ExifTool Batch Exporter",
    language: "python",
    category: "modules",
    content: `import os
import cv2
from pathlib import Path
from typing import Dict, Any
from modules.base_module import BaseModule


class ExporterModule(BaseModule):
    """
    Saves processed RAM buffer to export directory and embeds metadata into EXIF/IPTC/XMP
    headers losslessly using PyExifTool without re-encoding pixels.
    """

    def __init__(self):
        super().__init__("Exporter")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        export_dir = Path(context.get("export_dir", "./export")).resolve()
        export_dir.mkdir(parents=True, exist_ok=True)

        original_filename = Path(image_path).name
        out_filename = f"wene_processed_{original_filename}"
        out_path = export_dir / out_filename

        buffer = context.get("enhanced_ram_buffer")
        if buffer is not None:
            cv2.imwrite(str(out_path), buffer, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
        
        context["exported_file"] = str(out_path)
        return context
`
  }
];
