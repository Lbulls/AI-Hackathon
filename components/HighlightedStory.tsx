import { Fragment } from "react";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function HighlightedStory({
  story,
  targetWords,
}: {
  story: string;
  targetWords: string[];
}) {
  const cleaned = targetWords.map((w) => w.trim()).filter(Boolean);
  if (cleaned.length === 0) {
    return <p className="whitespace-pre-wrap leading-7 text-zinc-800">{story}</p>;
  }

  const pattern = new RegExp(
    `\\b(${cleaned.map(escapeRegex).join("|")})\\b`,
    "gi"
  );

  const parts = story.split(pattern);

  return (
    <p className="whitespace-pre-wrap leading-7 text-zinc-800">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="rounded bg-yellow-200 px-0.5 font-medium text-zinc-900"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </p>
  );
}
