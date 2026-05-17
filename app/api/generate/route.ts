import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { fallbackOutput } from "@/lib/fallback-output";
import type { GenerateResponse, LessonOutput, TeacherInput } from "@/lib/types";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-4-6";

function withFallback(reason: string): GenerateResponse {
  console.warn(`[generate] using fallback: ${reason}`);
  return { output: fallbackOutput, usedFallback: true };
}

function parseLessonOutput(raw: string): LessonOutput | null {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    const obj = JSON.parse(trimmed.slice(start, end + 1));
    if (
      typeof obj.needSummary === "string" &&
      typeof obj.teachingMove === "string" &&
      typeof obj.miniStory === "string" &&
      Array.isArray(obj.targetWords) &&
      obj.targetWords.every((w: unknown) => typeof w === "string") &&
      typeof obj.reviewNote === "string"
    ) {
      return obj as LessonOutput;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<NextResponse<GenerateResponse>> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(withFallback("ANTHROPIC_API_KEY not set"));
  }

  let input: TeacherInput;
  try {
    input = (await request.json()) as TeacherInput;
  } catch {
    return NextResponse.json(withFallback("request body was not valid JSON"));
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(input) }],
    });

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const parsed = parseLessonOutput(text);
    if (!parsed) {
      return NextResponse.json(withFallback("model output did not parse as LessonOutput"));
    }
    return NextResponse.json({ output: parsed, usedFallback: false });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(withFallback(`Anthropic call failed: ${reason}`));
  }
}
