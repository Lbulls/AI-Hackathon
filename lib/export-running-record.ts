"use client";

import { formatDateLong } from "./format";
import type { Session, Student } from "./types";

type PdfLine = {
  text: string;
  size?: number;
  bold?: boolean;
  gapBefore?: number;
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 54;
const MARGIN_TOP = 54;
const LINE_HEIGHT = 14;

function ascii(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/→/g, "->")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E\n]/g, " ");
}

function escapePdfText(text: string): string {
  return ascii(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text: string, maxChars: number): string[] {
  const paragraphs = ascii(text || "-").split(/\n+/);
  return paragraphs.flatMap((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [""];

    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
    return lines;
  });
}

function pushWrapped(
  lines: PdfLine[],
  label: string,
  value: string,
  maxChars = 92
) {
  wrapText(`${label}: ${value || "-"}`, maxChars).forEach((line, index) =>
    lines.push({ text: line, size: 10, bold: index === 0 && label.length > 0 })
  );
}

function runningRecordLines(student: Student, sessions: Session[]): PdfLine[] {
  const lines: PdfLine[] = [
    { text: `${student.name} - Running Record`, size: 18, bold: true },
    { text: `Exported ${new Date().toLocaleString()}`, size: 9 },
    { text: "", size: 10 },
    { text: "Student Profile", size: 13, bold: true },
  ];

  pushWrapped(lines, "Grade", student.grade);
  pushWrapped(lines, "Daily session time", student.scheduledTime);
  pushWrapped(lines, "Interests", student.interests);
  pushWrapped(lines, "Important context", student.context);
  lines.push({ text: "", size: 10 });
  lines.push({ text: "Sessions", size: 13, bold: true });

  sessions.forEach((session, index) => {
    lines.push({
      text: `${index + 1}. ${formatDateLong(session.date)}`,
      size: 12,
      bold: true,
      gapBefore: index === 0 ? 6 : 14,
    });
    pushWrapped(lines, "Skills targeted", session.notes.targetPattern);
    pushWrapped(lines, "Teacher notes", session.notes.notes);
    pushWrapped(lines, "Strengths", session.notes.strengths);
    pushWrapped(lines, "Struggles", session.notes.struggles);
    pushWrapped(lines, "Plan sign-off", session.approved ? "Signed off" : "Not signed off");

    if (session.lesson) {
      lines.push({ text: "Drafted Lesson Materials", size: 11, bold: true, gapBefore: 8 });
      pushWrapped(lines, "Student need", session.lesson.needSummary);
      pushWrapped(lines, "Teaching move", session.lesson.teachingMove);
      pushWrapped(lines, "Mini-story", session.lesson.miniStory);
      pushWrapped(lines, "Target words", session.lesson.targetWords.join(", "));
      pushWrapped(lines, "Teacher review note", session.lesson.reviewNote);
    } else {
      lines.push({ text: "Drafted Lesson Materials: Not generated", size: 10, bold: true });
    }
  });

  return lines;
}

function paginate(lines: PdfLine[]): PdfLine[][] {
  const pages: PdfLine[][] = [[]];
  let y = MARGIN_TOP;

  lines.forEach((line) => {
    const gap = line.gapBefore ?? 0;
    if (y + gap + LINE_HEIGHT > PAGE_HEIGHT - MARGIN_TOP) {
      pages.push([]);
      y = MARGIN_TOP;
    }
    pages[pages.length - 1].push(line);
    y += gap + LINE_HEIGHT;
  });

  return pages;
}

function buildPdf(lines: PdfLine[]): string {
  const pages = paginate(lines);
  const objects: string[] = [];
  const pageObjectIds: number[] = [];

  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("PAGES_PLACEHOLDER");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  pages.forEach((pageLines, pageIndex) => {
    const contentId = objects.length + 2;
    const pageId = objects.length + 1;
    pageObjectIds.push(pageId);

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`
    );

    let y = PAGE_HEIGHT - MARGIN_TOP;
    const commands = pageLines
      .map((line) => {
        y -= line.gapBefore ?? 0;
        const font = line.bold ? "F2" : "F1";
        const size = line.size ?? 10;
        const command = `BT /${font} ${size} Tf ${MARGIN_X} ${y} Td (${escapePdfText(
          line.text
        )}) Tj ET`;
        y -= LINE_HEIGHT;
        return command;
      })
      .join("\n");

    objects.push(`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`);

    if (pageIndex < pages.length - 1) {
      // keep object numbering stable by adding nothing here
    }
  });

  const kids = pageObjectIds.map((id) => `${id} 0 R`).join(" ");
  objects[1] = `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

export function exportRunningRecordPdf(student: Student, sessions: Session[]) {
  const lines = runningRecordLines(student, sessions);
  const pdf = buildPdf(lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${student.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-running-record.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
