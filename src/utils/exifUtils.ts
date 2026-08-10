import { TechnicalExif, StockMetadata } from "../types";

export function generateCSVMetadata(metadata: StockMetadata, filename: string, exif?: TechnicalExif): string {
  const headers = ["Filename", "Title", "Description", "Keywords", "Category", "Camera", "ISO", "Aperture"];
  const escapedTitle = `"${(metadata.title || "").replace(/"/g, '""')}"`;
  const escapedDesc = `"${(metadata.description || "").replace(/"/g, '""')}"`;
  const escapedKeywords = `"${(metadata.keywords || []).join(", ").replace(/"/g, '""')}"`;
  const category = `"${metadata.category || "General"}"`;
  const camera = `"${(exif?.cameraMake || "")} ${(exif?.cameraModel || "")}"`;
  const iso = exif?.iso ? String(exif.iso) : "100";
  const aperture = `"${exif?.aperture || "f/2.8"}"`;

  const row = [`"${filename}"`, escapedTitle, escapedDesc, escapedKeywords, category, camera, iso, aperture];

  return `${headers.join(",")}\n${row.join(",")}`;
}

export function generateSidecarJSON(metadata: StockMetadata, filename: string, exif?: TechnicalExif): string {
  return JSON.stringify(
    {
      version: "Wêne 1.0 Microstock Engine",
      filename,
      iptc: {
        objectName: metadata.title,
        caption: metadata.description,
        keywords: metadata.keywords,
        category: metadata.category
      },
      exif: exif || {},
      generatedAt: new Date().toISOString()
    },
    null,
    2
  );
}
