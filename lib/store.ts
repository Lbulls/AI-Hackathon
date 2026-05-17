"use client";

import { useCallback, useEffect, useState } from "react";
import { SEED_STUDENTS } from "./seed-students";
import type { LessonOutput, Session, SessionNotes, Student, StudentProfile } from "./types";
import { newId } from "./format";

const STORAGE_KEY = "teacher-copilot-state-v1";

function normalizeStudents(students: Student[]): Student[] {
  return students.map((student) => ({
    ...student,
    sessions: student.sessions.map((session) => ({
      ...session,
      approved: session.approved ?? false,
    })),
  }));
}

function loadFromStorage(): Student[] {
  if (typeof window === "undefined") return normalizeStudents(SEED_STUDENTS);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeStudents(SEED_STUDENTS);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return normalizeStudents(parsed as Student[]);
    return normalizeStudents(SEED_STUDENTS);
  } catch {
    return normalizeStudents(SEED_STUDENTS);
  }
}

function saveToStorage(students: Student[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch {
    // ignore quota / private-mode errors
  }
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>(normalizeStudents(SEED_STUDENTS));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount to avoid SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudents(loadFromStorage());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Student[]) => {
    setStudents(next);
    saveToStorage(next);
  }, []);

  const getStudent = useCallback(
    (id: string) => students.find((s) => s.id === id),
    [students]
  );

  const updateProfile = useCallback(
    (id: string, patch: Partial<Omit<StudentProfile, "id">>) => {
      const next = students.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      );
      persist(next);
    },
    [students, persist]
  );

  const addSession = useCallback(
    (
      studentId: string,
      args: { date: string; notes: SessionNotes; lesson?: LessonOutput }
    ): Session => {
      const session: Session = {
        id: newId(),
        date: args.date,
        notes: args.notes,
        lesson: args.lesson,
        approved: false,
      };
      const next = students.map((s) =>
        s.id === studentId
          ? { ...s, sessions: [...s.sessions, session] }
          : s
      );
      persist(next);
      return session;
    },
    [students, persist]
  );

  const updateSession = useCallback(
    (
      studentId: string,
      sessionId: string,
      patch: Partial<Pick<Session, "notes" | "lesson" | "date" | "approved">>
    ) => {
      const next = students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              sessions: s.sessions.map((sn) =>
                sn.id === sessionId ? { ...sn, ...patch } : sn
              ),
            }
          : s
      );
      persist(next);
    },
    [students, persist]
  );

  const resetToSeed = useCallback(() => {
    persist(normalizeStudents(SEED_STUDENTS));
  }, [persist]);

  return {
    students,
    hydrated,
    getStudent,
    updateProfile,
    addSession,
    updateSession,
    resetToSeed,
  };
}

export function sortSessionsDesc(sessions: Session[]): Session[] {
  return [...sessions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function scheduleSortedStudents(students: Student[]): Student[] {
  return [...students].sort((a, b) =>
    a.scheduledTime.localeCompare(b.scheduledTime)
  );
}

export function formatTime(time: string): string {
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return time;
  const period = hh >= 12 ? "PM" : "AM";
  const display = hh % 12 || 12;
  return `${display}:${mm.toString().padStart(2, "0")} ${period}`;
}
