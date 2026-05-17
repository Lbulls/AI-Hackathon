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
  needSummary: string;
  teachingMove: string;
  miniStory: string;
  targetWords: string[];
  reviewNote: string;
  reasoning?: Reasoning;
  sections?: Record<SectionHeader, string>;
};

export type PartialLessonOutput = {
  reasoning: Reasoning | null;
  sections: Partial<Record<SectionHeader, string>>;
};

export type GenerateResponse = {
  output: LessonOutput;
  usedFallback: boolean;
};

export type PriorSession = {
  date: string;
  targetPattern: string;
  needSummary: string;
};

export type PriorLessonContext = {
  date: string;
  goals: string[];
  targetPatterns: string[];
  miniLessonExcerpt: string;
};

export type GenerateRequest = TeacherInput & {
  priorSessions?: PriorSession[];
  priorLesson?: PriorLessonContext;
};

export type StreamEvent =
  | { t: "text"; v: string }
  | { t: "final"; output: LessonOutput; usedFallback: boolean }
  | { t: "error"; message: string };

export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ACCEPT_ATTR =
  ".jpg,.jpeg,.png,.pdf,.docx,image/jpeg,image/png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const MAX_FILE_BYTES = 8 * 1024 * 1024;

export type SessionNotes = {
  strengths: string;
  struggles: string;
  targetPattern: string;
  notes: string;
};

export type Session = {
  id: string;
  date: string;
  notes: SessionNotes;
  lesson?: LessonOutput;
  approved?: boolean;
};

export type StudentProfile = {
  id: string;
  name: string;
  grade: string;
  interests: string;
  context: string;
  scheduledTime: string;
};

export type Student = StudentProfile & {
  sessions: Session[];
};
