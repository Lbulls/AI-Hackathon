import { SECTION_HEADERS, type SectionHeader } from "./prompt";
import type { LessonOutput, PartialLessonOutput, Reasoning } from "./types";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseReasoning(raw: string): Reasoning | null {
  const fenceMatch = raw.match(/```json\s*([\s\S]*?)```/i);
  if (!fenceMatch) return null;
  try {
    const obj = JSON.parse(fenceMatch[1]);
    if (
      Array.isArray(obj.observations) &&
      Array.isArray(obj.reading_processes) &&
      Array.isArray(obj.instructional_goals) &&
      obj.lesson_constraints &&
      Array.isArray(obj.lesson_constraints.target_phonics_patterns)
    ) {
      return obj as Reasoning;
    }
    return null;
  } catch {
    return null;
  }
}

export function parseSections(raw: string): Partial<Record<SectionHeader, string>> {
  const text = raw.replace(/\r\n/g, "\n");
  const sections: Partial<Record<SectionHeader, string>> = {};

  for (let i = 0; i < SECTION_HEADERS.length; i++) {
    const header = SECTION_HEADERS[i];
    const startPattern = new RegExp(`^#\\s+${escapeRegex(header)}\\s*$`, "m");
    const startMatch = startPattern.exec(text);
    if (!startMatch) continue;

    const bodyStart = startMatch.index + startMatch[0].length;
    let bodyEnd = text.length;

    for (let j = i + 1; j < SECTION_HEADERS.length; j++) {
      const next = SECTION_HEADERS[j];
      const endPattern = new RegExp(`^#\\s+${escapeRegex(next)}\\s*$`, "m");
      const endMatch = endPattern.exec(text.slice(bodyStart));
      if (endMatch) {
        bodyEnd = bodyStart + endMatch.index;
        break;
      }
    }

    const body = text.slice(bodyStart, bodyEnd).trim();
    if (body) sections[header] = body;
  }

  return sections;
}

export function parsePartial(raw: string): PartialLessonOutput {
  return {
    reasoning: parseReasoning(raw),
    sections: parseSections(raw),
  };
}

export function parseStrict(raw: string): LessonOutput | null {
  const reasoning = parseReasoning(raw);
  if (!reasoning) return null;
  const sections = parseSections(raw);
  for (const header of SECTION_HEADERS) {
    if (!sections[header]) return null;
  }
  const completeSections = sections as Record<SectionHeader, string>;
  const targetWords = extractTargetWords(
    reasoning.lesson_constraints.target_phonics_patterns,
  );

  return {
    needSummary: completeSections["Recommended Instructional Focus"],
    teachingMove: completeSections["Mini Lesson"],
    miniStory: completeSections["Decodable Story"],
    targetWords,
    reviewNote: [
      completeSections["Teacher Prompts"],
      "",
      "Word Work:",
      completeSections["Word Work"],
      "",
      "Writing Extension:",
      completeSections["Writing Extension"],
    ].join("\n"),
    reasoning,
    sections: completeSections,
  };
}

export function extractTargetWords(patterns: string[]): string[] {
  const words = new Set<string>();
  for (const pattern of patterns) {
    const parenMatch = pattern.match(/\(([^)]+)\)/);
    if (!parenMatch) continue;
    for (const raw of parenMatch[1].split(/[,;]/)) {
      const cleaned = raw.trim().toLowerCase().replace(/[^a-z-]/g, "");
      if (cleaned.length >= 2 && cleaned.length <= 12) {
        words.add(cleaned);
      }
    }
  }
  return Array.from(words);
}

export function validateLesson(output: LessonOutput): string[] {
  const violations: string[] = [];
  const story = output.sections?.["Decodable Story"] ?? output.miniStory;
  if (!story) {
    violations.push("The Decodable Story section is empty.");
    return violations;
  }

  const targetWords = extractTargetWords(
    output.reasoning?.lesson_constraints.target_phonics_patterns ?? output.targetWords,
  );
  if (targetWords.length >= 4) {
    const lowerStory = story.toLowerCase();
    const found = targetWords.filter((w) =>
      new RegExp(`\\b${escapeRegex(w)}\\b`).test(lowerStory),
    );
    if (found.length < 4) {
      violations.push(
        `The Decodable Story uses only ${found.length} of the ${targetWords.length} listed target words (${targetWords.join(", ")}). Revise it to include at least 4.`,
      );
    }
  }

  const sentences = story
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const longSentences = sentences.filter((s) => s.split(/\s+/).length > 12);
  if (longSentences.length > 0) {
    violations.push(
      `These sentences exceed 12 words (too complex for early decodable text): ${longSentences.map((s) => `"${s}"`).join("; ")}. Shorten them.`,
    );
  }

  return violations;
}
