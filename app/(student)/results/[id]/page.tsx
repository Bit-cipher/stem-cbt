import Link from "next/link";
import { Card, StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const result = await prisma.result.findUnique({ where: { id }, include: { exam: true, user: true } });
  if (!result || (user?.role !== "ADMIN" && result.userId !== user?.id)) return <Card>Result not found.</Card>;
  const breakdown = result.subjectBreakdown as Record<string, { score: number; total: number }>;
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-3xl font-black">Result: {result.exam.title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-300">{result.user.name} · {result.user.school}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Score" value={String(result.score)} />
        <StatCard label="Percentage" value={`${result.percentage}%`} />
        <StatCard label="Time spent" value={`${Math.round(result.timeSpent / 60)} min`} />
      </div>
      <Card>
        <h2 className="mb-4 text-xl font-bold">Subject breakdown</h2>
        <div className="space-y-3">
          {Object.entries(breakdown).map(([subject, value]) => (
            <div key={subject} className="flex items-center justify-between rounded-lg bg-slate-950/5 p-3 dark:bg-white/10">
              <span className="font-semibold">{subject}</span>
              <span>{value.score} / {value.total}</span>
            </div>
          ))}
        </div>
      </Card>
      <Link href="/dashboard"><Button variant="secondary">Back to dashboard</Button></Link>
    </div>
  );
}
