import Anthropic from "@anthropic-ai/sdk";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompt";
import { fallbackOutput } from "@/lib/fallback-output";
import { parseStrict, validateLesson } from "@/lib/parse";
import type {
  GenerateRequest,
  LessonOutput,
  StreamEvent,
} from "@/lib/types";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 16000;

function ndjson(event: StreamEvent): string {
  return JSON.stringify(event) + "\n";
}

function ndjsonResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

function singleEventResponse(event: StreamEvent): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(ndjson(event)));
      controller.close();
    },
  });
  return ndjsonResponse(stream);
}

function fallbackResponse(reason: string): Response {
  console.warn(`[generate] using fallback: ${reason}`);
  return singleEventResponse({
    t: "final",
    output: fallbackOutput,
    usedFallback: true,
  });
}

async function runAnthropic(
  client: Anthropic,
  messages: Anthropic.MessageParam[],
  onTextDelta: (chunk: string) => void,
): Promise<Anthropic.Message> {
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      onTextDelta(event.delta.text);
    }
  }

  const finalMessage = await stream.finalMessage();
  const u = finalMessage.usage;
  console.log(
    `[generate] usage — input:${u.input_tokens} output:${u.output_tokens} cache_read:${u.cache_read_input_tokens ?? 0} cache_create:${u.cache_creation_input_tokens ?? 0}`,
  );
  return finalMessage;
}

function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackResponse("ANTHROPIC_API_KEY not set");
  }

  let input: GenerateRequest;
  try {
    input = (await request.json()) as GenerateRequest;
  } catch {
    return fallbackResponse("request body was not valid JSON");
  }

  const { priorLesson, ...teacherInput } = input;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const userPrompt = buildUserPrompt(teacherInput, priorLesson);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) => {
        controller.enqueue(encoder.encode(ndjson(event)));
      };
      const sendText = (chunk: string) => send({ t: "text", v: chunk });

      try {
        const firstMessage = await runAnthropic(
          client,
          [{ role: "user", content: userPrompt }],
          sendText,
        );
        const firstText = extractText(firstMessage);
        const firstParsed = parseStrict(firstText);

        if (!firstParsed) {
          send({
            t: "final",
            output: fallbackOutput,
            usedFallback: true,
          });
          controller.close();
          console.warn(
            "[generate] using fallback: model output did not contain reasoning JSON + all required sections",
          );
          return;
        }

        const violations = validateLesson(firstParsed);
        if (violations.length === 0) {
          send({ t: "final", output: firstParsed, usedFallback: false });
          controller.close();
          return;
        }

        console.warn(
          `[generate] retrying once — violations: ${violations.join(" | ")}`,
        );

        const revisionPrompt = [
          `Your previous response had these issues:`,
          ...violations.map((v) => `- ${v}`),
          ``,
          `Revise your response to fix them. Return the same TWO-part format: the \`\`\`json reasoning block, then the nine markdown sections. Update any sections (especially "Decodable Story", "Mini Lesson", "Word Work") that need to change to satisfy the constraints.`,
        ].join("\n");

        const retryMessage = await runAnthropic(
          client,
          [
            { role: "user", content: userPrompt },
            { role: "assistant", content: firstMessage.content },
            { role: "user", content: revisionPrompt },
          ],
          () => {
            // Retry response is not streamed to the client — it would be
            // confusing to see content appear-then-replace. The final event
            // below carries the revised output.
          },
        );

        const retryText = extractText(retryMessage);
        const retryParsed = parseStrict(retryText);
        const finalOutput: LessonOutput = retryParsed ?? firstParsed;
        send({ t: "final", output: finalOutput, usedFallback: false });
        controller.close();
      } catch (err) {
        const reason = err instanceof Error ? err.message : "unknown error";
        console.warn(`[generate] anthropic call failed: ${reason}`);
        send({
          t: "final",
          output: fallbackOutput,
          usedFallback: true,
        });
        controller.close();
      }
    },
  });

  return ndjsonResponse(stream);
}
