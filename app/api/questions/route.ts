import { prisma } from "@/lib/db";
import { fail, ok, readJson, requireUser } from "@/lib/api";
import { validateQuestion, type QuestionInput } from "@/utils/questions";

type Body = { examId?: string; questions?: QuestionInput[] };

export async function POST(request: Request) {
  const { error } = await requireUser("ADMIN");
  if (error) return error;
  const body = await readJson<Body>(request);
  if (!body?.examId || !body.questions?.length) return fail("examId and questions are required");
  const examId = body.examId;
  const data = body.questions.map((question) => ({ ...validateQuestion(question), examId }));
  await prisma.question.createMany({ data });
  return ok({ inserted: data.length }, { status: 201 });
}
