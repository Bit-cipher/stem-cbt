import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { SessionUser } from "@/lib/auth";

export function AppShell({ user, nav, children }: { user: SessionUser; nav: Array<{ href: string; label: string }>; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} className="font-bold text-slate-950 dark:text-white">
            STEM CBT
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-950/5 dark:text-slate-200 dark:hover:bg-white/10">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-right text-xs text-slate-500 dark:text-slate-300 sm:block">
              {user.name}
              <br />
              {user.school || user.role}
            </span>
            <ThemeToggle />
            <form action="/api/auth/logout" method="post">
              <Button aria-label="Logout" size="icon" variant="ghost">
                <LogOut size={18} />
              </Button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 md:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-lg bg-slate-950/5 px-3 py-2 text-sm font-medium dark:bg-white/10">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
