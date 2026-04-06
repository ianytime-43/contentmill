import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    const { tickers, summary } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const topMovers = tickers
      .sort((a: any, b: any) => Math.abs(b.change24h) - Math.abs(a.change24h))
      .slice(0, 10)
      .map((t: any) => `${t.symbol}: $${t.price.toLocaleString()} (${t.change24h > 0 ? "+" : ""}${t.change24h}%) Vol: $${(t.volume24h / 1e6).toFixed(1)}M`)
      .join("\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: `You are a crypto market analyst providing brief, actionable insights. Be direct and specific. Use data to back every claim. Never give financial advice — frame everything as analysis and observations. Format with markdown. Keep it under 300 words.`,
      messages: [
        {
          role: "user",
          content: `Analyze this crypto market snapshot:

Market Sentiment: ${summary.sentiment}
Green/Red: ${summary.green}/${summary.red}
Average 24h Change: ${summary.avgChange}%

Top Movers:
${topMovers}

Provide:
1. **Market Pulse** (2-3 sentences on overall state)
2. **Notable Signals** (2-3 specific coins to watch and why)
3. **Risk Level** (Low/Medium/High with reason)
4. **Key Levels** (support/resistance for BTC based on the data)`,
        },
      ],
    });

    const analysis =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
