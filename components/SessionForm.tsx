"use client";

import { useRef, useState } from "react";
import { ACCEPT_ATTR, ACCEPTED_FILE_TYPES, MAX_FILE_BYTES } from "@/lib/types";
import type { SessionNotes } from "@/lib/types";

export type SessionFormPayload = {
  notes: SessionNotes;
  attachment: File | null;
};

const EMPTY: SessionNotes = {
  strengths: "",
  struggles: "",
  targetPattern: "",
  notes: "",
};

export function SessionForm({
  initial,
  initialAttachmentName,
  hasGeneratedLesson,
  onSaveDraft,
  onGenerate,
  isLoading,
}: {
  initial?: Partial<SessionNotes>;
  initialAttachmentName?: string;
  hasGeneratedLesson: boolean;
  onSaveDraft: (payload: SessionFormPayload) => void;
  onGenerate: (payload: SessionFormPayload) => void;
  isLoading: boolean;
}) {
  const [values, setValues] = useState<SessionNotes>({ ...EMPTY, ...initial });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof SessionNotes>(key: K, value: SessionNotes[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleFile(file: File | null) {
    setFileError(null);
    if (!file) {
      setAttachment(null);
      return;
    }
    if (
      !ACCEPTED_FILE_TYPES.includes(
        file.type as (typeof ACCEPTED_FILE_TYPES)[number]
      ) &&
      !/\.(jpe?g|png|pdf|docx)$/i.test(file.name)
    ) {
      setFileError(`Unsupported file type. Use JPEG, PNG, PDF, or .docx.`);
      setAttachment(null);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError(
        `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max is ${MAX_FILE_BYTES / 1024 / 1024} MB.`
      );
      setAttachment(null);
      return;
    }
    setAttachment(file);
  }

  function clearFile() {
    setAttachment(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function buildPayload(): SessionFormPayload {
    return { notes: values, attachment };
  }

  function validateForSubmit(requireGeneration: boolean): boolean {
    setValidationError(null);
    const hasNotesText = values.notes.trim().length > 0;
    const hasFile = attachment !== null;
    if (!hasNotesText && !hasFile) {
      setValidationError(
        "Teacher notes are required — type your notes or upload a file."
      );
      return false;
    }
    if (requireGeneration && !values.targetPattern.trim() && !hasFile) {
      // soft check — still allow, just remind
    }
    return true;
  }

  function handleSaveDraft() {
    if (!validateForSubmit(false)) return;
    onSaveDraft(buildPayload());
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForSubmit(true)) return;
    onGenerate(buildPayload());
  }

  return (
    <form
      onSubmit={handleGenerate}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="targetPattern"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Skills being Targeted
        </label>
        <input
          id="targetPattern"
          type="text"
          value={values.targetPattern}
          onChange={(e) => update("targetPattern", e.target.value)}
          placeholder="e.g. Short-i CVC words"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Teacher Notes <span className="text-red-600">*</span>
        </label>
        <textarea
          id="notes"
          value={values.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Enter your detailed notes from today's session — observations, prompts you used, what worked, what didn't, running record level, accuracy, anything you'd want a colleague to know."
          rows={7}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm leading-6"
        />

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
          <label
            htmlFor="attachment"
            className="cursor-pointer rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Upload notes file
          </label>
          <input
            id="attachment"
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ATTR}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
          <span>Accepts JPEG, PNG, PDF, or .docx (max 8 MB).</span>
        </div>

        {attachment && (
          <div className="mt-2 flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
            <span>
              <span className="font-semibold">{attachment.name}</span>{" "}
              <span className="text-emerald-700">
                ({(attachment.size / 1024).toFixed(0)} KB)
              </span>
            </span>
            <button
              type="button"
              onClick={clearFile}
              className="text-emerald-800 underline-offset-2 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {!attachment && initialAttachmentName && (
          <div className="mt-2 text-xs text-zinc-500">
            Previously attached: {initialAttachmentName} (re-upload to include)
          </div>
        )}

        {fileError && (
          <div className="mt-2 text-xs text-red-700">{fileError}</div>
        )}
      </div>

      <div>
        <label
          htmlFor="strengths"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Strengths observed today
        </label>
        <input
          id="strengths"
          type="text"
          value={values.strengths}
          onChange={(e) => update("strengths", e.target.value)}
          placeholder="One quick line — what went well?"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="struggles"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Struggles observed today
        </label>
        <input
          id="struggles"
          type="text"
          value={values.struggles}
          onChange={(e) => update("struggles", e.target.value)}
          placeholder="One quick line — where did the student get stuck?"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      {validationError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {validationError}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? "Drafting materials…"
            : hasGeneratedLesson
              ? "Regenerate lesson"
              : "Generate lesson"}
        </button>
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isLoading}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Save without generating
        </button>
        <span className="text-xs text-zinc-500">
          Drafts can be opened and generated from later.
        </span>
      </div>
    </form>
  );
}
