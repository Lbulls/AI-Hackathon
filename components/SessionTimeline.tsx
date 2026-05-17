"use client";

import { useState } from "react";
import { EditableLessonMaterials } from "./EditableLessonMaterials";
import { HighlightedStory } from "./HighlightedStory";
import { formatDateLong, relativeDay } from "@/lib/format";
import type { LessonOutput, Session } from "@/lib/types";

export function SessionTimeline({
  sessions,
  onGenerateForSession,
  onUpdateLesson,
  generatingSessionId,
}: {
  sessions: Session[];
  onGenerateForSession?: (sessionId: string) => void;
  onUpdateLesson?: (sessionId: string, lesson: LessonOutput) => void;
  generatingSessionId?: string | null;
}) {
  if (sessions.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500">
        No sessions on record yet. Add today&apos;s session to get started.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {sessions.map((s) => {
        const isDraft = !s.lesson;
        const isGenerating = generatingSessionId === s.id;
        return (
          <li
            key={s.id}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-semibold text-zinc-900">
                  {relativeDay(s.date)}
                </h3>
                {isDraft && (
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                    Draft — no lesson generated
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-500">
                {formatDateLong(s.date)}
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Skills targeted
                </dt>
                <dd className="mt-1 text-zinc-800">
                  {s.notes.targetPattern || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Teacher notes
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-zinc-800">
                  {s.notes.notes || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Strengths
                </dt>
                <dd className="mt-1 text-zinc-800">
                  {s.notes.strengths || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Struggles
                </dt>
                <dd className="mt-1 text-zinc-800">
                  {s.notes.struggles || "—"}
                </dd>
              </div>
            </dl>

            {isDraft && onGenerateForSession && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onGenerateForSession(s.id)}
                  disabled={isGenerating}
                  className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? "Drafting materials…" : "Generate lesson now"}
                </button>
              </div>
            )}

            {s.lesson && (
              <LessonDetails
                sessionId={s.id}
                lesson={s.lesson}
                onUpdateLesson={onUpdateLesson}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function LessonDetails({
  sessionId,
  lesson,
  onUpdateLesson,
}: {
  sessionId: string;
  lesson: LessonOutput;
  onUpdateLesson?: (sessionId: string, lesson: LessonOutput) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<LessonOutput>(lesson);

  function saveEdits() {
    onUpdateLesson?.(sessionId, draft);
    setIsEditing(false);
  }

  return (
    <details className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Drafted lesson materials
      </summary>

      {!isEditing && (
        <div className="mt-3 space-y-3 text-sm text-zinc-800">
          <p>
            <span className="font-semibold">Need: </span>
            {lesson.needSummary}
          </p>
          <p>
            <span className="font-semibold">Teaching move: </span>
            {lesson.teachingMove}
          </p>
          <div>
            <p className="font-semibold">Mini-story:</p>
            <HighlightedStory
              story={lesson.miniStory}
              targetWords={lesson.targetWords}
            />
          </div>
          <p>
            <span className="font-semibold">Target words: </span>
            {lesson.targetWords.join(", ")}
          </p>
          {lesson.reviewNote && (
            <p className="whitespace-pre-wrap text-zinc-700">
              <span className="font-semibold">Review note: </span>
              {lesson.reviewNote}
            </p>
          )}
          {onUpdateLesson && (
            <button
              type="button"
              onClick={() => {
                setDraft(lesson);
                setIsEditing(true);
              }}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Edit drafted lesson
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-3 space-y-3">
          <EditableLessonMaterials value={draft} onChange={setDraft} />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={saveEdits}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Save lesson updates
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(lesson);
                setIsEditing(false);
              }}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </details>
  );
}
