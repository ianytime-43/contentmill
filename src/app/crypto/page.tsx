"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Sparkles,
  Loader2,
  Clock,
  Mail,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Ticker {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
}

interface MarketData {
  tickers: Ticker[];
  sentiment: "bullish" | "bearish" | "neutral";
  greenCount: number;
  redCount: number;
  avgChange: number;
  updatedAt: string;
}

interface Candle {
  time: string;
  price: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number, digits = 2): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(digits)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(digits)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(digits)}K`;
  return `$${n.toFixed(digits)}`;
}

function fmtPrice(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n < 1 ? 4 : 2,
    maximumFractionDigits: n < 1 ? 6 : 2,
  });
}

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    // bold
    const bolded = line.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-white font-semibold">$1</strong>'
    );
    // bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      return (
        <li
          key={i}
          className="ml-4 list-disc text-[#ccc] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: bolded.replace(/^[\s]*[-*]\s/, "") }}
        />
      );
    }
    // headings
    if (line.trim().startsWith("### ")) {
      return (
        <h4
          key={i}
          className="text-white font-bold text-base mt-4 mb-1"
          dangerouslySetInnerHTML={{
            __html: bolded.replace(/^[\s]*###\s/, ""),
          }}
        />
      );
    }
    if (line.trim().startsWith("## ")) {
      return (
        <h3
          key={i}
          className="text-white font-bold text-lg mt-5 mb-2"
          dangerouslySetInnerHTML={{
            __html: bolded.replace(/^[\s]*##\s/, ""),
          }}
        />
      );
    }
    if (line.trim() === "") return <br key={i} />;
    return (
      <p
        key={i}
        className="text-[#ccc] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: bolded }}
      />
    );
  });
}

/* ------------------------------------------------------------------ */
/*  Fallback / demo data                                               */
/* ------------------------------------------------------------------ */

const DEMO_TICKERS: Ticker[] = [
  { symbol: "BTC", name: "Bitcoin", price: 69007, change24h: 2.83, volume: 187_300_000 },
  { symbol: "ETH", name: "Ethereum", price: 3512, change24h: 1.47, volume: 94_500_000 },
  { symbol: "SOL", name: "Solana", price: 178.42, change24h: 5.12, volume: 42_100_000 },
  { symbol: "BNB", name: "BNB", price: 612.8, change24h: -0.34, volume: 18_700_000 },
  { symbol: "XRP", name: "XRP", price: 0.6284, change24h: -1.22, volume: 12_300_000 },
  { symbol: "ADA", name: "Cardano", price: 0.4817, change24h: 3.41, volume: 8_400_000 },
  { symbol: "AVAX", name: "Avalanche", price: 38.96, change24h: 4.73, volume: 6_700_000 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.1623, change24h: -2.18, volume: 5_900_000 },
  { symbol: "DOT", name: "Polkadot", price: 7.41, change24h: 1.05, volume: 4_200_000 },
  { symbol: "LINK", name: "Chainlink", price: 14.82, change24h: 2.19, volume: 3_800_000 },
  { symbol: "MATIC", name: "Polygon", price: 0.7134, change24h: -0.87, volume: 3_100_000 },
  { symbol: "UNI", name: "Uniswap", price: 9.57, change24h: 1.63, volume: 2_400_000 },
];

function buildDemoMarket(tickers: Ticker[]): MarketData {
  const greenCount = tickers.filter((t) => t.change24h > 0).length;
  const redCount = tickers.filter((t) => t.change24h < 0).length;
  const avgChange =
    tickers.reduce((s, t) => s + t.change24h, 0) / tickers.length;
  const sentiment: MarketData["sentiment"] =
    avgChange > 1 ? "bullish" : avgChange < -1 ? "bearish" : "neutral";
  return {
    tickers,
    sentiment,
    greenCount,
    redCount,
    avgChange,
    updatedAt: new Date().toISOString(),
  };
}

function generateDemoCandles(): Candle[] {
  const candles: Candle[] = [];
  let price = 67500;
  const now = Date.now();
  for (let i = 47; i >= 0; i--) {
    price += (Math.random() - 0.47) * 600;
    candles.push({
      time: new Date(now - i * 3600_000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: Math.round(price),
    });
  }
  return candles;
}

const DEMO_ANALYSIS = `## Market Overview

The crypto market is showing **bullish momentum** with the majority of top assets posting positive 24-hour returns.

### Key Observations

- **Bitcoin** is leading the charge at $69,007, up 2.83% — approaching the psychological $70K resistance level
- **Solana** is the top performer among large caps with a 5.12% gain, driven by increased DeFi activity
- **Ethereum** remains steady above $3,500 with a healthy 1.47% gain

### Risk Assessment

