import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "BTC_USDT";
  const timeframe = req.nextUrl.searchParams.get("timeframe") || "4h";

  try {
    const res = await fetch(
      `https://api.crypto.com/exchange/v1/public/get-candlestick?instrument_name=${symbol}&timeframe=${timeframe}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();

    if (data.code !== 0) {
      throw new Error("API error");
    }

    const candles = data.result.data.map((c: any) => ({
      time: c.t,
      open: parseFloat(c.o),
      high: parseFloat(c.h),
      low: parseFloat(c.l),
      close: parseFloat(c.c),
      volume: parseFloat(c.v),
    }));

    return NextResponse.json({ candles });
  } catch (error) {
    console.error("Candles error:", error);
    return NextResponse.json({ error: "Failed to fetch candles" }, { status: 500 });
  }
}
