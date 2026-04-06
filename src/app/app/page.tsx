"use client";

import { useState } from "react";
import { Key } from "lucide-react";
import ContentInput from "@/components/app/ContentInput";
import OutputDisplay from "@/components/app/OutputDisplay";

const BYOK_KEY = "contentmill_api_key";

interface GeneratedResult {
  platform: string;
  content: string;
  pieces: string[];
}

export default function AppPage() {
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsKey, setNeedsKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [pendingContent, setPendingContent] = useState("");
  const [pendingPlatforms, setPendingPlatforms] = useState<string[]>([]);

  const handleGenerate = async (content: string, platforms: string[]) => {
    setLoading(true);
    setError("");
    setResults([]);
    setNeedsKey(false);
    setPendingContent(content);
    setPendingPlatforms(platforms);

    try {
      const storedKey =
        typeof window !== "undefined"
          ? sessionStorage.getItem(BYOK_KEY)
          : null;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          platforms,
          ...(storedKey ? { apiKey: storedKey } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsKey) {
          setNeedsKey(true);
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Generation failed");
      }

      setResults(data.results);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKeyAndRetry = () => {
    if (apiKeyInput.trim()) {
      sessionStorage.setItem(BYOK_KEY, apiKeyInput.trim());
      setNeedsKey(false);
      if (pendingContent && pendingPlatforms.length > 0) {
        handleGenerate(pendingContent, pendingPlatforms);
      }
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

      {needsKey && (
        <div className="rounded-xl border border-[#7c3aed]/30 bg-[#0a0a0a] p-6">
          <div className="flex items-start gap-3 mb-4">
            <Key className="h-5 w-5 shrink-0 text-[#7c3aed] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">
                API key required
              </p>
              <p className="mt-1 text-xs text-[#888]">
                Enter your Anthropic API key below to start generating content.
                It stays in your browser session and is never stored on our
                servers.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveKeyAndRetry();
              }}
              placeholder="sk-ant-..."
              className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 text-sm text-white placeholder-[#555] transition-colors focus:border-[#7c3aed]/50 focus:outline-none"
            />
            <button
              onClick={handleSaveKeyAndRetry}
              disabled={!apiKeyInput.trim()}
              className="shrink-0 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#7c3aed]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save &amp; Generate
            </button>
          </div>
        </div>
      )}

      <OutputDisplay results={results} />
    </div>
  );
}
