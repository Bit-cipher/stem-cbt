import { prisma } from "@/lib/db";
import { fail, ok, readJson, requireUser } from "@/lib/api";
import { gradeAnswers } from "@/utils/grading";
import type { AnswerMap } from "@/types";

type Body = { examId?: string; answers?: AnswerMap; timeSpent?: number };

export async function GET() {
  const { user, error } = await requireUser();
  if (error) return error;
  const where = user!.role === "ADMIN" ? {} : { userId: user!.id };
  const results = await prisma.result.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { exam: { select: { title: true } }, user: { select: { name: true, school: true } } },
  });
  return ok({ results });
}

export async function POST(request: Request) {
  const { user, error } = await requireUser("STUDENT");
  if (error) return error;
  const body = await readJson<Body>(request);
  if (!body?.examId || !body.answers) return fail("examId and answers are required");

  const existing = await prisma.result.findFirst({
    where: { userId: user!.id, examId: body.examId },
    select: { id: true },
  });
  if (existing) return fail(`You have already submitted this exam.`, 409);

  const questions = await prisma.question.findMany({ where: { examId: body.examId } });
  if (!questions.length) return fail("No questions found for exam", 404);

  const grade = gradeAnswers(questions, body.answers);
  try {
    const result = await prisma.result.create({
      data: {
        userId: user!.id,
        examId: body.examId,
        score: grade.score,
        percentage: grade.percentage,
        timeSpent: Number(body.timeSpent || 0),
        subjectBreakdown: grade.subjectBreakdown,
      },
    });
    return ok({ result: { ...result, ...grade } }, { status: 201 });
  } catch (err) {
    if (typeof err === "object" && err && "code" in err && err.code === "P2002") {
      return fail("You have already submitted this exam.", 409);
    }
    throw err;
  }
}
