import type {
  LessonOutput,
  PriorLessonContext,
  TeacherInput,
} from "./types";

const STORAGE_KEY = "teacher-copilot-lessons-v1";
const MAX_LESSONS = 200;

export type StoredLesson = {
  id: string;
  timestamp: number;
  input: TeacherInput;
  output: LessonOutput;
};

function loadAll(): StoredLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredLesson);
  } catch {
    return [];
  }
}

function saveAll(lessons: StoredLesson[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = lessons.slice(-MAX_LESSONS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable — skip silently
  }
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function saveLesson(
  input: TeacherInput,
  output: LessonOutput,
): StoredLesson {
  const lesson: StoredLesson = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    input,
    output,
  };
  const all = loadAll();
  all.push(lesson);
  saveAll(all);
  return lesson;
}

export function getLessonsForStudent(studentName: string): StoredLesson[] {
  const normalized = normalizeName(studentName);
  if (!normalized) return [];
  return loadAll()
    .filter((l) => normalizeName(l.input.studentName) === normalized)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function deleteLesson(id: string): void {
  const all = loadAll().filter((l) => l.id !== id);
  saveAll(all);
}

export function toPriorLessonContext(lesson: StoredLesson): PriorLessonContext {
  const miniLesson = lesson.output.sections["Mini Lesson"] ?? "";
  return {
    date: new Date(lesson.timestamp).toISOString().slice(0, 10),
    goals: lesson.output.reasoning.instructional_goals.map((g) => g.goal),
    targetPatterns:
      lesson.output.reasoning.lesson_constraints.target_phonics_patterns,
    miniLessonExcerpt:
      miniLesson.length > 400 ? miniLesson.slice(0, 400) + "…" : miniLesson,
  };
}

function isStoredLesson(obj: unknown): obj is StoredLesson {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.timestamp === "number" &&
    !!o.input &&
    typeof (o.input as TeacherInput).studentName === "string" &&
    !!o.output &&
    !!(o.output as LessonOutput).reasoning &&
    !!(o.output as LessonOutput).sections
  );
}
