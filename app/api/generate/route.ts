import Anthropic from "@anthropic-ai/sdk";
import mammoth from "mammoth";
import { NextResponse } from "next/server";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { fallbackOutput } from "@/lib/fallback-output";
import { parseStrict, validateLesson } from "@/lib/parse";
import type {
  GenerateRequest,
  GenerateResponse,
  LessonOutput,
  PriorSession,
} from "@/lib/types";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-4-6";

type FilePayload = {
  block?: Anthropic.ImageBlockParam | Anthropic.DocumentBlockParam;
  appendedText?: string;
};

function withFallback(reason: string): GenerateResponse {
  console.warn(`[generate] using fallback: ${reason}`);
  return { output: fallbackOutput, usedFallback: true };
}

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

function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

async function generateLesson(
  client: Anthropic,
  userContent: Anthropic.ContentBlockParam[]
): Promise<LessonOutput | null> {
  const firstMessage = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  const firstParsed = parseStrict(extractText(firstMessage));
  if (!firstParsed) return null;

  const violations = validateLesson(firstParsed);
  if (violations.length === 0) return firstParsed;

  const revisionPrompt = [
    "Your previous response had these issues:",
    ...violations.map((v) => `- ${v}`),
    "",
    "Revise the response to fix them. Return the same two-part format with the fenced JSON reasoning block followed by the nine markdown sections.",
  ].join("\n");

  const retryMessage = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: userContent },
      { role: "assistant", content: firstMessage.content },
      { role: "user", content: revisionPrompt },
    ],
  });

  return parseStrict(extractText(retryMessage)) ?? firstParsed;
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

  const userContent: Anthropic.ContentBlockParam[] = [
    { type: "text", text: buildUserPrompt(input, input.priorLesson) },
  ];
  if (filePayload?.block) {
    userContent.push(filePayload.block);
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const output = await generateLesson(client, userContent);
    if (!output) {
      return NextResponse.json(
        withFallback("model output did not contain the required reasoning and lesson sections")
      );
    }
    return NextResponse.json({ output, usedFallback: false });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(withFallback(`Anthropic call failed: ${reason}`));
  }
}
