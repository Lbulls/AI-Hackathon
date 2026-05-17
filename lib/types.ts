export type TeacherInput = {
  studentName: string;
  grade: string;
  strengths: string;
  struggles: string;
  targetPattern: string;
  interests: string;
  notes: string;
};

export type LessonOutput = {
  needSummary: string;
  teachingMove: string;
  miniStory: string;
  targetWords: string[];
  reviewNote: string;
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

export type GenerateRequest = TeacherInput & {
  priorSessions?: PriorSession[];
};

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
