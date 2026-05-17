import Link from "next/link";

export function AppHeader({ crumbs }: { crumbs?: { label: string; href?: string }[] }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          Teacher Copilot
        </Link>
        {crumbs && crumbs.length > 0 && (
          <nav className="text-sm text-zinc-600">
            <Link href="/" className="hover:text-zinc-900">
              Home
            </Link>
            {crumbs.map((c, i) => (
              <span key={i}>
                <span className="mx-2 text-zinc-300">/</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-zinc-900">
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
