"use client";

import PlatformCard from "./PlatformCard";

interface GeneratedResult {
  platform: string;
  content: string;
  pieces: string[];
}

interface OutputDisplayProps {
  results: GeneratedResult[];
}

export default function OutputDisplay({ results }: OutputDisplayProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Generated Content</h2>
        <span className="text-sm text-[#888]">{results.length} platform{results.length !== 1 ? "s" : ""}</span>
      </div>
      {results.map((result) => (
        <PlatformCard
          key={result.platform}
          platform={result.platform}
          pieces={result.pieces}
        />
      ))}
    </div>
  );
}
