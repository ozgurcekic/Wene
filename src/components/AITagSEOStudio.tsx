import React, { useState } from "react";
import { Sparkles, Copy, Check, Plus, X, Search, Tag, Palette, RefreshCw } from "lucide-react";
import { StockMetadata, DominantColor } from "../types";

interface AITagSEOStudioProps {
  metadata: StockMetadata;
  dominantColors: DominantColor[];
  onUpdateMetadata: (meta: StockMetadata) => void;
  onGenerateAI: () => Promise<void>;
  isGenerating: boolean;
}

export const AITagSEOStudio: React.FC<AITagSEOStudioProps> = ({
  metadata,
  dominantColors,
  onUpdateMetadata,
  onGenerateAI,
  isGenerating
}) => {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedCSV, setCopiedCSV] = useState(false);
  const [keywordSearch, setKeywordSearch] = useState("");
  const [newKeywordInput, setNewKeywordInput] = useState("");

  const handleCopy = (text: string, setCopiedFn: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newKeywordInput.trim().toLowerCase();
    if (tag && !metadata.keywords.includes(tag)) {
      onUpdateMetadata({
        ...metadata,
        keywords: [...metadata.keywords, tag]
      });
      setNewKeywordInput("");
    }
  };

  const handleRemoveKeyword = (tagToRemove: string) => {
    onUpdateMetadata({
      ...metadata,
      keywords: metadata.keywords.filter((k) => k !== tagToRemove)
    });
  };

  const filteredKeywords = metadata.keywords.filter((kw) =>
    kw.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  const titleLength = metadata.title ? metadata.title.length : 0;
  const isTitleLengthOk = titleLength <= 80;

  return (
    <div id="ai-tag-seo-studio" className="bg-black/40 border border-white/10 rounded-lg p-5 space-y-4 shadow-2xl">
      {/* Studio Header & AI Refresh Button */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
              Microstock AI SEO & Keyword Studio
            </h3>
            <p className="text-xs text-white/80">
              Generates Adobe Stock & Shutterstock search-optimized metadata
            </p>
          </div>
        </div>

        <button
          onClick={onGenerateAI}
          disabled={isGenerating}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs rounded shadow transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
          <span>{isGenerating ? "Analyzing AI..." : "Re-Generate SEO"}</span>
        </button>
      </div>

      {/* Stock Title Field (Max 80 Chars) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Stock Title (Max 80 Characters)</label>
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span className={isTitleLengthOk ? "text-emerald-400 font-semibold" : "text-rose-400 font-bold"}>
              {titleLength} / 80 Chars
            </span>
            <button
              onClick={() => handleCopy(metadata.title, setCopiedTitle)}
              className="text-white/40 hover:text-orange-400 transition"
              title="Copy Title"
            >
              {copiedTitle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => onUpdateMetadata({ ...metadata, title: e.target.value })}
          className="w-full bg-black/60 border border-white/10 focus:border-orange-500/80 rounded p-2.5 text-xs text-white/90 focus:outline-none transition font-medium"
          placeholder="Stock photography commercial title..."
        />
      </div>

      {/* Commercial Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Commercial Description</label>
          <button
            onClick={() => handleCopy(metadata.description, setCopiedDesc)}
            className="text-white/40 hover:text-orange-400 transition"
            title="Copy Description"
          >
            {copiedDesc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <textarea
          rows={2}
          value={metadata.description}
          onChange={(e) => onUpdateMetadata({ ...metadata, description: e.target.value })}
          className="w-full bg-black/60 border border-white/10 focus:border-orange-500/80 rounded p-2.5 text-xs text-white/90 focus:outline-none transition resize-none"
          placeholder="Detailed description for microstock reviewers..."
        />
      </div>

      {/* Category & Dominant Color Palette */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Category & Objects */}
        <div className="bg-black/60 p-3 rounded border border-white/10 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-white/70">
            <Tag className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] uppercase tracking-wider text-white/50">Category & Objects</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded font-medium">
              {metadata.category}
            </span>
            {metadata.objects.map((obj, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-white/5 text-white/70 rounded border border-white/10">
                {obj}
              </span>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-black/60 p-3 rounded border border-white/10 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-white/70">
            <Palette className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] uppercase tracking-wider text-white/50">Extracted Color Palette</span>
          </div>
          <div className="flex items-center space-x-2">
            {dominantColors.map((col, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 bg-white/5 px-2 py-1 rounded border border-white/10 text-[10px]">
                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                <span className="font-mono text-white/70">{col.hex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords Section (30 - 50 Stock Keywords) */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
              Microstock Keywords
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">
              {metadata.keywords.length} / 50 Tags
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(metadata.keywords.join(", "), setCopiedKeywords)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-xs rounded border border-white/10 transition"
            >
              {copiedKeywords ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy Keywords</span>
            </button>

            <button
              onClick={() => handleCopy(metadata.keywords.map((k) => `"${k}"`).join(","), setCopiedCSV)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-xs rounded border border-white/10 transition"
            >
              {copiedCSV ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy CSV</span>
            </button>
          </div>
        </div>

        {/* Add & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/40" />
            <input
              type="text"
              placeholder="Filter tags..."
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded pl-8 pr-3 py-1.5 text-xs text-white/90 focus:outline-none"
            />
          </div>

          <form onSubmit={handleAddKeyword} className="flex items-center space-x-1.5 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Add keyword..."
              value={newKeywordInput}
              onChange={(e) => setNewKeywordInput(e.target.value)}
              className="bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white/90 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-black font-semibold text-xs rounded transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Keyword Pills Container */}
        <div className="bg-black/60 p-3 rounded border border-white/10 max-h-48 overflow-y-auto flex flex-wrap gap-1.5">
          {filteredKeywords.length > 0 ? (
            filteredKeywords.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] bg-white/5 hover:bg-white/10 text-white/80 rounded border border-white/10 transition group"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveKeyword(tag)}
                  className="text-white/40 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-white/40 py-2 italic">
              No matching keywords found.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
