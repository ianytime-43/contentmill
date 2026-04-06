import Anthropic from "@anthropic-ai/sdk";
import { Platform, platformConfigs } from "./prompts";

const client = new Anthropic(); // Uses ANTHROPIC_API_KEY env var

export interface GeneratedContent {
  platform: Platform;
  content: string;
  pieces: string[]; // Individual pieces (tweets, posts, etc.)
}

export async function generateContent(
  sourceContent: string,
  platforms: Platform[]
): Promise<GeneratedContent[]> {
  // Run all platform generations in parallel using Promise.all
  const results = await Promise.all(
    platforms.map(async (platform) => {
      const config = platformConfigs[platform];

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: config.systemPrompt,
        messages: [
          {
            role: "user",
            content: `Here is the original content to repurpose:\n\n${sourceContent}\n\n${config.outputFormat}`,
          },
        ],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Parse into individual pieces using --- separator
      const pieces = text
        .split("---")
        .map((p) => p.trim())
        .filter(Boolean);

      return {
        platform,
        content: text,
        pieces: pieces.length > 0 ? pieces : [text],
      };
    })
  );

  return results;
}
