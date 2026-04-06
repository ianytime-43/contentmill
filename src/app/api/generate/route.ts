import { NextRequest, NextResponse } from "next/server";
import { generateContent, GeneratedContent } from "@/lib/ai";
import { Platform } from "@/lib/prompts";

const VALID_PLATFORMS: Platform[] = [
  "twitter",
  "linkedin",
  "newsletter",
  "instagram",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, platforms, apiKey } = body as {
      content: string;
      platforms: Platform[];
      apiKey?: string;
    };

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: "At least one platform is required" },
        { status: 400 }
      );
    }

    // Validate platforms
    const validPlatforms = platforms.filter((p) =>
      VALID_PLATFORMS.includes(p)
    );
    if (validPlatforms.length === 0) {
      return NextResponse.json(
        { error: "No valid platforms selected" },
        { status: 400 }
      );
    }

    // Determine which API key to use: server env takes priority, then user-provided
    const effectiveKey = process.env.ANTHROPIC_API_KEY || apiKey;
    if (!effectiveKey) {
      return NextResponse.json(
        {
          error:
            "API key not configured. Please add your Anthropic API key to use this feature.",
          needsKey: true,
        },
        { status: 401 }
      );
    }

    // Limit content length (roughly 10,000 words)
    const trimmedContent = content.slice(0, 50000);

    const results: GeneratedContent[] = await generateContent(
      trimmedContent,
      validPlatforms,
      effectiveKey
    );

    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
