import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ExamInstructionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const exam = await prisma.exam.findUnique({ where: { id }, include: { questions: { select: { id: true } } } });
  if (!exam) return <Card>Exam not found.</Card>;
  const existing = user ? await prisma.result.findFirst({ where: { userId: user.id, examId: id }, select: { id: true } }) : null;
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card>
        <h1 className="text-3xl font-black">{exam.title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-300">{exam.duration} minutes · {exam.questions.length} questions · {exam.subjects.join(", ")}</p>
        {existing ? (
          <>
            <p className="mt-6 rounded-lg bg-emerald-500/10 p-4 text-sm font-medium text-emerald-700 dark:text-emerald-200">You have already submitted this exam. Retakes are locked for completed exams.</p>
            <Link className="mt-6 inline-flex" href={`/results/${existing.id}`}><Button variant="secondary">View result</Button></Link>
          </>
        ) : (
          <>
            <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-200">
              <p>Use fullscreen mode during the exam. Leaving fullscreen, switching tabs, copying, pasting, or right-clicking records a warning.</p>
              <p>Your answers autosave locally. If your internet drops after the exam loads, submit anyway and the platform will sync when online.</p>
              <p>Numeric answers are accepted within a 2% tolerance of the correct value.</p>
            </div>
            <Link className="mt-6 inline-flex" href={`/exams/${exam.id}/take`}><Button>Start exam</Button></Link>
          </>
        )}
      </Card>
    </div>
  );
}
