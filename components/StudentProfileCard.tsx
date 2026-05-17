"use client";

import { useState } from "react";
import type { StudentProfile } from "@/lib/types";

type EditableProfile = Omit<StudentProfile, "id">;

export function StudentProfileCard({
  profile,
  onSave,
}: {
  profile: StudentProfile;
  onSave: (patch: Partial<EditableProfile>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditableProfile>(profile);

  function startEdit() {
    setDraft(profile);
    setIsEditing(true);
  }

  function save() {
    onSave(draft);
    setIsEditing(false);
  }

  function cancel() {
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Student profile
            </h2>
            <p className="mt-2 text-xl font-semibold text-zinc-900">
              {profile.name}
            </p>
            <p className="text-sm text-zinc-600">
              Grade {profile.grade} · Lessons at{" "}
              {formatTimePretty(profile.scheduledTime)}
            </p>
          </div>
          <button
            type="button"
            onClick={startEdit}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Edit profile
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Interests
            </dt>
            <dd className="mt-1 text-zinc-800">{profile.interests || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Important context
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-zinc-800">
              {profile.context || "—"}
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Edit profile
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name">
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Grade">
          <input
            type="text"
            value={draft.grade}
            onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Lesson time (24h, e.g. 09:30)">
          <input
            type="text"
            value={draft.scheduledTime}
            onChange={(e) =>
              setDraft({ ...draft, scheduledTime: e.target.value })
            }
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Interests">
          <input
            type="text"
            value={draft.interests}
            onChange={(e) =>
              setDraft({ ...draft, interests: e.target.value })
            }
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Important context (medical, language, schedule notes, anything affecting performance)">
            <textarea
              value={draft.context}
              onChange={(e) =>
                setDraft({ ...draft, context: e.target.value })
              }
              rows={3}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </Field>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={save}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={cancel}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function formatTimePretty(time: string): string {
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return time;
  const period = hh >= 12 ? "PM" : "AM";
  const display = hh % 12 || 12;
  return `${display}:${mm.toString().padStart(2, "0")} ${period}`;
}
