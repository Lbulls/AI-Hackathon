import type { GenerateRequest } from "./types";

export const SYSTEM_PROMPT = `You are a literacy coach preparing draft materials for a credentialed early-literacy teacher. Your work is inspired by Reading Recovery practices but is not a certified intervention. The teacher will review and adapt everything you produce.

Your job is to take the teacher's notes about ONE student and return a small set of lesson-prep materials in strict JSON. Be specific to this student — never produce generic advice that could apply to any child.

Hard rules for the mini-story:
- 4 to 8 short sentences, vocabulary appropriate to the stated grade.
- Must use at least 4 of the words you list in "targetWords".
- Must reference at least one of the student's interests by name.
- Story should make sense as a whole — the teacher will read it with the student.

Output JSON shape (no other keys, no markdown, no commentary):
{
  "needSummary": string,    // 1-2 sentences naming this student's specific next need
  "teachingMove": string,   // one concrete teaching move the teacher could try in the next session
  "miniStory": string,      // 4-8 sentences, see rules above
  "targetWords": string[],  // 6-10 words from the target pattern, all appearing in or appropriate to the story
  "reviewNote": string      // 1-3 short bullets, separated by newlines, listing things the teacher should verify before using
}

Return ONLY the JSON object. No prose before or after. No markdown fences.`;

export function buildUserPrompt(input: GenerateRequest): string {
  const lines = [
    `Student name: ${input.studentName}`,
    `Grade: ${input.grade}`,
    `Strengths the teacher has observed today: ${input.strengths}`,
    `Struggles the teacher has observed today: ${input.struggles}`,
    `Target sound or pattern for this week: ${input.targetPattern}`,
    `Student interests: ${input.interests}`,
    `Additional teacher notes: ${input.notes}`,
  ];

  if (input.priorSessions && input.priorSessions.length > 0) {
    lines.push("", "Context from previous sessions (most recent first):");
    for (const ps of input.priorSessions) {
      lines.push(
        `- ${ps.date} — focus: ${ps.targetPattern}. Need: ${ps.needSummary}`
      );
    }
    lines.push(
      "",
      "Use this prior context to make today's recommendation feel like a coherent next step, not a one-off."
    );
  }

  lines.push(
    "",
    "Draft the lesson materials now. Return only valid JSON. No prose, no markdown fences."
  );
  return lines.join("\n");
}