- Overall market sentiment: **Bullish with caution**
- The Fear & Greed Index suggests moderate greed — watch for potential pullbacks
- Volume patterns indicate genuine buying interest, not just leverage-driven moves

### Signals

- **BTC**: Hold / Accumulate on dips below $68,000
- **ETH**: Bullish above $3,400 support
- **SOL**: Strong momentum — trailing stop recommended at $170
- **BNB & XRP**: Neutral — wait for clearer direction

*Analysis generated by AI. Not financial advice. Always do your own research.*`;

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function CryptoDashboard() {
  const [market, setMarket] = useState<MarketData | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [analysis, setAnalysis] = useState<string>("");
  const [analysisTime, setAnalysisTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- Fetch market data ---- */
  const fetchMarket = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/crypto/market");
      if (res.ok) {
        const data: MarketData = await res.json();
        setMarket(data);
      } else {
        // fallback to demo
        setMarket(buildDemoMarket(DEMO_TICKERS));
      }
    } catch {
      setMarket(buildDemoMarket(DEMO_TICKERS));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* ---- Fetch candle data ---- */
  const fetchCandles = useCallback(async () => {
    try {
      const res = await fetch("/api/crypto/candles");
      if (res.ok) {
        const data: Candle[] = await res.json();
        setCandles(data);
      } else {
        setCandles(generateDemoCandles());
      }
    } catch {
      setCandles(generateDemoCandles());
    }
  }, []);

  /* ---- Generate AI analysis ---- */
  const generateAnalysis = async () => {
    if (!market) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/crypto/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers: market.tickers }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis || data.text || "");
      } else {
        setAnalysis(DEMO_ANALYSIS);
      }
    } catch {
      setAnalysis(DEMO_ANALYSIS);
    } finally {
      setAnalyzing(false);
      setAnalysisTime(new Date().toLocaleString());
    }
  };

  /* ---- Subscribe ---- */
  const handleSubscribe = async () => {
    if (!email || subscribing) return;
    setSubscribing(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "crypto-waitlist" }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true); // graceful
    } finally {
      setSubscribing(false);
    }
  };

  /* ---- Effects ---- */
  useEffect(() => {
    fetchMarket();
    fetchCandles();
    intervalRef.current = setInterval(() => {
      fetchMarket(true);
      fetchCandles();
    }, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchMarket, fetchCandles]);

  /* ---- Derived ---- */
  const sentimentColor =
    market?.sentiment === "bullish"
      ? "bg-emerald-500/20 border-emerald-500/40"
      : market?.sentiment === "bearish"
        ? "bg-red-500/20 border-red-500/40"
        : "bg-yellow-500/20 border-yellow-500/40";

  const sentimentLabel =
    market?.sentiment === "bullish"
      ? "BULLISH"
      : market?.sentiment === "bearish"
        ? "BEARISH"
        : "NEUTRAL";

  const sentimentIcon =
    market?.sentiment === "bullish" ? (
      <TrendingUp className="w-4 h-4 text-emerald-400" />
    ) : market?.sentiment === "bearish" ? (
      <TrendingDown className="w-4 h-4 text-red-400" />
    ) : (
      <Activity className="w-4 h-4 text-yellow-400" />
    );

  /* ---- Render ---- */
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* ===== NAV ===== */}
      <nav className="sticky top-0 z-50 border-b border-[#2a2a2a] backdrop-blur-xl" style={{ background: "rgba(10,10,10,0.85)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/crypto" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
                CryptoSignal
              </span>
              <span className="text-xs text-[#888] hidden sm:inline">
                by{" "}
                <a href="/" className="hover:text-white transition-colors">
                  ContentMill
                </a>
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchMarket(true); fetchCandles(); }}
              disabled={refreshing}
              className="p-2 rounded-lg border border-[#2a2a2a] hover:border-[#444] text-[#888] hover:text-white transition-all disabled:opacity-40"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <a
              href="/"
              className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block"
            >
              Back to ContentMill
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ===== LOADING STATE ===== */}
        {loading && !market && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
          </div>
        )}

        {market && (
          <>
            {/* ===== SENTIMENT BAR ===== */}
            <div
              className={`rounded-xl border px-4 py-3 flex flex-wrap items-center justify-between gap-3 ${sentimentColor}`}
            >
              <div className="flex items-center gap-2">
                {sentimentIcon}
                <span className="text-sm font-bold tracking-wider text-white">
                  {sentimentLabel}
                </span>
                <span className="text-xs text-[#888] ml-1">Market Sentiment</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-medium">{market.greenCount} green</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-red-400 font-medium">{market.redCount} red</span>
                </span>
                <span className="text-[#888]">
                  Avg:{" "}
                  <span
                    className={
                      market.avgChange >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {market.avgChange >= 0 ? "+" : ""}
                    {market.avgChange.toFixed(2)}%
                  </span>
                </span>
              </div>
            </div>

            {/* ===== TWO-COLUMN LAYOUT ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* ---- LEFT: Coin List ---- */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg">Top Assets</h2>
                  <span className="text-xs text-[#888] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Updates every 60s
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {market.tickers.map((t) => {
                    const positive = t.change24h >= 0;
                    return (
                      <div
                        key={t.symbol}
                        className="rounded-xl border border-[#2a2a2a] p-4 hover:border-[#444] transition-all group"
                        style={{ background: "#141414" }}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-bold text-white tracking-wide">
                            {t.symbol}
                          </span>
                          <span className="text-base font-mono font-bold text-white">
                            {fmtPrice(t.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#888]">{t.name}</span>
                          <span
                            className={`text-sm font-semibold flex items-center gap-1 ${
                              positive ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {positive ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {positive ? "+" : ""}
                            {t.change24h.toFixed(2)}%
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#2a2a2a]">
                          <span className="text-xs text-[#888]">
                            Vol: {fmt(t.volume)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ---- RIGHT: AI Analysis + Chart ---- */}
              <div className="lg:col-span-2 space-y-5">
                {/* BTC Chart */}
                <div
                  className="rounded-xl border border-[#2a2a2a] p-4"
                  style={{ background: "#141414" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-sm">BTC / USD &mdash; 48H</h3>
                    <span className="text-xs text-[#888] font-mono">
                      {candles.length > 0 &&
                        fmtPrice(candles[candles.length - 1].price)}
                    </span>
                  </div>
                  {candles.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={candles}>
                        <defs>
                          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          tick={{ fill: "#888", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          domain={["dataMin - 200", "dataMax + 200"]}
                          tick={{ fill: "#888", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}K`}
                          width={55}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#1a1a1a",
                            border: "1px solid #2a2a2a",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                          formatter={(value) => [fmtPrice(Number(value)), "Price"]}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#7c3aed"
                          strokeWidth={2}
                          fill="url(#purpleGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-[#888] animate-spin" />
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                <div
                  className="rounded-xl border border-[#2a2a2a] p-5"
                  style={{ background: "#141414" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#7c3aed]" />
                    <h3 className="text-white font-bold text-sm">AI Analysis</h3>
                  </div>

                  {!analysis && !analyzing && (
                    <div className="text-center py-6">
                      <p className="text-[#888] text-sm mb-4">
                        Get an AI-powered analysis of current market conditions,
                        trends, and signals.
                      </p>
                      <button
                        onClick={generateAnalysis}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:opacity-90 transition-opacity"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate AI Analysis
                      </button>
                    </div>
                  )}

                  {analyzing && (
                    <div className="flex flex-col items-center py-8 gap-3">
                      <Loader2 className="w-6 h-6 text-[#7c3aed] animate-spin" />
                      <span className="text-sm text-[#888]">
                        Analyzing market data...
                      </span>
                    </div>
                  )}

                  {analysis && !analyzing && (
                    <div>
                      <div className="prose-sm space-y-1 text-sm">
                        {renderMarkdown(analysis)}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between">
                        <span className="text-xs text-[#888] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {analysisTime}
                        </span>
                        <button
                          onClick={generateAnalysis}
                          className="text-xs text-[#7c3aed] hover:text-[#06b6d4] transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Regenerate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== CTA BANNER ===== */}
            <div
              className="rounded-xl border border-[#2a2a2a] p-6 sm:p-8 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.1) 100%)",
              }}
            >
              <h3 className="text-white font-bold text-lg mb-2">
                Want real-time alerts?
              </h3>
              <p className="text-[#888] text-sm mb-5 max-w-md mx-auto">
                Pro signals coming soon &mdash; AI-powered trade alerts, portfolio
                tracking, and whale movement notifications. Join the waitlist.
              </p>

              {subscribed ? (
                <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  You&apos;re on the list! We&apos;ll be in touch.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubscribe();
                  }}
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                >
                  <div className="relative flex-1 w-full">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#2a2a2a] text-sm text-white placeholder-[#666] focus:outline-none focus:border-[#7c3aed] transition-colors"
                      style={{ background: "#141414" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                  >
                    {subscribing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Join Waitlist
                  </button>
                </form>
              )}
            </div>

            {/* ===== FOOTER ===== */}
            <footer className="text-center py-6 text-xs text-[#888] space-y-1">
              <p>
                Data refreshes every 60 seconds. Not financial advice.
              </p>
              <p>
                &copy; {new Date().getFullYear()}{" "}
                <a href="/" className="hover:text-white transition-colors">
                  ContentMill
                </a>
                . All rights reserved.
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
