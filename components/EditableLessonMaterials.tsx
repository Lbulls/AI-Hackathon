"use client";

import { useMemo } from "react";
import type { BookRecommendation, LessonOutput } from "@/lib/types";
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
        className="mb-1 block text-xs font-black uppercase text-[#6f6a5f]"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="field-paper w-full rounded-md px-3 py-2 text-sm leading-6 outline-none focus:border-[#7aa8c8] focus:ring-1 focus:ring-[#7aa8c8]"
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

  function patchBook(
    index: number,
    changes: Partial<Pick<BookRecommendation, "suggestion" | "productiveStruggleNote">>
  ) {
    const next = [...(value.bookRecommendations ?? [])];
    next[index] = { ...next[index], ...changes };
    patch("bookRecommendations", next);
  }

  return (
    <div className="paper-card space-y-4 rounded-lg p-6 pl-10">
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
          className="mb-1 block text-xs font-black uppercase text-[#6f6a5f]"
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
          className="field-paper w-full rounded-md px-3 py-2 text-sm outline-none focus:border-[#7aa8c8] focus:ring-1 focus:ring-[#7aa8c8]"
        />
        <p className="mt-1 text-xs text-[#6f6a5f]">
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

      <Field
        id="productiveStrugglePlan"
        label="Next lesson productive struggle plan"
        value={value.productiveStrugglePlan ?? ""}
        rows={5}
        onChange={(next) => patch("productiveStrugglePlan", next)}
      />

      <div className="rounded-md border border-[#d89b35]/30 bg-[#fff4cf] p-3">
        <div className="mb-2 text-xs font-black uppercase text-[#7b531c]">
          Highlight preview
        </div>
        <HighlightedStory story={value.miniStory} targetWords={previewWords} />
      </div>

      {value.bookRecommendations && value.bookRecommendations.length > 0 && (
        <div className="space-y-3 rounded-lg border border-[#5f8f79]/30 bg-[#edf7ef] p-4">
          <div>
            <h3 className="text-xs font-black uppercase text-[#315c4a]">
              Library book matches
            </h3>
            <p className="mt-1 text-xs text-[#315c4a]">
              These recommendations are scored against the student&apos;s skills,
              target words, notes, and interests. Edit the teacher-facing
              guidance before saving if needed.
            </p>
          </div>

          {value.bookRecommendations.map((book, index) => (
            <section
              key={book.bookId}
              className="rounded-md border border-[#5f8f79]/25 bg-[#fffdf6] p-4"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#233044]">
                    {index + 1}. {book.title}
                  </h4>
                  <p className="text-xs text-[#6f6a5f]">by {book.author}</p>
                </div>
                <div className="rounded-full bg-[#dff0e4] px-3 py-1 text-xs font-bold text-[#315c4a]">
                  {book.matchPercent}% match
                </div>
              </div>

              <div className="mb-3 grid grid-cols-1 gap-2 text-xs md:grid-cols-3">
                <TagList label="Skills" values={book.matchedSkills} />
                <TagList label="Vocabulary" values={book.matchedVocabulary} />
                <TagList label="Themes" values={book.matchedThemes} />
              </div>

              <Field
                id={`book-suggestion-${book.bookId}`}
                label="How to use this book"
                value={book.suggestion}
                rows={3}
                onChange={(next) => patchBook(index, { suggestion: next })}
              />
              <div className="mt-3">
                <Field
                  id={`book-struggle-${book.bookId}`}
                  label="Productive struggle guidance"
                  value={book.productiveStruggleNote}
                  rows={3}
                  onChange={(next) =>
                    patchBook(index, { productiveStruggleNote: next })
                  }
                />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function TagList({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <div className="mb-1 font-black uppercase text-[#6f6a5f]">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {values.length > 0 ? (
          values.map((value) => (
            <span
              key={value}
              className="rounded bg-[#fff4cf] px-2 py-0.5 text-[#624114]"
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-[#9c9075]">No direct tag match</span>
        )}
      </div>
    </div>
  );
}
