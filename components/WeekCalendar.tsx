"use client";

import Link from "next/link";
import {
  compareISO,
  dayLabel,
  formatDateShort,
  isWeekday,
  nextSchoolDay,
  prevSchoolDay,
} from "@/lib/format";
import { formatTime } from "@/lib/store";
import type { Session, Student } from "@/lib/types";

export function WeekCalendar({
  students,
  week,
  today,
  onToggleApprove,
}: {
  students: Student[];
  week: string[];
  today: string;
  onToggleApprove: (
    studentId: string,
    sessionId: string,
    approved: boolean
  ) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
      <table className="w-full min-w-[980px] text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            <th className="w-40 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Daily block
            </th>
            {week.map((d) => {
              const isTodayCol = d === today;
              return (
                <th
                  key={d}
                  className={`min-w-40 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide ${
                    isTodayCol
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-zinc-500"
                  }`}
                >
                  {dayLabel(d)}{" "}
                  <span className="font-normal text-zinc-500">
                    {formatDateShort(d)}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b border-zinc-100 last:border-b-0">
              <td className="px-3 py-3 align-top">
                <Link
                  href={`/students/${s.id}`}
                  className="block rounded-md px-2 py-1 hover:bg-zinc-50"
                >
                  <div className="text-sm font-medium text-zinc-900">
                    {s.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {formatTime(s.scheduledTime)}
                  </div>
                </Link>
              </td>
              {week.map((d) => (
                <td
                  key={d}
                  className={`px-3 py-3 align-top ${
                    d === today ? "bg-emerald-50/40" : ""
                  }`}
                >
                  <DayCell
                    student={s}
                    date={d}
                    today={today}
                    onToggleApprove={onToggleApprove}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DayCell({
  student,
  date,
  today,
  onToggleApprove,
}: {
  student: Student;
  date: string;
  today: string;
  onToggleApprove: (
    studentId: string,
    sessionId: string,
    approved: boolean
  ) => void;
}) {
  if (!isWeekday(date)) {
    return <span className="text-xs text-zinc-300">No lesson block</span>;
  }

  const currentSession = student.sessions.find((session) => session.date === date);
  const priorPrepDate = prevSchoolDay(date);
  const priorPrepSession = student.sessions.find(
    (session) => session.date === priorPrepDate
  );
  const isPast = compareISO(date, today) < 0;
  const isToday = date === today;
  const nextSessionDate = nextSchoolDay(today);

  if (isPast) {
    return (
      <div className="space-y-1 text-xs">
        <div className="font-medium text-zinc-700">
          {currentSession ? "Record logged" : "No record"}
        </div>
        {currentSession?.lesson && (
          <PlanApproval
            studentId={student.id}
            session={currentSession}
            label="Following plan"
            onToggleApprove={onToggleApprove}
          />
        )}
      </div>
    );
  }

  if (isToday) {
    if (!currentSession) {
      return (
        <div className="space-y-2 text-xs">
          <div className="text-zinc-600">Session scheduled</div>
          <Link
            href={`/students/${student.id}/sessions/new`}
            className="inline-block rounded-md border border-zinc-300 bg-white px-2 py-1 font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Open record
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-1.5 text-xs">
        <div className="font-medium text-emerald-700">Notes logged</div>
        {currentSession.lesson ? (
          <PlanApproval
            studentId={student.id}
            session={currentSession}
            label={`Plan for ${dayLabel(nextSchoolDay(date))}`}
            onToggleApprove={onToggleApprove}
          />
        ) : (
          <Link
            href={`/students/${student.id}`}
            className="font-medium text-amber-700 underline-offset-2 hover:underline"
          >
            Generate next plan
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5 text-xs">
      <div
        className={
          date === nextSessionDate
            ? "font-semibold text-zinc-900"
            : "font-medium text-zinc-700"
        }
      >
        {date === nextSessionDate ? "Following session" : "Scheduled"}
      </div>
      {priorPrepSession?.lesson ? (
        <PlanApproval
          studentId={student.id}
          session={priorPrepSession}
          label={`Prepared from ${dayLabel(priorPrepDate)}`}
          onToggleApprove={onToggleApprove}
        />
      ) : priorPrepSession ? (
        <Link
          href={`/students/${student.id}`}
          className="font-medium text-amber-700 underline-offset-2 hover:underline"
        >
          Needs generated plan
        </Link>
      ) : (
        <div className="text-zinc-400">
          Prep after {dayLabel(priorPrepDate)}
        </div>
      )}
    </div>
  );
}

function PlanApproval({
  studentId,
  session,
  label,
  onToggleApprove,
}: {
  studentId: string;
  session: Session;
  label: string;
  onToggleApprove: (
    studentId: string,
    sessionId: string,
    approved: boolean
  ) => void;
}) {
  const approved = !!session.approved;

  return (
    <label className="flex cursor-pointer items-start gap-1.5">
      <input
        type="checkbox"
        checked={approved}
        onChange={(e) =>
          onToggleApprove(studentId, session.id, e.target.checked)
        }
        className="mt-0.5 h-3.5 w-3.5 cursor-pointer rounded border-zinc-400 text-emerald-600 focus:ring-emerald-500"
      />
      <span className={approved ? "text-emerald-700" : "font-medium text-amber-700"}>
        {approved ? "Signed off" : label}
      </span>
    </label>
  );
}
