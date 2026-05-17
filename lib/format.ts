export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateLong(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function relativeDay(iso: string): string {
  const today = todayISO();
  if (iso === today) return "Today";
  if (iso === daysAgoISO(1)) return "Yesterday";
  return formatDateShort(iso);
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dayLabel(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return WEEKDAY_LABELS[d.getDay()];
}

export function isWeekday(iso: string): boolean {
  const d = new Date(`${iso}T12:00:00`).getDay();
  return d >= 1 && d <= 5;
}

export function currentWeekDates(reference?: string): string[] {
  const today = reference ? new Date(`${reference}T12:00:00`) : new Date();
  const day = today.getDay(); // 0=Sun..6=Sat
  // Weekends show the next planning week; weekdays show the current week.
  const daysSinceMon = day === 0 ? 1 : day === 6 ? 2 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysSinceMon);
  return [0, 1, 2, 3, 4].map((offset) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return toLocalISO(d);
  });
}

export function prevSchoolDay(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  do {
    d.setDate(d.getDate() - 1);
  } while (d.getDay() === 0 || d.getDay() === 6);
  return toLocalISO(d);
}

export function nextSchoolDay(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  do {
    d.setDate(d.getDate() + 1);
  } while (d.getDay() === 0 || d.getDay() === 6);
  return toLocalISO(d);
}

export function compareISO(a: string, b: string): -1 | 0 | 1 {
  return a < b ? -1 : a > b ? 1 : 0;
}
