import type { LessonOutput } from "@/lib/types";
import { HighlightedStory } from "./HighlightedStory";

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-zinc-200 bg-white p-5 shadow-sm ${className}`}
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h2>
      <div className="text-sm text-zinc-800">{children}</div>
    </section>
  );
}

export function LessonCards({ output }: { output: LessonOutput }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card title="Student Need">
        <p className="leading-6">{output.needSummary}</p>
      </Card>

      <Card title="Recommended Teaching Move">
        <p className="leading-6">{output.teachingMove}</p>
      </Card>

      <Card title="Mini-Story" className="md:col-span-2">
        <HighlightedStory
          story={output.miniStory}
          targetWords={output.targetWords}
        />
      </Card>

      <Card title="Target Words">
        <ul className="flex flex-wrap gap-2">
          {output.targetWords.map((w) => (
            <li
              key={w}
              className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-zinc-800"
            >
              {w}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Teacher Review Note">
        <p className="whitespace-pre-wrap leading-6">{output.reviewNote}</p>
      </Card>

      {output.productiveStrugglePlan && (
        <Card title="Next Lesson Productive Struggle Plan" className="md:col-span-2">
          <p className="whitespace-pre-wrap leading-6">
            {output.productiveStrugglePlan}
          </p>
        </Card>
      )}

      {output.bookRecommendations && output.bookRecommendations.length > 0 && (
        <Card title="Top Library Matches" className="md:col-span-2">
          <ol className="space-y-4">
            {output.bookRecommendations.map((book) => (
              <li key={book.bookId}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">{book.title}</p>
                    <p className="text-xs text-zinc-500">by {book.author}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {book.matchPercent}% match
                  </span>
                </div>
                <p className="mt-2 leading-6">{book.suggestion}</p>
                <p className="mt-1 text-xs leading-5 text-emerald-900">
                  {book.productiveStruggleNote}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
