import { ImageAdjustments } from "../types";

export function renderEnhancedCanvas(
  imgElement: HTMLImageElement,
  adjustments: ImageAdjustments,
  maxDimension = 1600
): string {
  const canvas = document.createElement("canvas");
  let w = imgElement.naturalWidth || imgElement.width || 1200;
  let h = imgElement.naturalHeight || imgElement.height || 800;

  if (w > maxDimension || h > maxDimension) {
    if (w > h) {
      h = Math.round((h / w) * maxDimension);
      w = maxDimension;
    } else {
      w = Math.round((w / h) * maxDimension);
      h = maxDimension;
    }
  }

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return imgElement.src;

  // Build CSS filter string for browser acceleration
  const brightness = 100 + adjustments.exposure * 0.8;
  const contrast = 100 + adjustments.contrast * 0.8;
  const saturate = 100 + adjustments.saturation * 0.8;

  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
  ctx.drawImage(imgElement, 0, 0, w, h);
  ctx.filter = "none"; // Reset filter

  const imgData = ctx.getImageData(0, 0, w, h);
  const pixels = imgData.data;

  // Temperature & Shadow/Highlight Pixel Matrix Manipulations
  const tempShift = adjustments.temperature; // -100 to +100
  const highlightsShift = adjustments.highlights;
  const shadowsShift = adjustments.shadows;

  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];

    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    // 1. Temperature adjustment (Warm = more R, less B | Cool = more B, less R)
    if (tempShift !== 0) {
      r = Math.min(255, Math.max(0, r + tempShift * 0.35));
      b = Math.min(255, Math.max(0, b - tempShift * 0.35));
    }

    // 2. Highlights adjustment (affects bright pixels luma > 170)
    if (highlightsShift !== 0 && luma > 150) {
      const factor = ((luma - 150) / 105) * (highlightsShift * 0.4);
      r = Math.min(255, Math.max(0, r + factor));
      g = Math.min(255, Math.max(0, g + factor));
      b = Math.min(255, Math.max(0, b + factor));
    }

    // 3. Shadows adjustment (affects dark pixels luma < 100)
    if (shadowsShift !== 0 && luma < 110) {
      const factor = ((110 - luma) / 110) * (shadowsShift * 0.5);
      r = Math.min(255, Math.max(0, r + factor));
      g = Math.min(255, Math.max(0, g + factor));
      b = Math.min(255, Math.max(0, b + factor));
    }

    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
  }

  ctx.putImageData(imgData, 0, 0);

  // Apply Sharpness Unsharp Mask if requested
  if (adjustments.sharpness > 20) {
    applyUnsharpMask(ctx, w, h, adjustments.sharpness);
  }

  return canvas.toDataURL("image/jpeg", 0.92);
}

function applyUnsharpMask(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const pixels = imgData.data;
  const copy = new Uint8ClampedArray(pixels);

  const factor = (amount / 100) * 0.6;

  for (let y = 1; y < h - 1; y += 2) {
    for (let x = 1; x < w - 1; x += 2) {
      const i = (y * w + x) * 4;
      const up = ((y - 1) * w + x) * 4;
      const down = ((y + 1) * w + x) * 4;
      const left = (y * w + (x - 1)) * 4;
      const right = (y * w + (x + 1)) * 4;

      for (let c = 0; c < 3; c++) {
        const center = copy[i + c];
        const avgNeighbors = (copy[up + c] + copy[down + c] + copy[left + c] + copy[right + c]) / 4;
        const diff = center - avgNeighbors;
        pixels[i + c] = Math.min(255, Math.max(0, center + diff * factor));
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
