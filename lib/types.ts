import type { SectionHeader } from "./prompt";

export type TeacherInput = {
  studentName: string;
  grade: string;
  strengths: string;
  struggles: string;
  targetPattern: string;
  interests: string;
  notes: string;
};

export type Observation = {
  behavior: string;
  evidence: string;
};

export type ReadingProcess = {
  process: string;
  confidence: number;
  reasoning: string;
};

export type InstructionalGoal = {
  goal: string;
  why: string;
};

export type LessonConstraints = {
  target_phonics_patterns: string[];
  sentence_complexity: string;
  vocabulary_control: string;
  picture_predictability: string;
  recommended_prompting_style: string[];
  targeted_reading_behaviors: string[];
  engagement_hooks: string[];
};

export type Reasoning = {
  observations: Observation[];
  reading_processes: ReadingProcess[];
  instructional_goals: InstructionalGoal[];
  lesson_constraints: LessonConstraints;
};

export type LessonOutput = {
  reasoning: Reasoning;
  sections: Record<SectionHeader, string>;
};

export type PartialLessonOutput = {
  reasoning: Reasoning | null;
  sections: Partial<Record<SectionHeader, string>>;
};

export type PriorLessonContext = {
  date: string;
  goals: string[];
  targetPatterns: string[];
  miniLessonExcerpt: string;
};

export type GenerateRequest = TeacherInput & {
  priorLesson?: PriorLessonContext;
};

export type StreamEvent =
  | { t: "text"; v: string }
  | { t: "final"; output: LessonOutput; usedFallback: boolean }
  | { t: "error"; message: string };
