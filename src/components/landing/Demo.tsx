"use client";

import { useState, useCallback } from "react";
import {
  MessageSquare,
  Globe,
  Mail,
  Hash,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Lock,
  Key,
} from "lucide-react";

type Platform = "twitter" | "linkedin" | "newsletter" | "instagram";

interface GeneratedContent {
  platform: Platform;
  content: string;
  pieces: string[];
}

const platformOptions: {
  id: Platform;
  label: string;
  icon: typeof MessageSquare;
}[] = [
  { id: "twitter", label: "Twitter", icon: MessageSquare },
  { id: "linkedin", label: "LinkedIn", icon: Globe },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "instagram", label: "Instagram", icon: Hash },
];

const DEMO_KEY = "contentmill_demo_used";
const BYOK_KEY = "contentmill_api_key";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-xs text-[#888] transition-all hover:border-[#7c3aed]/50 hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function platformLabel(platform: Platform): string {
  return platformOptions.find((p) => p.id === platform)?.label ?? platform;
}

function platformColor(platform: Platform): string {
  switch (platform) {
    case "twitter":
      return "text-violet-400 border-violet-500/30 bg-violet-500/10";
    case "linkedin":
      return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    case "newsletter":
      return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    case "instagram":
      return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  }
}

export default function Demo() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(
    new Set(["twitter"])
  );
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoUsed, setDemoUsed] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) {
        if (next.size > 1) next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  };

  const handleGenerate = async () => {
    // Check session limit
    if (typeof window !== "undefined" && sessionStorage.getItem(DEMO_KEY)) {
      setDemoUsed(true);
      return;
    }

    if (!content.trim()) {
      setError("Paste some content first.");
      return;
    }

    if (content.trim().length < 50) {
      setError("Add a bit more content for best results (50+ characters).");
      return;
    }

    setError("");
    setLoading(true);
    setResults([]);
    setNeedsKey(false);

    try {
      const storedKey =
        typeof window !== "undefined"
          ? sessionStorage.getItem(BYOK_KEY)
          : null;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          platforms: Array.from(selectedPlatforms),
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

      // Mark demo as used
      if (typeof window !== "undefined") {
        sessionStorage.setItem(DEMO_KEY, "true");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Subtle gradient glow behind the section */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#7c3aed]/8 to-[#06b6d4]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
            Live Demo
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Try It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
              Right Now
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-[#888] text-lg">
            No sign-up required. Paste any content and see the magic.
          </p>
        </div>

        {/* Demo card */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#141414]/80 backdrop-blur-sm p-6 sm:p-8">
          {/* Input area */}
          <div className="mb-5">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste a blog post, article, newsletter, or any content you want to repurpose..."
              rows={5}
              disabled={loading || demoUsed}
              className="w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-sm leading-relaxed text-white placeholder-[#555] transition-colors focus:border-[#7c3aed]/50 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Platform toggles */}
          <div className="mb-5 flex flex-wrap gap-2">
            {platformOptions.map(({ id, label, icon: Icon }) => {
              const selected = selectedPlatforms.has(id);
              return (
                <button
                  key={id}
                  onClick={() => togglePlatform(id)}
                  disabled={loading || demoUsed}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                    selected
                      ? "border-[#7c3aed]/50 bg-[#7c3aed]/10 text-white"
                      : "border-[#2a2a2a] bg-[#0a0a0a] text-[#888] hover:border-[#2a2a2a] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Generate button */}
          {!demoUsed && (
            <button
              onClick={handleGenerate}
              disabled={loading || !content.trim()}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#7c3aed]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Generate Free Sample
                </>
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          {/* BYOK input */}
          {needsKey && (
            <div className="mt-5 rounded-xl border border-[#7c3aed]/30 bg-[#0a0a0a] p-5">
              <div className="flex items-start gap-3 mb-4">
                <Key className="h-5 w-5 shrink-0 text-[#7c3aed] mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    This demo needs an API key to work.
                  </p>
                  <p className="mt-1 text-xs text-[#888]">
                    Enter your Anthropic API key below. It stays in your browser
                    and is never stored on our servers.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-ant-..."
                  className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 text-sm text-white placeholder-[#555] transition-colors focus:border-[#7c3aed]/50 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (apiKeyInput.trim()) {
                      sessionStorage.setItem(BYOK_KEY, apiKeyInput.trim());
                      setNeedsKey(false);
                      handleGenerate();
                    }
                  }}
                  disabled={!apiKeyInput.trim()}
                  className="shrink-0 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#7c3aed]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save &amp; Generate
                </button>
              </div>
            </div>
          )}

          {/* Demo used message */}
          {demoUsed && results.length === 0 && (
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-5">
              <Lock className="h-5 w-5 shrink-0 text-[#7c3aed]" />
              <div>
                <p className="text-sm font-medium text-white">
                  You&apos;ve used your free demo. Sign up to continue!
                </p>
                <a
                  href="/signin"
                  className="mt-1 inline-block text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:underline"
                >
                  Create your free account &rarr;
                </a>
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-[#7c3aed]/40 to-[#06b6d4]/40" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                  Your results
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-[#06b6d4]/40 to-[#7c3aed]/40" />
              </div>

              {results.map((result) => (
                <div
                  key={result.platform}
                  className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] overflow-hidden"
                >
                  {/* Platform header */}
                  <div className="flex items-center gap-2 border-b border-[#2a2a2a] px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${platformColor(result.platform)}`}
                    >
                      {platformLabel(result.platform)}
                    </span>
                    <span className="text-xs text-[#555]">
                      {result.pieces.length} piece{result.pieces.length !== 1 && "s"}
                    </span>
                  </div>

                  {/* Pieces */}
                  <div className="divide-y divide-[#2a2a2a]">
                    {result.pieces.map((piece, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-4 px-5 py-4"
                      >
                        <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-[#ccc]">
                          {piece}
                        </p>
                        <div className="shrink-0 pt-0.5">
                          <CopyButton text={piece} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* CTA after results */}
              <div className="rounded-xl border border-[#7c3aed]/30 bg-gradient-to-r from-[#7c3aed]/5 to-[#06b6d4]/5 p-6 text-center">
                <p className="mb-3 text-sm font-medium text-white">
                  Want more? Sign up free to get 3 repurposes/month
                </p>
                <a
                  href="/signin"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#7c3aed]/20"
                >
                  Sign Up Free &rarr;
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
