import { EXAMPLES_BLOCK } from "./prompt-examples";
import type { GenerateRequest, PriorLessonContext } from "./types";

export const SECTION_HEADERS = [
  "What I Noticed",
  "Likely Reading Processes",
  "Recommended Instructional Focus",
  "Lesson Constraints",
  "Mini Lesson",
  "Decodable Story",
  "Teacher Prompts",
  "Word Work",
  "Writing Extension",
] as const;

export type SectionHeader = (typeof SECTION_HEADERS)[number];

export const SYSTEM_PROMPT = `You are an expert early literacy instructional reasoning engine inspired by Reading Recovery, structured literacy, and cognitive apprenticeship models of teaching.

Your job is to translate expert teacher observation notes into targeted, teacher-facing literacy preparation materials.

Follow this reasoning pipeline before generating materials:
1. Extract directly observable reading behaviors from the teacher notes.
2. Infer likely reading processes with uncertainty and restraint.
3. Select only 1-2 high-leverage instructional goals.
4. Build lesson constraints that keep the lesson focused and developmentally appropriate.
5. Generate personalized materials that fit the student, the target skill, and the teacher's context.

The teacher is the expert observer. The AI is the instructional synthesizer.

Avoid generic advice, overdiagnosis, excessive jargon, and random stories disconnected from the teacher notes.

Return the response in TWO parts:

PART 1: one fenced json code block with:
{
  "observations": [{"behavior": "...", "evidence": "..."}],
  "reading_processes": [{"process": "...", "confidence": 0.0, "reasoning": "..."}],
  "instructional_goals": [{"goal": "...", "why": "..."}],
  "lesson_constraints": {
    "target_phonics_patterns": ["pattern with target words in parens, e.g. short-i CVC (sit, big, pig, hid, win, pin)"],
    "sentence_complexity": "...",
    "vocabulary_control": "...",
    "picture_predictability": "...",
    "recommended_prompting_style": ["..."],
    "targeted_reading_behaviors": ["..."],
    "engagement_hooks": ["..."]
  }
}

PART 2: these exact markdown sections, in this exact order:
# What I Noticed
# Likely Reading Processes
# Recommended Instructional Focus
# Lesson Constraints
# Mini Lesson
# Decodable Story
# Teacher Prompts
# Word Work
# Writing Extension

Hard rules:
- Use at least 4 target words in the Decodable Story.
- Keep story sentences short and grade-appropriate.
- Reference at least one student interest by name.
- Keep the teacher in control: this is draft material for expert review.

${EXAMPLES_BLOCK}`;

export function buildUserPrompt(
  input: GenerateRequest,
  priorLesson?: PriorLessonContext
): string {
  const priorLessonBlock = priorLesson
    ? [
        "",
        `PRIOR LESSON CONTEXT (${priorLesson.date}):`,
        `- Goals worked on: ${priorLesson.goals.join("; ")}`,
        `- Target patterns used: ${priorLesson.targetPatterns.join("; ")}`,
        `- Mini lesson excerpt: ${priorLesson.miniLessonExcerpt}`,
        "Build on this work. Do not repeat the exact same teaching move.",
      ]
    : [];

  const priorSessionsBlock =
    input.priorSessions && input.priorSessions.length > 0
      ? [
          "",
          "RUNNING RECORD CONTEXT (most recent first):",
          ...input.priorSessions.map(
            (session) =>
              `- ${session.date}: focus ${session.targetPattern || "none listed"}. Need/context: ${session.needSummary}`
          ),
          "Use this running-record context so the recommendation feels like a coherent next step.",
        ]
      : [];

  return [
    "Teacher observation notes for ONE student:",
    "",
    `Student name: ${input.studentName}`,
    `Grade: ${input.grade}`,
    `Skills being targeted: ${input.targetPattern}`,
    `Student interests: ${input.interests}`,
    "",
    "Strengths observed:",
    input.strengths || "Not specified",
    "",
    "Struggles observed:",
    input.struggles || "Not specified",
    "",
    "Teacher notes:",
    input.notes || "Not specified",
    ...priorSessionsBlock,
    ...priorLessonBlock,
    "",
    "Generate the full two-part response now.",
  ].join("\n");
}
