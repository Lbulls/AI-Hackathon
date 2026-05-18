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
      <p className="paper-card rounded-lg p-6 text-center text-sm text-[#6f6a5f]">
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
            className="paper-card rounded-lg p-5 pl-9"
          >
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-bold text-[#233044]">
                  {relativeDay(s.date)}
                </h3>
                {isDraft && (
                  <span className="notebook-tab rounded px-2 py-0.5 text-[10px] font-bold uppercase text-[#6f6a5f]">
                    Draft — no lesson generated
                  </span>
                )}
              </div>
              <span className="text-xs text-[#6f6a5f]">
                {formatDateLong(s.date)}
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div>
                <dt className="text-xs font-black uppercase text-[#6f6a5f]">
                  Skills targeted
                </dt>
                <dd className="mt-1 text-[#233044]">
                  {s.notes.targetPattern || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase text-[#6f6a5f]">
                  Teacher notes
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-[#233044]">
                  {s.notes.notes || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase text-[#6f6a5f]">
                  Strengths
                </dt>
                <dd className="mt-1 text-[#233044]">
                  {s.notes.strengths || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase text-[#6f6a5f]">
                  Struggles
                </dt>
                <dd className="mt-1 text-[#233044]">
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
                  className="ink-button rounded-md px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
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
    <details className="mt-4 rounded-md border border-[#d8c8a4] bg-[#fff8dc]/70 p-3">
      <summary className="cursor-pointer text-xs font-black uppercase text-[#6f6a5f]">
        Drafted lesson materials
      </summary>

      {!isEditing && (
        <div className="mt-3 space-y-3 text-sm text-[#233044]">
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
            <p className="whitespace-pre-wrap text-[#233044]">
              <span className="font-semibold">Review note: </span>
              {lesson.reviewNote}
            </p>
          )}
          {lesson.productiveStrugglePlan && (
            <div className="rounded-md border border-[#7aa8c8]/30 bg-[#eef7fb] p-3">
              <p className="mb-1 text-xs font-black uppercase text-[#315b74]">
                Next lesson productive struggle plan
              </p>
              <p className="whitespace-pre-wrap text-sm text-[#233044]">
                {lesson.productiveStrugglePlan}
              </p>
            </div>
          )}
          {lesson.bookRecommendations &&
            lesson.bookRecommendations.length > 0 && (
              <div className="rounded-md border border-[#5f8f79]/30 bg-[#edf7ef] p-3">
                <p className="mb-2 text-xs font-black uppercase text-[#315c4a]">
                  Library matches
                </p>
                <ol className="space-y-2">
                  {lesson.bookRecommendations.map((book) => (
                    <li key={book.bookId}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-semibold">
                          {book.title}
                        </span>
                        <span className="text-xs font-semibold text-[#315c4a]">
                          {book.matchPercent}% match
                        </span>
                      </div>
                      <p className="text-xs text-[#6f6a5f]">by {book.author}</p>
                      <p className="mt-1 text-sm">{book.suggestion}</p>
                      <p className="mt-1 text-xs text-[#315c4a]">
                        {book.productiveStruggleNote}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          {onUpdateLesson && (
            <button
              type="button"
              onClick={() => {
                setDraft(lesson);
                setIsEditing(true);
              }}
              className="pencil-button rounded-md px-3 py-1.5 text-xs font-semibold"
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
              className="ink-button rounded-md px-3 py-1.5 text-xs font-semibold"
            >
              Save lesson updates
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(lesson);
                setIsEditing(false);
              }}
              className="pencil-button rounded-md px-3 py-1.5 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </details>
  );
}
