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
      <section className="paper-card rounded-lg p-6 pl-10">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xs font-black uppercase text-[#6f6a5f]">
              Student profile
            </h2>
            <p className="mt-2 text-xl font-black text-[#233044]">
              {profile.name}
            </p>
            <p className="text-sm text-[#6f6a5f]">
              Grade {profile.grade} · Lessons at{" "}
              {formatTimePretty(profile.scheduledTime)}
            </p>
          </div>
          <button
            type="button"
            onClick={startEdit}
            className="pencil-button rounded-md px-3 py-1.5 text-xs font-semibold"
          >
            Edit profile
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-xs font-black uppercase text-[#6f6a5f]">
              Interests
            </dt>
            <dd className="mt-1 text-[#233044]">{profile.interests || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase text-[#6f6a5f]">
              Important context
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-[#233044]">
              {profile.context || "—"}
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section className="paper-card rounded-lg p-6 pl-10">
      <h2 className="mb-4 text-xs font-black uppercase text-[#6f6a5f]">
        Edit profile
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name">
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="field-paper w-full rounded-md px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Grade">
          <input
            type="text"
            value={draft.grade}
            onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
            className="field-paper w-full rounded-md px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Lesson time (24h, e.g. 09:30)">
          <input
            type="text"
            value={draft.scheduledTime}
            onChange={(e) =>
              setDraft({ ...draft, scheduledTime: e.target.value })
            }
            className="field-paper w-full rounded-md px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Interests">
          <input
            type="text"
            value={draft.interests}
            onChange={(e) =>
              setDraft({ ...draft, interests: e.target.value })
            }
            className="field-paper w-full rounded-md px-3 py-2 text-sm"
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
              className="field-paper w-full rounded-md px-3 py-2 text-sm"
            />
          </Field>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={save}
          className="ink-button rounded-md px-4 py-2 text-sm font-semibold"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={cancel}
          className="pencil-button rounded-md px-4 py-2 text-sm font-semibold"
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
      <label className="mb-1 block text-xs font-black uppercase text-[#6f6a5f]">
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
