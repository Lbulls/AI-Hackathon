"use client";

import { useState } from "react";
import { TeacherForm } from "@/components/TeacherForm";
import { LessonCards } from "@/components/LessonCards";
import type { GenerateResponse, TeacherInput } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(input: TeacherInput) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      const data = (await res.json()) as GenerateResponse;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

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

      <TeacherForm onSubmit={handleGenerate} isLoading={isLoading} />

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Something went wrong: {error}
        </div>
      )}

      {result?.usedFallback && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Showing sample output — live generation unavailable. Add an
          <code className="mx-1 rounded bg-amber-100 px-1 font-mono text-xs">
            ANTHROPIC_API_KEY
          </code>
          to <code className="rounded bg-amber-100 px-1 font-mono text-xs">.env.local</code> and restart the dev server.
        </div>
      )}

      {result && (
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Draft lesson materials
          </h2>
          <LessonCards output={result.output} />
        </section>
      )}
    </main>
  );
}
