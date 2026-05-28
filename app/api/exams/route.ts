import { prisma } from "@/lib/db";
import { fail, ok, readJson, requireUser } from "@/lib/api";

type ExamBody = { title?: string; duration?: number; subjects?: string[] };

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: { questions: { select: { id: true } }, results: { select: { id: true, userId: true } } },
  });
  return ok({
    exams: exams.map((exam) => {
      const completedResult = user!.role === "STUDENT" ? exam.results.find((result) => result.userId === user!.id) : null;
      return {
        id: exam.id,
        title: exam.title,
        duration: exam.duration,
        subjects: exam.subjects,
        createdAt: exam.createdAt,
        questionCount: exam.questions.length,
        resultCount: exam.results.length,
        completedResultId: completedResult?.id ?? null,
      };
    }),
  });
}

export async function POST(request: Request) {
  const { error } = await requireUser("ADMIN");
  if (error) return error;
  const body = await readJson<ExamBody>(request);
  if (!body?.title || !body.duration || !body.subjects?.length) return fail("Title, duration, and subjects are required");
  const exam = await prisma.exam.create({
    data: { title: body.title, duration: Number(body.duration), subjects: body.subjects },
  });
  return ok({ exam }, { status: 201 });
}
