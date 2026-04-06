"use client";

import { useState } from "react";
import ContentInput from "@/components/app/ContentInput";
import OutputDisplay from "@/components/app/OutputDisplay";

interface GeneratedResult {
  platform: string;
  content: string;
  pieces: string[];
}

export default function AppPage() {
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (content: string, platforms: string[]) => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platforms }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setResults(data.results);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Repurpose Content</h1>
        <p className="text-[#888] mt-1">Paste your content below and choose which platforms to generate for.</p>
      </div>

      <ContentInput onGenerate={handleGenerate} loading={loading} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <OutputDisplay results={results} />
    </div>
  );
}
