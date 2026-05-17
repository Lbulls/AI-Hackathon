"use client";

import { useEffect, useMemo, useState } from "react";
import { TeacherForm } from "@/components/TeacherForm";
import { LessonCards } from "@/components/LessonCards";
import { PastLessons } from "@/components/PastLessons";
import { parsePartial } from "@/lib/parse";
import {
  getLessonsForStudent,
  saveLesson,
  toPriorLessonContext,
  type StoredLesson,
} from "@/lib/lesson-history";
import type {
  GenerateRequest,
  LessonOutput,
  PartialLessonOutput,
  StreamEvent,
  TeacherInput,
} from "@/lib/types";

const EMPTY_INPUT: TeacherInput = {
  studentName: "",
  grade: "",
  strengths: "",
  struggles: "",
  targetPattern: "",
  interests: "",
  notes: "",
};

const EMPTY_PARTIAL: PartialLessonOutput = { reasoning: null, sections: {} };

export default function Home() {
  const [values, setValues] = useState<TeacherInput>(EMPTY_INPUT);
  const [isStreaming, setIsStreaming] = useState(false);
  const [accumulatedText, setAccumulatedText] = useState("");
  const [finalOutput, setFinalOutput] = useState<LessonOutput | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pastLessons, setPastLessons] = useState<StoredLesson[]>([]);

  function refreshPastLessons(name: string) {
    setPastLessons(getLessonsForStudent(name));
  }

  useEffect(() => {
    refreshPastLessons(values.studentName);
  }, [values.studentName]);

  const partialOutput: PartialLessonOutput = useMemo(() => {
    if (finalOutput) return finalOutput;
    if (!accumulatedText) return EMPTY_PARTIAL;
    return parsePartial(accumulatedText);
  }, [accumulatedText, finalOutput]);

  async function handleGenerate() {
    setIsStreaming(true);
    setError(null);
    setAccumulatedText("");
    setFinalOutput(null);
    setUsedFallback(false);

    const request: GenerateRequest = {
      ...values,
      priorLesson:
        pastLessons.length > 0
          ? toPriorLessonContext(pastLessons[0])
          : undefined,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!res.ok || !res.body) {
        throw new Error(`Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedFinal = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          let event: StreamEvent;
          try {
            event = JSON.parse(trimmed);
          } catch {
            console.error("[stream] bad NDJSON line", trimmed);
            continue;
          }
          if (event.t === "text") {
            setAccumulatedText((prev) => prev + event.v);
          } else if (event.t === "final") {
            receivedFinal = true;
            setFinalOutput(event.output);
            setUsedFallback(event.usedFallback);
            if (!event.usedFallback) {
              saveLesson(values, event.output);
              refreshPastLessons(values.studentName);
            }
          } else if (event.t === "error") {
            setError(event.message);
          }
        }
      }

      if (!receivedFinal) {
        throw new Error("stream ended without a final event");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsStreaming(false);
    }
  }

  function handleLoadPastLesson(lesson: StoredLesson) {
    setValues(lesson.input);
    setFinalOutput(lesson.output);
    setUsedFallback(false);
    setAccumulatedText("");
    setError(null);
  }

  const showOutput = !!finalOutput || !!accumulatedText;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Teacher Copilot
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Paste student notes and draft a focused early-literacy mini-lesson.
          Inspired by Reading Recovery practices.
        </p>
      </header>

      <TeacherForm
        values={values}
        onChange={setValues}
        onSubmit={handleGenerate}
        isLoading={isStreaming}
      />

      {pastLessons.length > 0 && (
        <div className="mt-4">
          <PastLessons
            lessons={pastLessons}
            onDelete={() => refreshPastLessons(values.studentName)}
            onLoad={handleLoadPastLesson}
          />
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Something went wrong: {error}
        </div>
      )}

      {usedFallback && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Showing sample output — live generation unavailable. Add an
          <code className="mx-1 rounded bg-amber-100 px-1 font-mono text-xs">
            ANTHROPIC_API_KEY
          </code>
          to{" "}
          <code className="rounded bg-amber-100 px-1 font-mono text-xs">
            .env.local
          </code>{" "}
          and restart the dev server.
        </div>
      )}

      {showOutput && (
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Draft lesson materials
          </h2>
          <LessonCards
            output={partialOutput}
            isStreaming={isStreaming && !finalOutput}
          />
        </section>
      )}
    </main>
  );
}
