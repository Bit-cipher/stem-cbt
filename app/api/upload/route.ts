import Papa from "papaparse";
import { prisma } from "@/lib/db";
import { fail, ok, requireUser } from "@/lib/api";
import { validateQuestion, type QuestionInput } from "@/utils/questions";

export async function POST(request: Request) {
  const { error } = await requireUser("ADMIN");
  if (error) return error;
  const form = await request.formData();
  const examId = String(form.get("examId") || "");
  const file = form.get("file");
  if (!examId || !(file instanceof File)) return fail("examId and file are required");

  const text = await file.text();
  let rows: QuestionInput[];
  if (file.name.endsWith(".json")) {
    rows = JSON.parse(text) as QuestionInput[];
  } else {
    const parsed = Papa.parse<QuestionInput>(text, { header: true, skipEmptyLines: true });
    if (parsed.errors.length) return fail(parsed.errors[0].message);
    rows = parsed.data;
  }

  const data = rows.map((row) => ({ ...validateQuestion(row), examId }));
  await prisma.question.createMany({ data });
  return ok({ inserted: data.length });
}
