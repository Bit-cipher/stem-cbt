import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { OfflineSync } from "@/components/layout/offline-sync";
import { getCurrentUser } from "@/lib/auth";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/admin/dashboard");
  return (
    <>
      <AppShell
        user={user}
        nav={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/leaderboard", label: "Leaderboard" },
        ]}
      >
        {children}
      </AppShell>
      <OfflineSync />
    </>
  );
}
