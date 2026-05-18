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
    <div className="paper-card overflow-x-auto rounded-lg pl-5">
      <table className="w-full min-w-[980px] text-sm">
        <thead>
          <tr className="border-b border-[#d8c8a4] bg-[#fff8dc]/80">
            <th className="w-40 px-3 py-2 text-left text-xs font-black uppercase text-[#6f6a5f]">
              Daily block
            </th>
            {week.map((d) => {
              const isTodayCol = d === today;
              return (
                <th
                  key={d}
                  className={`min-w-40 px-3 py-2 text-left text-xs font-semibold uppercase ${
                    isTodayCol
                      ? "bg-[#edf7ef] text-[#315c4a]"
                      : "text-[#6f6a5f]"
                  }`}
                >
                  {dayLabel(d)}{" "}
                  <span className="font-normal text-[#6f6a5f]">
                    {formatDateShort(d)}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b border-[#eadfbd] last:border-b-0">
              <td className="px-3 py-3 align-top">
                <Link
                  href={`/students/${s.id}`}
                  className="block rounded-md px-2 py-1 hover:bg-[#fff8dc]"
                >
                  <div className="text-sm font-bold text-[#233044]">
                    {s.name}
                  </div>
                  <div className="text-xs text-[#6f6a5f]">
                    {formatTime(s.scheduledTime)}
                  </div>
                </Link>
              </td>
              {week.map((d) => (
                <td
                  key={d}
                  className={`px-3 py-3 align-top ${
                    d === today ? "bg-[#edf7ef]/60" : ""
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
    return <span className="text-xs text-[#c8b990]">No lesson block</span>;
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
        <div className="font-medium text-[#233044]">
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
          <div className="text-[#6f6a5f]">Session scheduled</div>
          <Link
            href={`/students/${student.id}/sessions/new`}
            className="pencil-button inline-block rounded-md px-2 py-1 font-medium"
          >
            Open record
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-1.5 text-xs">
        <div className="font-medium text-[#315c4a]">Notes logged</div>
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
            className="font-medium text-[#9a5d15] underline-offset-2 hover:underline"
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
            ? "font-semibold text-[#233044]"
            : "font-medium text-[#6f6a5f]"
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
          className="font-medium text-[#9a5d15] underline-offset-2 hover:underline"
        >
          Needs generated plan
        </Link>
      ) : (
        <div className="text-[#9c9075]">
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
        className="mt-0.5 h-3.5 w-3.5 cursor-pointer rounded border-[#9c9075] text-[#5f8f79] focus:ring-[#5f8f79]"
      />
      <span className={approved ? "text-[#315c4a]" : "font-medium text-[#9a5d15]"}>
        {approved ? "Signed off" : label}
      </span>
    </label>
  );
}
