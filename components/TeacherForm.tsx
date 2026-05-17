"use client";

import { sampleStudent } from "@/lib/sample-student";
import type { TeacherInput } from "@/lib/types";

type FieldDef = {
  key: keyof TeacherInput;
  label: string;
  placeholder: string;
  long?: boolean;
};

const FIELDS: FieldDef[] = [
  { key: "studentName", label: "Student name", placeholder: "e.g. Maya" },
  { key: "grade", label: "Grade", placeholder: "e.g. 1st" },
  {
    key: "targetPattern",
    label: "Target sound or pattern",
    placeholder: "e.g. Short-i CVC words",
  },
  {
    key: "interests",
    label: "Student interests",
    placeholder: "e.g. cats, soccer",
  },
  {
    key: "strengths",
    label: "Reading strengths",
    placeholder: "What is this student already doing well?",
    long: true,
  },
  {
    key: "struggles",
    label: "Reading struggles",
    placeholder: "Where does this student get stuck?",
    long: true,
  },
  {
    key: "notes",
    label: "Teacher notes",
    placeholder: "Running record level, recent observations, anything else.",
    long: true,
  },
];

export function TeacherForm({
  values,
  onChange,
  onSubmit,
  isLoading,
}: {
  values: TeacherInput;
  onChange: (values: TeacherInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  function update<K extends keyof TeacherInput>(
    key: K,
    value: TeacherInput[K],
  ) {
    onChange({ ...values, [key]: value });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.long ? "md:col-span-2" : ""}>
            <label
              htmlFor={f.key}
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
            >
              {f.label}
            </label>
            {f.long ? (
              <textarea
                id={f.key}
                value={values[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            ) : (
              <input
                id={f.key}
                type="text"
                value={values[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onChange(sampleStudent)}
          disabled={isLoading}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Load sample student
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Drafting materials…" : "Generate lesson materials"}
        </button>
      </div>
    </form>
  );
}
