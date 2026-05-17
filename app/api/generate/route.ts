import Anthropic from "@anthropic-ai/sdk";
import mammoth from "mammoth";
import { NextResponse } from "next/server";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { fallbackOutput } from "@/lib/fallback-output";
import type {
  GenerateRequest,
  GenerateResponse,
  LessonOutput,
  PriorSession,
} from "@/lib/types";

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

type FilePayload = {
  block?: Anthropic.ImageBlockParam | Anthropic.DocumentBlockParam;
  appendedText?: string;
};

async function processFile(file: File): Promise<FilePayload | { error: string }> {
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = file.type;

  if (mime === "image/jpeg" || mime === "image/png") {
    return {
      block: {
        type: "image",
        source: {
          type: "base64",
          media_type: mime,
          data: buf.toString("base64"),
        },
      },
    };
  }

  if (mime === "application/pdf") {
    return {
      block: {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: buf.toString("base64"),
        },
      },
    };
  }

  if (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer: buf });
      const text = result.value.trim();
      if (!text) return { error: ".docx contained no readable text" };
      return {
        appendedText: `\n\n--- Extracted from uploaded document "${file.name}" ---\n${text}\n--- end of document ---`,
      };
    } catch (e) {
      return {
        error: `Failed to parse .docx: ${e instanceof Error ? e.message : "unknown error"}`,
      };
    }
  }

  return {
    error: `Unsupported file type: ${mime || file.name}. Use JPEG, PNG, PDF, or .docx.`,
  };
}

function parsePriorSessions(raw: string | null): PriorSession[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p) =>
        p &&
        typeof p.date === "string" &&
        typeof p.targetPattern === "string" &&
        typeof p.needSummary === "string"
    );
  } catch {
    return [];
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<GenerateResponse>> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(withFallback("ANTHROPIC_API_KEY not set"));
  }

  const contentType = request.headers.get("content-type") || "";
  let input: GenerateRequest;
  let filePayload: FilePayload | null = null;

  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await request.formData();
      input = {
        studentName: String(form.get("studentName") ?? ""),
        grade: String(form.get("grade") ?? ""),
        strengths: String(form.get("strengths") ?? ""),
        struggles: String(form.get("struggles") ?? ""),
        targetPattern: String(form.get("targetPattern") ?? ""),
        interests: String(form.get("interests") ?? ""),
        notes: String(form.get("notes") ?? ""),
        priorSessions: parsePriorSessions(
          form.get("priorSessions") as string | null
        ),
      };
      const file = form.get("attachment");
      if (file instanceof File && file.size > 0) {
        const result = await processFile(file);
        if ("error" in result) {
          return NextResponse.json(withFallback(result.error));
        }
        filePayload = result;
      }
    } catch (e) {
      return NextResponse.json(
        withFallback(
          `multipart parse failed: ${e instanceof Error ? e.message : "unknown"}`
        )
      );
    }
  } else {
    try {
      input = (await request.json()) as GenerateRequest;
    } catch {
      return NextResponse.json(withFallback("request body was not valid JSON"));
    }
  }

  if (filePayload?.appendedText) {
    input.notes = `${input.notes}${filePayload.appendedText}`;
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userContent: Anthropic.ContentBlockParam[] = [
    { type: "text", text: buildUserPrompt(input) },
  ];
  if (filePayload?.block) {
    userContent.push(filePayload.block);
  }

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const parsed = parseLessonOutput(text);
    if (!parsed) {
      return NextResponse.json(
        withFallback("model output did not parse as LessonOutput")
      );
    }
    return NextResponse.json({ output: parsed, usedFallback: false });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(withFallback(`Anthropic call failed: ${reason}`));
  }
}
