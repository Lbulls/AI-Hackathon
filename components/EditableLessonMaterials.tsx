"use client";

import { useMemo } from "react";
import type { LessonOutput } from "@/lib/types";
import { HighlightedStory } from "./HighlightedStory";

function Field({
  id,
  label,
  value,
  onChange,
  rows = 3,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm leading-6 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
      />
    </div>
  );
}

export function EditableLessonMaterials({
  value,
  onChange,
}: {
  value: LessonOutput;
  onChange: (next: LessonOutput) => void;
}) {
  const targetWordsText = value.targetWords.join(", ");
  const previewWords = useMemo(
    () => targetWordsText.split(",").map((word) => word.trim()).filter(Boolean),
    [targetWordsText]
  );

  function patch<K extends keyof LessonOutput>(key: K, next: LessonOutput[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          id="needSummary"
          label="Student need summary"
          value={value.needSummary}
          onChange={(next) => patch("needSummary", next)}
        />
        <Field
          id="teachingMove"
          label="Recommended teaching move"
          value={value.teachingMove}
          onChange={(next) => patch("teachingMove", next)}
        />
      </div>

      <Field
        id="miniStory"
        label="Custom mini-story"
        value={value.miniStory}
        rows={6}
        onChange={(next) => patch("miniStory", next)}
      />

      <div>
        <label
          htmlFor="targetWords"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Target words
        </label>
        <input
          id="targetWords"
          type="text"
          value={targetWordsText}
          onChange={(e) =>
            patch(
              "targetWords",
              e.target.value
                .split(",")
                .map((word) => word.trim())
                .filter(Boolean)
            )
          }
          placeholder="sit, big, hid, pin"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Separate words with commas. These words are highlighted in the story
          preview.
        </p>
      </div>

      <Field
        id="reviewNote"
        label="Teacher review note"
        value={value.reviewNote}
        rows={4}
        onChange={(next) => patch("reviewNote", next)}
      />

      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-yellow-800">
          Highlight preview
        </div>
        <HighlightedStory story={value.miniStory} targetWords={previewWords} />
      </div>
    </div>
  );
}
