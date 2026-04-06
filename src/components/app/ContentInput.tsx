"use client";

import { useState } from "react";
import { MessageSquare, Globe, Mail, Hash, Sparkles, Loader2 } from "lucide-react";

type Platform = "twitter" | "linkedin" | "newsletter" | "instagram";

interface ContentInputProps {
  onGenerate: (content: string, platforms: Platform[]) => void;
  loading: boolean;
}

const platforms: { id: Platform; name: string; icon: React.ReactNode; color: string }[] = [
  { id: "twitter", name: "Twitter/X", icon: <MessageSquare className="w-4 h-4" />, color: "peer-checked:border-sky-400 peer-checked:text-sky-400" },
  { id: "linkedin", name: "LinkedIn", icon: <Globe className="w-4 h-4" />, color: "peer-checked:border-blue-500 peer-checked:text-blue-500" },
  { id: "newsletter", name: "Newsletter", icon: <Mail className="w-4 h-4" />, color: "peer-checked:border-green-400 peer-checked:text-green-400" },
  { id: "instagram", name: "Instagram", icon: <Hash className="w-4 h-4" />, color: "peer-checked:border-pink-400 peer-checked:text-pink-400" },
];

export default function ContentInput({ onGenerate, loading }: ContentInputProps) {
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<Set<Platform>>(new Set(["twitter", "linkedin"]));

  const togglePlatform = (id: Platform) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#888] mb-2">
          Paste your content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your blog post, article, or any content here..."
          className="w-full h-64 bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 text-white placeholder-[#555] resize-none focus:outline-none focus:border-[#7c3aed] transition-colors font-mono text-sm leading-relaxed"
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-[#555]">{wordCount} words</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#888] mb-3">
          Choose platforms
        </label>
        <div className="flex flex-wrap gap-3">
          {platforms.map((p) => (
            <label key={p.id} className="cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => togglePlatform(p.id)}
                className="peer sr-only"
              />
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2a2a2a] text-[#888] transition-all hover:border-[#444] ${p.color} peer-checked:bg-[#1e1e1e]`}>
                {p.icon}
                <span className="text-sm font-medium">{p.name}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => onGenerate(content, Array.from(selected))}
        disabled={loading || !content.trim() || selected.size === 0}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Content
          </>
        )}
      </button>
    </div>
  );
}
