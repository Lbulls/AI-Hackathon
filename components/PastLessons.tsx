"use client";

import { deleteLesson, type StoredLesson } from "@/lib/lesson-history";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PastLessons({
  lessons,
  onDelete,
  onLoad,
}: {
  lessons: StoredLesson[];
  onDelete: () => void;
  onLoad: (lesson: StoredLesson) => void;
}) {
  if (lessons.length === 0) return null;

  const mostRecent = lessons[0];
  const firstGoal =
    mostRecent.output.reasoning?.instructional_goals[0]?.goal ??
    mostRecent.output.needSummary;

  return (
    <section className="rounded-lg border border-sage-200 bg-sage-50 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-sage-900">
          Past lessons for {mostRecent.input.studentName} ({lessons.length})
        </h2>
        <span className="text-xs text-sage-700">
          Most recent will be sent as context →
        </span>
      </div>

      <div className="mt-3 text-sm text-sage-900">
        <div className="font-medium">
          {formatDate(mostRecent.timestamp)} — focus:{" "}
          <code className="rounded bg-sage-100 px-1 py-0.5 font-mono text-xs">
            {firstGoal}
          </code>
        </div>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-sage-800 hover:text-sage-950">
          Show all {lessons.length}
        </summary>
        <ul className="mt-2 space-y-1.5">
          {lessons.map((l) => (
            <li
              key={l.id}
              className="flex items-center justify-between gap-2 text-xs text-sage-900"
            >
              <button
                type="button"
                onClick={() => onLoad(l)}
                className="flex-1 text-left underline-offset-2 hover:underline"
              >
                {formatDate(l.timestamp)} —{" "}
                {l.output.reasoning?.instructional_goals[0]?.goal ??
                  l.output.needSummary}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteLesson(l.id);
                  onDelete();
                }}
                className="rounded px-1.5 py-0.5 text-sage-700 hover:bg-sage-100 hover:text-sage-950"
                aria-label={`Delete lesson from ${formatDate(l.timestamp)}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
