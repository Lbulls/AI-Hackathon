import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teacher Copilot",
  description:
    "Draft early-literacy lesson materials from teacher notes. Inspired by Reading Recovery.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        {children}
        <footer className="mt-auto border-t border-zinc-200 bg-white py-3 px-6 text-center text-xs text-zinc-500">
          Draft materials for expert teacher review, not replacement.
        </footer>
      </body>
    </html>
  );
}
