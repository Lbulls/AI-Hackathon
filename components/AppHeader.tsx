import Link from "next/link";

export function AppHeader({
  crumbs,
}: {
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <header className="border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-display text-2xl font-medium tracking-tight text-zinc-900 transition-colors group-hover:text-clay-700">
            Sylla
          </span>
          <span className="hidden text-xs italic text-zinc-500 sm:inline">
            for early-literacy teachers
          </span>
        </Link>
        {crumbs && crumbs.length > 0 && (
          <nav className="text-sm text-zinc-600">
            <Link
              href="/"
              className="transition-colors hover:text-clay-700"
            >
              Home
            </Link>
            {crumbs.map((c, i) => (
              <span key={i}>
                <span className="mx-2 text-zinc-300">/</span>
                {c.href ? (
                  <Link
                    href={c.href}
                    className="transition-colors hover:text-clay-700"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-zinc-900">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
