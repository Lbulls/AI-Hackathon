import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sylla",
  description:
    "A thinking partner for early-literacy lesson planning. Inspired by Reading Recovery.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${fraunces.variable}`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-sans">
        {children}
        <footer className="mt-auto border-t border-zinc-200 bg-zinc-50/80 py-4 px-6 text-center text-xs italic text-zinc-500">
          Sylla drafts materials for expert teacher review — never replacement.
        </footer>
      </body>
    </html>
  );
}
