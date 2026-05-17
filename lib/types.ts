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
