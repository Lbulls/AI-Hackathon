import { SECTION_HEADERS } from "@/lib/prompt";
import type {
  InstructionalGoal,
  LessonConstraints,
  Observation,
  PartialLessonOutput,
  ReadingProcess,
  Reasoning,
} from "@/lib/types";

function ReasoningPanel({ reasoning }: { reasoning: Reasoning }) {
  return (
    <details className="group rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-zinc-600 hover:text-zinc-900">
        Show reasoning ({reasoning.observations.length} observations ·{" "}
        {reasoning.reading_processes.length} processes ·{" "}
        {reasoning.instructional_goals.length} goals)
      </summary>
      <div className="mt-4 space-y-4">
        <ReasoningSection title="Observations">
          <ul className="space-y-1.5">
            {reasoning.observations.map((o: Observation, i) => (
              <li key={i} className="text-sm text-zinc-800">
                <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs">
                  {o.behavior}
                </code>
                <span className="ml-2 text-zinc-600">— {o.evidence}</span>
              </li>
            ))}
          </ul>
        </ReasoningSection>

        <ReasoningSection title="Inferred Reading Processes">
          <ul className="space-y-2">
            {reasoning.reading_processes.map((p: ReadingProcess, i) => (
              <li key={i} className="text-sm">
                <div className="flex items-center gap-2">
                  <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs">
                    {p.process}
                  </code>
                  <ConfidenceBar value={p.confidence} />
                  <span className="text-xs text-zinc-500">
                    {(p.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-600">{p.reasoning}</p>
              </li>
            ))}
          </ul>
        </ReasoningSection>

        <ReasoningSection title="Selected Instructional Goals">
          <ul className="space-y-2">
            {reasoning.instructional_goals.map((g: InstructionalGoal, i) => (
              <li key={i} className="text-sm">
                <code className="rounded bg-emerald-100 px-1 py-0.5 font-mono text-xs text-emerald-900">
                  {g.goal}
                </code>
                <p className="mt-1 text-xs text-zinc-600">{g.why}</p>
              </li>
            ))}
          </ul>
        </ReasoningSection>

        <ReasoningSection title="Lesson Constraints">
          <ConstraintsList constraints={reasoning.lesson_constraints} />
        </ReasoningSection>
      </div>
    </details>
  );
}

function ReasoningSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-200">
      <div
        className="h-full bg-zinc-700"
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}

function ConstraintsList({ constraints }: { constraints: LessonConstraints }) {
  const entries: Array<[string, string | string[]]> = [
    ["Target phonics patterns", constraints.target_phonics_patterns],
    ["Sentence complexity", constraints.sentence_complexity],
    ["Vocabulary control", constraints.vocabulary_control],
    ["Picture predictability", constraints.picture_predictability],
    ["Recommended prompting style", constraints.recommended_prompting_style],
    ["Targeted reading behaviors", constraints.targeted_reading_behaviors],
    ["Engagement hooks", constraints.engagement_hooks],
  ];

  return (
    <dl className="space-y-1.5 text-sm">
      {entries.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="min-w-[14rem] text-xs font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </dt>
          <dd className="text-zinc-800">
            {Array.isArray(value) ? value.join(" · ") : value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ReasoningPending() {
  return (
    <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-500">
      Working through observations and processes…
    </div>
  );
}

function StreamingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-200 bg-white p-3 text-xs text-zinc-500">
      <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
      Generating next section…
    </div>
  );
}

export function LessonCards({
  output,
  isStreaming = false,
}: {
  output: PartialLessonOutput;
  isStreaming?: boolean;
}) {
  const sectionsRendered = SECTION_HEADERS.filter((h) => output.sections[h]);

  return (
    <div className="space-y-4">
      {output.reasoning ? (
        <ReasoningPanel reasoning={output.reasoning} />
      ) : isStreaming ? (
        <ReasoningPending />
      ) : null}

      {sectionsRendered.map((header) => {
        const body = output.sections[header]!;
        return (
          <section
            key={header}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {header}
            </h2>
            <div className="whitespace-pre-wrap text-sm leading-6 text-zinc-800">
              {body}
            </div>
          </section>
        );
      })}

      {isStreaming && <StreamingIndicator />}
    </div>
  );
}
