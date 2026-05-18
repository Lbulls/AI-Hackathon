"use client";

import { AppHeader } from "@/components/AppHeader";
import { StudentSidebar } from "@/components/StudentSidebar";
import { WeekCalendar } from "@/components/WeekCalendar";
import { useStudents } from "@/lib/store";
import {
  currentWeekDates,
  dayLabel,
  formatDateLong,
  formatDateShort,
  nextSchoolDay,
  prevSchoolDay,
  todayISO,
} from "@/lib/format";

export default function Home() {
  const { students, hydrated, updateSession, resetToSeed } = useStudents();
  const today = todayISO();
  const week = currentWeekDates(today);

  const nextDay = nextSchoolDay(today);
  const prepSourceDate = prevSchoolDay(nextDay);
  const nextPrepItems = students
    .map((student) => {
      const sourceSession = student.sessions.find(
        (session) => session.date === prepSourceDate
      );
      if (!sourceSession) return null;
      if (sourceSession.lesson && sourceSession.approved) return null;
      return {
        student,
        session: sourceSession,
        status: sourceSession.lesson ? "Needs sign-off" : "Needs generated plan",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const allUnapprovedPlans = students.flatMap((student) =>
    student.sessions
      .filter((session) => session.lesson && !session.approved)
      .map((session) => ({ student, session }))
  );

  return (
    <>
      <AppHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-6 py-6">
        {hydrated ? (
          <StudentSidebar students={students} today={today} />
        ) : (
          <aside className="w-64 shrink-0" />
        )}

        <main className="flex-1 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#233044]">
                Planning week
              </h1>
              <p className="mt-1 text-sm text-[#6f6a5f]">
                {formatDateLong(today)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "Reset all students to the seeded demo state? This wipes any sessions you've added."
                  )
                ) {
                  resetToSeed();
                }
              }}
              className="notebook-tab rounded-full px-3 py-1.5 text-xs font-semibold text-[#6f6a5f] hover:text-[#233044]"
            >
              Reset demo data
            </button>
          </div>

          {nextPrepItems.length > 0 && (
            <div className="rounded-lg border border-[#d89b35]/35 bg-[#fff4cf] px-4 py-3 text-sm text-[#624114] shadow-sm">
              <div className="font-semibold">
                {nextPrepItems.length} lesson plan
                {nextPrepItems.length === 1 ? "" : "s"} need attention before{" "}
                {dayLabel(nextDay)}, {formatDateShort(nextDay)}
              </div>
              <ul className="mt-1 list-inside list-disc text-xs text-[#7b531c]">
                {nextPrepItems.slice(0, 4).map((p) => (
                  <li key={p.session.id}>
                    {p.student.name}: {p.status.toLowerCase()} for{" "}
                    {p.session.notes.targetPattern || "no target listed"}
                  </li>
                ))}
                {nextPrepItems.length > 4 && (
                  <li>and {nextPrepItems.length - 4} more.</li>
                )}
              </ul>
            </div>
          )}

          {nextPrepItems.length === 0 && allUnapprovedPlans.length > 0 && (
            <div className="paper-card rounded-lg px-6 py-4 text-sm text-[#233044]">
              <span className="font-medium">{allUnapprovedPlans.length}</span>{" "}
              lesson plan
              {allUnapprovedPlans.length === 1 ? "" : "s"} awaiting sign-off.
              Check the boxes in the calendar once reviewed.
            </div>
          )}

          {nextPrepItems.length === 0 && allUnapprovedPlans.length === 0 && (
            <div className="rounded-lg border border-[#5f8f79]/35 bg-[#edf7ef] px-4 py-3 text-sm text-[#315c4a] shadow-sm">
              Plans tied to existing running records are signed off. The next
              scheduled session is {dayLabel(nextDay)}, {formatDateShort(nextDay)}.
            </div>
          )}

          {hydrated ? (
            <WeekCalendar
              students={students}
              week={week}
              today={today}
              onToggleApprove={(studentId, sessionId, approved) =>
                updateSession(studentId, sessionId, { approved })
              }
            />
          ) : (
            <div className="paper-card rounded-lg p-6 text-sm text-[#6f6a5f]">
              Loading...
            </div>
          )}
        </main>
      </div>
    </>
  );
}
