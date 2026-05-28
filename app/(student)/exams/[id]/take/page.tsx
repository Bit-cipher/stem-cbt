import { redirect } from "next/navigation";
import { ExamClient } from "@/components/exam/exam-client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { ExamWithQuestions } from "@/types";
import { shuffleArray } from "@/utils/questions";

export default async function TakeExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (user) {
    const existing = await prisma.result.findFirst({ where: { userId: user.id, examId: id }, select: { id: true } });
    if (existing) redirect(`/results/${existing.id}`);
  }
  const exam = await prisma.exam.findUnique({ where: { id }, include: { questions: true } });
  if (!exam) return <p>Exam not found.</p>;
  const payload: ExamWithQuestions = {
    id: exam.id,
    title: exam.title,
    duration: exam.duration,
    subjects: exam.subjects,
    createdAt: exam.createdAt.toISOString(),
    questions: shuffleArray(exam.questions).map((q) => ({
      id: q.id,
      examId: q.examId,
      subject: q.subject,
      type: q.type,
      question: q.question,
      options: q.type === "MCQ" ? shuffleArray(q.options) : q.options,
      marks: q.marks,
    })),
  };
  return <ExamClient exam={payload} />;
}
