"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { EditableLessonMaterials } from "@/components/EditableLessonMaterials";
import { SessionForm, type SessionFormPayload } from "@/components/SessionForm";
import { sortSessionsDesc, useStudents } from "@/lib/store";
import { formatDateLong, todayISO } from "@/lib/format";
import type {
  GenerateResponse,
  LessonOutput,
  PriorSession,
  SessionNotes,
} from "@/lib/types";

export default function NewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getStudent, addSession, hydrated } = useStudents();
  const student = getStudent(id);

  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [editableLesson, setEditableLesson] = useState<LessonOutput | null>(null);
  const [lastPayload, setLastPayload] = useState<SessionFormPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const priorSessions: PriorSession[] = sortSessionsDesc(student.sessions)
    .slice(0, 3)
    .map((s) => ({
      date: s.date,
      targetPattern: s.notes.targetPattern,
      needSummary: s.lesson?.needSummary || s.notes.notes,
    }));

  async function callGenerate(payload: SessionFormPayload) {
    if (!student) return;
    setIsLoading(true);
    setError(null);
    setLastPayload(payload);

    const form = new FormData();
    form.set("studentName", student.name);
    form.set("grade", student.grade);
    form.set("interests", student.interests);
    form.set("strengths", payload.notes.strengths);
    form.set("struggles", payload.notes.struggles);
    form.set("targetPattern", payload.notes.targetPattern);
    form.set(
      "notes",
      `${payload.notes.notes}\n\nStudent context: ${student.context}`.trim()
    );
    form.set("priorSessions", JSON.stringify(priorSessions));
    if (payload.attachment) form.set("attachment", payload.attachment);

    try {
      const res = await fetch("/api/generate", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as GenerateResponse;
      setResult(data);
      setEditableLesson(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult(null);
      setEditableLesson(null);
    } finally {
      setIsLoading(false);
    }
  }

  const sessionDate = todayISO();

  function saveDraft(payload: SessionFormPayload) {
    if (!student) return;
    addSession(student.id, {
      date: sessionDate,
      notes: payload.notes,
    });
    router.push(`/students/${student.id}`);
  }

  function saveWithLesson() {
    if (!student || !lastPayload || !editableLesson) return;
    addSession(student.id, {
      date: sessionDate,
      notes: lastPayload.notes,
      lesson: editableLesson,
    });
    router.push(`/students/${student.id}`);
  }

  function notesForForm(): Partial<SessionNotes> | undefined {
    return lastPayload?.notes;
  }

  return (
    <>
      <AppHeader
        crumbs={[
          { label: student.name, href: `/students/${student.id}` },
          { label: "New session" },
        ]}
      />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            New session — {student.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Session date: {formatDateLong(sessionDate)} ·{" "}
            Grade {student.grade} · interests: {student.interests} ·{" "}
            {student.sessions.length} prior session
            {student.sessions.length === 1 ? "" : "s"} on record
          </p>
        </div>

        <SessionForm
          initial={notesForForm()}
          initialAttachmentName={lastPayload?.attachment?.name}
          hasGeneratedLesson={!!result}
          onSaveDraft={saveDraft}
          onGenerate={callGenerate}
          isLoading={isLoading}
        />

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Something went wrong: {error}
          </div>
        )}

        {result?.usedFallback && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Showing sample output — live generation unavailable. Check the
            <code className="mx-1 rounded bg-amber-100 px-1 font-mono text-xs">
              ANTHROPIC_API_KEY
            </code>
            env var.
          </div>
        )}

        {result && editableLesson && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Editable drafted lesson materials
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Edit any generated field below before saving. These edits are
                  what get stored in the running record.
                </p>
              </div>
              <button
                type="button"
                onClick={saveWithLesson}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Save to running record
              </button>
            </div>
            <EditableLessonMaterials
              value={editableLesson}
              onChange={setEditableLesson}
            />
          </section>
        )}
      </main>
    </>
  );
}
