import { prisma } from "@/lib/db";
import { fail, ok, readJson, requireUser } from "@/lib/api";
import { shuffleArray } from "@/utils/questions";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  const exam = await prisma.exam.findUnique({
    where: { id },
    include: { questions: true },
  });
  if (!exam) return fail("Exam not found", 404);
  const questions = shuffleArray(exam.questions).map((question) => ({
    id: question.id,
    examId: question.examId,
    subject: question.subject,
    type: question.type,
    question: question.question,
    options: question.type === "MCQ" ? shuffleArray(question.options) : question.options,
    marks: question.marks,
  }));
  return ok({ exam: { id: exam.id, title: exam.title, duration: exam.duration, subjects: exam.subjects, createdAt: exam.createdAt, questions } });
}

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireUser("ADMIN");
  if (error) return error;
  const { id } = await params;
  const body = await readJson<{ title?: string; duration?: number; subjects?: string[] }>(request);
  const exam = await prisma.exam.update({
    where: { id },
    data: { title: body?.title, duration: body?.duration, subjects: body?.subjects },
  });
  return ok({ exam });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireUser("ADMIN");
  if (error) return error;
  const { id } = await params;
  await prisma.exam.delete({ where: { id } });
  return ok({ success: true });
}
