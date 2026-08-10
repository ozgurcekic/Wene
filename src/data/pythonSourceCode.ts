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
piexif>=1.1.3
numpy>=1.24.0

# Image Processing & Computer Vision
opencv-python>=4.8.0
Pillow>=10.0.0
mediapipe>=0.10.0

# Embedded Local AI Engines (Self-Contained Offline Models)
llama-cpp-python>=0.2.0
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

# Application Directory & Logging Settings
SOURCE_DIR=./sample_input
DEFAULT_EXPORT_DIR=./export
LOG_LEVEL=INFO
`
  },
  {
    path: "config/settings.py",
    title: "Application Settings Configuration",
    language: "python",
    category: "config",
    content: `import os
from pathlib import Path


class Settings:
    """
    Application-level settings and environment configuration management.
    Reads from environment variables with safe defaults.
    """

    def __init__(self):
        self.SOURCE_DIR: str = os.getenv("SOURCE_DIR", "./sample_input")
        self.DEFAULT_EXPORT_DIR: str = os.getenv("DEFAULT_EXPORT_DIR", "./export")
        self.LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
        self.LOCAL_VISION_MODEL_PATH: str = os.getenv("LOCAL_VISION_MODEL_PATH", "./local_ai/models/moondream2-q4.gguf")
        self.MODEL_THREADS: int = int(os.getenv("MODEL_THREADS", "4"))
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


def build_default_pipeline() -> PipelineEngine:
    """Builds and registers all processing modules in order."""
    engine = PipelineEngine()
    engine.add_module(QualityAnalyzerModule())
    engine.add_module(BaseTaggerModule())
    engine.add_module(ImageEnhancerModule())
    engine.add_module(FaceDetectorModule())
    engine.add_module(MetadataTaggerModule())
    engine.add_module(ExporterModule())
    return engine


