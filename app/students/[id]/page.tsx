"use client";

import Link from "next/link";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { SessionTimeline } from "@/components/SessionTimeline";
import { StudentProfileCard } from "@/components/StudentProfileCard";
import { exportRunningRecordPdf } from "@/lib/export-running-record";
import { sortSessionsDesc, useStudents } from "@/lib/store";
import type { GenerateResponse, PriorSession } from "@/lib/types";

export default function StudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getStudent, updateProfile, updateSession, hydrated } = useStudents();
  const student = getStudent(id);

  const [generatingSessionId, setGeneratingSessionId] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  if (hydrated && !student) notFound();

  if (!hydrated || !student) {
    return (
      <>
        <AppHeader crumbs={[{ label: "…" }]} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
          <p className="text-sm text-zinc-500">Loading…</p>
        </main>
      </>
    );
  }

  const sessions = sortSessionsDesc(student.sessions);

  async function handleGenerateForSession(sessionId: string) {
    if (!student) return;
    const target = student.sessions.find((s) => s.id === sessionId);
    if (!target) return;
    setGeneratingSessionId(sessionId);
    setGenerateError(null);

    const priorSessions: PriorSession[] = sortSessionsDesc(
      student.sessions.filter((s) => s.id !== sessionId)
    )
      .slice(0, 3)
      .map((s) => ({
        date: s.date,
        targetPattern: s.notes.targetPattern,
        needSummary: s.lesson?.needSummary || s.notes.notes,
      }));

    const form = new FormData();
    form.set("studentName", student.name);
    form.set("grade", student.grade);
    form.set("interests", student.interests);
    form.set("strengths", target.notes.strengths);
    form.set("struggles", target.notes.struggles);
    form.set("targetPattern", target.notes.targetPattern);
    form.set(
      "notes",
      `${target.notes.notes}\n\nStudent context: ${student.context}`.trim()
    );
    form.set("priorSessions", JSON.stringify(priorSessions));

    try {
      const res = await fetch("/api/generate", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as GenerateResponse;
      updateSession(student.id, sessionId, {
        lesson: data.output,
        approved: false,
      });
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGeneratingSessionId(null);
    }
  }

  return (
    <>
      <AppHeader crumbs={[{ label: student.name }]} />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-6 py-8">
        <StudentProfileCard
          profile={{
            id: student.id,
            name: student.name,
            grade: student.grade,
            interests: student.interests,
            context: student.context,
            scheduledTime: student.scheduledTime,
          }}
          onSave={(patch) => updateProfile(student.id, patch)}
        />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Running record
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {sessions.length} session{sessions.length === 1 ? "" : "s"} on record,
                most recent first.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => exportRunningRecordPdf(student, sessions)}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Export Running Record
              </button>
              <Link
                href={`/students/${student.id}/sessions/new`}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                + Add today&apos;s session
              </Link>
            </div>
          </div>

          {generateError && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
              {generateError}
            </div>
          )}

          <SessionTimeline
            sessions={sessions}
            onGenerateForSession={handleGenerateForSession}
            onUpdateLesson={(sessionId, lesson) =>
              updateSession(student.id, sessionId, { lesson, approved: false })
            }
            generatingSessionId={generatingSessionId}
          />
        </section>
      </main>
    </>
  );
}
