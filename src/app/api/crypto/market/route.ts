import { NextResponse } from "next/server";

interface Ticker {
  i: string; // instrument name e.g. "BTC_USDT"
  h: string; // 24h high
  l: string; // 24h low
  a: string; // last price
  v: string; // 24h volume
  vv: string; // 24h volume in USDT
  c: string; // 24h price change
}

export async function GET() {
  try {
    // Fetch tickers from Crypto.com public API
    const res = await fetch("https://api.crypto.com/exchange/v1/public/get-tickers", {
      next: { revalidate: 30 }, // cache for 30 seconds
    });
    const data = await res.json();

    if (data.code !== 0) {
      throw new Error("API error");
    }

    // Filter to major USDT pairs with volume
    const tickers = (data.result.data as Ticker[])
      .filter((t) => t.i.endsWith("_USDT") && parseFloat(t.vv) > 100000)
      .map((t) => ({
        symbol: t.i.replace("_USDT", ""),
        pair: t.i,
        price: parseFloat(t.a),
        high24h: parseFloat(t.h),
        low24h: parseFloat(t.l),
        change24h: parseFloat(t.c),
        volume24h: parseFloat(t.vv),
      }))
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 30);

    const totalGreen = tickers.filter((t) => t.change24h > 0).length;
    const totalRed = tickers.filter((t) => t.change24h < 0).length;
    const avgChange = tickers.reduce((sum, t) => sum + t.change24h, 0) / tickers.length;

    return NextResponse.json({
      tickers,
      summary: {
        totalCoins: tickers.length,
        green: totalGreen,
        red: totalRed,
        avgChange: Math.round(avgChange * 100) / 100,
        sentiment: totalGreen > totalRed * 1.5 ? "Bullish" : totalRed > totalGreen * 1.5 ? "Bearish" : "Neutral",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Market data error:", error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
