"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatTime } from "@/lib/store";
import {
  dayLabel,
  formatDateShort,
  isWeekday,
  nextSchoolDay,
} from "@/lib/format";
import type { Student } from "@/lib/types";

function nextSessionLabel(
  student: Student,
  today: string
): { date: string; label: string } {
  if (!isWeekday(today)) {
    const d = nextSchoolDay(today);
    return { date: d, label: `${dayLabel(d)} ${formatDateShort(d)}` };
  }
  const hasToday = student.sessions.some((s) => s.date === today);
  if (hasToday) {
    const d = nextSchoolDay(today);
    return { date: d, label: `${dayLabel(d)} ${formatDateShort(d)}` };
  }
  return { date: today, label: "Today" };
}

export function StudentSidebar({
  students,
  today,
}: {
  students: Student[];
  today: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.grade.toLowerCase().includes(q) ||
        s.interests.toLowerCase().includes(q)
    );
  }, [query, students]);

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Students
          </h2>
          <span className="text-xs text-zinc-500">{students.length}</span>
        </div>
        <input
          type="search"
          placeholder="Search by name, grade, interest…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
        />

        <ul className="mt-3 max-h-[60vh] space-y-0.5 overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-2 py-2 text-xs text-zinc-500">No matches</li>
          )}
          {filtered.map((s) => {
            const next = nextSessionLabel(s, today);
            return (
              <li key={s.id}>
                <Link
                  href={`/students/${s.id}`}
                  className="block rounded-md px-2 py-2 hover:bg-zinc-50"
                >
                  <div className="text-sm font-medium text-zinc-900">
                    {s.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Gr {s.grade} · next: {next.label} · {formatTime(s.scheduledTime)}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