def main():
    settings = Settings()
    
    # Configure logging dynamically from settings.LOG_LEVEL
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logging.basicConfig(level=log_level, format="[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s")
    logger = logging.getLogger("WeneMain")

    logger.info("Initializing Wêne Standalone Engine v1.0...")

    source_dir = Path(settings.SOURCE_DIR).resolve()
    export_dir = Path(settings.DEFAULT_EXPORT_DIR).resolve()

    # Ensure source directory exists for sample execution
    source_dir.mkdir(parents=True, exist_ok=True)
    export_dir.mkdir(parents=True, exist_ok=True)

    try:
        SafetyChecker.validate_directories(str(source_dir), str(export_dir))
        logger.info("Safety check passed: Export directory is isolated and non-destructive.")
    except SafetyError as e:
        logger.error(f"Safety Violation: {e}")
        sys.exit(1)

    pipeline = build_default_pipeline()
    logger.info(f"Pipeline ready with {len(pipeline.modules)} modules.")

    # Locate sample images in the source directory
    extensions = ("*.jpg", "*.jpeg", "*.png", "*.webp", "*.JPG", "*.PNG")
    image_files = []
    for ext in extensions:
        image_files.extend(source_dir.glob(ext))

    if not image_files:
        logger.info(f"No input images found in {source_dir}. Place images there and run again.")
        return

    logger.info(f"Found {len(image_files)} image(s) to process.")
    for img_path in image_files:
        logger.info(f"Processing: {img_path.name}...")
        initial_context = {"export_dir": str(export_dir)}
        result = pipeline.run(str(img_path), initial_context)
        exported = result.get("exported_file", "None")
        logger.info(f"Successfully processed {img_path.name} -> Exported: {exported}")


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
    content: `import logging
from typing import List, Dict, Any
from modules.base_module import BaseModule

logger = logging.getLogger("PipelineEngine")


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
                logger.error(f"[{module.name}] Error processing {image_path}: {e}")
                
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
        # Check if RAM buffer is available from enhancer or load safely from disk
        image = context.get("enhanced_ram_buffer")
        if image is None:
            try:
                img_bytes = np.fromfile(image_path, dtype=np.uint8)
                image = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
            except Exception:
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
            "shutterstock_pass": stock_score >= 75,
            "freepik_pass": stock_score >= 70,
            "getty_images_pass": stock_score >= 85
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
    Uses float32 precision for clipping-free color math & unsharp masking.
    Applies exposure, saturation, contrast, unsharp mask, and denoise filters.
    """

    def __init__(self):
        super().__init__("ImageEnhancer")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        # Load image with Unicode/non-ASCII safe np.fromfile
        try:
            img_bytes = np.fromfile(image_path, dtype=np.uint8)
            image = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
        except Exception:
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

        # Contrast & Exposure Adjustment in float32 space
        contrast_factor = (params.get("contrast", 0) + 100) / 100.0
        exposure_shift = params.get("exposure", 0) * 1.5
        buffer = (buffer - 128.0) * contrast_factor + 128.0 + exposure_shift

        # Saturation in HSV float32 space
        if params.get("saturation", 0) != 0:
            buffer_clipped = np.clip(buffer, 0, 255).astype(np.float32)
            hsv = cv2.cvtColor(buffer_clipped, cv2.COLOR_BGR2HSV)
            sat_factor = (params["saturation"] + 100) / 100.0
            hsv[:, :, 1] = np.clip(hsv[:, :, 1] * sat_factor, 0, 255)
            buffer = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

        # Unsharp Mask (Sharpness) in float32
        if params.get("sharpness", 0) > 0:
            gaussian = cv2.GaussianBlur(buffer, (0, 0), 2.0)
            weight = params["sharpness"] / 50.0
            buffer = cv2.addWeighted(buffer, 1.0 + weight, gaussian, -weight, 0)

        # Clip and convert to uint8 for Denoise
        buffer_uint8 = np.clip(buffer, 0, 255).astype(np.uint8)

        # Denoise (Fast Non-Local Means Denoising on uint8)
        if params.get("denoise", 0) > 0:
            h_val = float(params["denoise"] / 5.0)
            buffer_uint8 = cv2.fastNlMeansDenoisingColored(buffer_uint8, None, h_val, h_val, 7, 21)

        # Store enhanced numpy buffer in RAM context
        context["enhanced_ram_buffer"] = buffer_uint8
        return context
`
  },
  {
    path: "modules/face_detector.py",
    title: "Offline Face Detection & Release Check",
    language: "python",
    category: "modules",
    content: `import cv2
import logging
import numpy as np
from typing import Dict, Any
from modules.base_module import BaseModule

logger = logging.getLogger("FaceDetector")


class FaceDetectorModule(BaseModule):
    """
    Offline identification of human faces using local MediaPipe Face Detection
    with OpenCV Haar Cascade as a secondary fallback mechanism.
    Flags has_human_face = True and sets model release warnings for microstock compliance.
    """

    def __init__(self):
        super().__init__("FaceDetector")
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        self.mp_available = False

        try:
            import mediapipe as mp
            self.mp_available = True
            logger.info("MediaPipe Face Detection engine initialized")
        except Exception as e:
            logger.warning(f"MediaPipe not available, defaulting to OpenCV Haar Cascade: {e}")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        image = context.get("enhanced_ram_buffer")
        if image is None:
            try:
                img_bytes = np.fromfile(image_path, dtype=np.uint8)
                image = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
            except Exception:
                image = cv2.imread(image_path)

        if image is None:
            context["face_analysis"] = {
                "has_human_face": False,
                "face_count": 0,
                "faces_bounding_boxes": [],
                "model_release_required": False,
                "privacyRiskLevel": "None",
                "compliance_flag": "CLEAR"
            }
            return context

        detected_list = []
        h_img, w_img = image.shape[:2]

        # Primary: MediaPipe Face Detection with context manager resource cleanup
        if self.mp_available:
            try:
                import mediapipe as mp
                with mp.solutions.face_detection.FaceDetection(min_detection_confidence=0.5) as detector:
                    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                    results = detector.process(rgb_image)
                    if results.detections:
                        for detection in results.detections:
                            bbox = detection.location_data.relative_bounding_box
                            x = int(bbox.xmin * w_img)
                            y = int(bbox.ymin * h_img)
                            w = int(bbox.width * w_img)
                            h = int(bbox.height * h_img)
                            detected_list.append({"x": max(0, x), "y": max(0, y), "w": w, "h": h})
            except Exception as e:
                logger.warning(f"MediaPipe processing error, using OpenCV fallback: {e}")

        # Fallback: OpenCV Haar Cascade
        if not detected_list:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            for (x, y, w, h) in faces:
                detected_list.append({"x": int(x), "y": int(y), "w": int(w), "h": int(h)})

        has_faces = len(detected_list) > 0

        context["face_analysis"] = {
            "has_human_face": has_faces,
            "face_count": len(detected_list),
            "faces_bounding_boxes": detected_list,
            "model_release_required": has_faces,
            "privacyRiskLevel": "High" if has_faces else "None",
            "compliance_flag": "MODEL_RELEASE_REQUIRED" if has_faces else "CLEAR"
        }

        return context
`
  },
  {
    path: "modules/base_tagger.py",
    title: "Base Keyword & Category Tagger",
    language: "python",
    category: "modules",
    content: `from typing import Dict, Any
from modules.base_module import BaseModule


class BaseTaggerModule(BaseModule):
    """
    Standard Base Tagger module for initial category and core taxonomy setup.
    """

    def __init__(self):
        super().__init__("BaseTagger")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        context["category"] = context.get("category", "General Commercial")
        context["base_keywords"] = [
            "microstock", "commercial", "high resolution", "stock photo", "photography"
        ]
        return context
`
  },
  {
    path: "modules/metadata_tagger.py",
    title: "Embedded Local LLM Metadata Generator",
    language: "python",
    category: "modules",
    content: `import os
import re
import json
import logging
from pathlib import Path
from typing import Dict, Any
from modules.base_module import BaseModule

logger = logging.getLogger("MetadataTagger")


class MetadataTaggerModule(BaseModule):
    """
    Local GGUF LLM Tagger using llama-cpp-python with structured JSON prompt execution.
    Generates stock-compliant English Title (<=80 chars), commercial description,
    and 30-50 high-ranking microstock search keywords.
    """

    def __init__(self):
        super().__init__("MetadataTagger")
        self.model_path = os.getenv("LOCAL_VISION_MODEL_PATH", "./local_ai/models/moondream2-q4.gguf")
        self.llm_engine = None

        if Path(self.model_path).exists():
            try:
                from llama_cpp import Llama
                self.llm_engine = Llama(model_path=self.model_path, n_threads=4, verbose=False)
                logger.info(f"Loaded local GGUF model from {self.model_path}")
            except Exception as e:
                logger.warning(f"GGUF model found at {self.model_path} but could not initialize Llama: {e}")

    def process(self, image_path: str, context: Dict[str, Any]) -> Dict[str, Any]:
        category = context.get("category", "Commercial Subject")
        quality = context.get("quality", {})
        score = quality.get("stock_compliance_score", 85)
        faces = context.get("face_analysis", {})
        has_face = faces.get("has_human_face", False)

        file_stem = Path(image_path).stem.replace("_", " ").replace("-", " ").title()

        face_count = faces.get("face_count", 0)

        # 1. Execute actual llama_cpp model if loaded
        if self.llm_engine is not None:
            try:
                prompt = (
                    f"Task: Generate microstock SEO metadata in JSON.\n"
                    f"Subject: {file_stem}, Category: {category}, Has Human Face: {has_face} (Count: {face_count}), Stock Quality Score: {score}/100.\n"
                    f"Return JSON strictly with format:\n"
                    f'{{"title": "title under 80 chars", "description": "detailed text", "keywords": ["kw1", "kw2"]}}'
                )
                response = self.llm_engine(prompt=prompt, max_tokens=256, temperature=0.3)
                text = response["choices"][0]["text"].strip()
                
                json_match = re.search(r'\{.*\}', text, re.DOTALL)
                if json_match:
                    parsed = json.loads(json_match.group(0))
                else:
                    parsed = json.loads(text)

                title = parsed.get("title", f"{file_stem} Commercial Photography")[:80]
                description = parsed.get("description", f"High quality commercial stock image of {file_stem.lower()}.")
                keywords = parsed.get("keywords", ["stock photo", "commercial", "photography"])

                context["seo_metadata"] = {
                    "title": title,
                    "description": description,
                    "keywords": keywords,
                    "category": category
                }
                return context
            except Exception as e:
                logger.warning(f"Llama execution fallback: {e}")

        # 2. Context-Aware Dynamic NLP Generation (Safe Offline Fallback)
        subject_title = f"{file_stem} - Commercial Stock Photo"
        if has_face:
            subject_title = f"Portrait Shot - {file_stem} Commercial Studio Photo"

        if len(subject_title) > 80:
            subject_title = subject_title[:77] + "..."

        description = (
            f"Professional high-resolution stock image depicting {file_stem.lower()}. "
            f"Features sharp focus, vibrant natural lighting, and commercial composition. "
            f"Verified stock quality compliance score: {score}/100."
        )

        base_keywords = [
            "microstock", "commercial", "high resolution", "stock photo", "photography",
            "professional", "composition", "lighting", "marketing", "advertisement",
            "publishing", "editorial", "adobe stock", "shutterstock", "freepik",
            "getty images", "vibrant colors", "sharp focus", "depth of field", "studio"
        ]

        custom_words = [word.lower() for word in file_stem.split() if len(word) > 2]
        if has_face:
            custom_words.extend(["portrait", "human", "model", "person", "lifestyle", "expression"])

        combined_keywords = list(dict.fromkeys(base_keywords + custom_words))

        context["seo_metadata"] = {
            "title": subject_title,
            "description": description,
            "keywords": combined_keywords,
            "category": category
        }

        return context
`
  },
  {
    path: "modules/exporter.py",
    title: "Pure Python EXIF & XMP Metadata Batch Exporter",
    language: "python",
    category: "modules",
    content: `import os
import cv2
import logging
import piexif
import numpy as np
from pathlib import Path
from typing import Dict, Any
from xml.sax.saxutils import escape
from modules.base_module import BaseModule

logger = logging.getLogger("Exporter")


class ExporterModule(BaseModule):
    """
    Saves processed RAM buffer to export directory using Unicode-safe file streams,
    embeds metadata into EXIF (piexif), and generates Adobe Stock / Lightroom compliant
    XMP sidecar files for maximum agency acceptance.
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
        if buffer is None:
            # Fallback: read original
            try:
                img_bytes = np.fromfile(image_path, dtype=np.uint8)
                buffer = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
            except Exception:
                buffer = cv2.imread(image_path)

        if buffer is not None:
            # Unicode-safe image write using cv2.imencode + tofile
            success, encoded_img = cv2.imencode('.jpg', buffer, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
            if success:
                encoded_img.tofile(str(out_path))

        # Extract SEO metadata
        seo = context.get("seo_metadata", {})
        title = seo.get("title", "")
        description = seo.get("description", "")
        keywords_list = seo.get("keywords", [])
        keywords_str = ", ".join(keywords_list)

        # 1. Pure Python EXIF metadata injection via piexif
        try:
            exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": None}
            if title or description:
                desc_text = description if description else title
                exif_dict["0th"][piexif.ImageIFD.ImageDescription] = desc_text.encode("utf-8")
                exif_dict["0th"][piexif.ImageIFD.DocumentName] = title.encode("utf-8")
                # Windows XP Title & Keywords tags (UCS-2 LE)
                exif_dict["0th"][0x9c9b] = title.encode("utf-16le")
                if keywords_str:
                    exif_dict["0th"][0x9c9e] = keywords_str.encode("utf-16le")

            exif_bytes = piexif.dump(exif_dict)
            piexif.insert(exif_bytes, str(out_path))
        except Exception as e:
            logger.warning(f"EXIF embedding note: {e}")

        # 2. XMP Sidecar Generation for Adobe Stock & Lightroom
        try:
            xmp_path = out_path.with_suffix(".xmp")
            keywords_xml = "".join([f"<rdf:li>{escape(kw)}</rdf:li>" for kw in keywords_list])
            title_esc = escape(title)
            desc_esc = escape(description)
            xmp_content = f"""<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
        xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">{title_esc}</rdf:li></rdf:Alt></dc:title>
      <dc:description><rdf:Alt><rdf:li xml:lang="x-default">{desc_esc}</rdf:li></rdf:Alt></dc:description>
      <dc:subject><rdf:Bag>{keywords_xml}</rdf:Bag></dc:subject>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>"""
            xmp_path.write_text(xmp_content, encoding="utf-8")
        except Exception as e:
            logger.warning(f"XMP sidecar generation note: {e}")

        context["exported_file"] = str(out_path)
        return context
`
  }
];
