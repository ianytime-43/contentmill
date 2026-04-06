"use client";

import { useState } from "react";
import { Check, Copy, MessageSquare, Globe, Mail, Hash, ChevronDown, ChevronUp } from "lucide-react";

interface PlatformCardProps {
  platform: string;
  pieces: string[];
}

const platformMeta: Record<string, { name: string; icon: React.ReactNode; gradient: string }> = {
  twitter: { name: "Twitter/X", icon: <MessageSquare className="w-5 h-5" />, gradient: "from-sky-500/20 to-sky-600/5" },
  linkedin: { name: "LinkedIn", icon: <Globe className="w-5 h-5" />, gradient: "from-blue-500/20 to-blue-600/5" },
  newsletter: { name: "Newsletter", icon: <Mail className="w-5 h-5" />, gradient: "from-green-500/20 to-green-600/5" },
  instagram: { name: "Instagram", icon: <Hash className="w-5 h-5" />, gradient: "from-pink-500/20 to-pink-600/5" },
};

export default function PlatformCard({ platform, pieces }: PlatformCardProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(true);
  const meta = platformMeta[platform] || { name: platform, icon: null, gradient: "from-gray-500/20 to-gray-600/5" };

  const copyToClipboard = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between p-4 bg-gradient-to-r ${meta.gradient}`}
      >
        <div className="flex items-center gap-3">
          {meta.icon}
          <h3 className="font-semibold text-white">{meta.name}</h3>
          <span className="text-xs text-[#888] bg-[#0a0a0a] px-2 py-0.5 rounded-full">
            {pieces.length} piece{pieces.length !== 1 ? "s" : ""}
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-[#888]" /> : <ChevronDown className="w-4 h-4 text-[#888]" />}
      </button>

      {expanded && (
        <div className="p-4 space-y-3">
          {pieces.map((piece, idx) => (
            <div key={idx} className="relative group bg-[#0a0a0a] rounded-lg p-4 border border-[#1e1e1e]">
              <pre className="whitespace-pre-wrap text-sm text-[#ccc] font-sans leading-relaxed">
                {piece}
              </pre>
              <button
                onClick={() => copyToClipboard(piece, idx)}
                className="absolute top-2 right-2 p-2 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#444]"
              >
                {copiedIdx === idx ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-[#888]" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
