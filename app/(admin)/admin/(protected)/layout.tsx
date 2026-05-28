import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { OfflineSync } from "@/components/layout/offline-sync";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");
  return (
    <>
      <AppShell
        user={user}
        nav={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/exams/create", label: "Create exam" },
          { href: "/admin/upload", label: "Upload" },
          { href: "/admin/exams/manage", label: "Manage exams" },
          { href: "/admin/results", label: "Results" },
        ]}
      >
        {children}
      </AppShell>
      <OfflineSync />
    </>
  );
}
