import { prisma } from "@/lib/db";
import { fail, ok, requireUser } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { user, error } = await requireUser();
  if (error) return error;
  const { id } = await params;
  const result = await prisma.result.findUnique({
    where: { id },
    include: { exam: { select: { title: true, duration: true, subjects: true } }, user: { select: { id: true, name: true, school: true } } },
  });
  if (!result) return fail("Result not found", 404);
  if (user!.role !== "ADMIN" && result.user.id !== user!.id) return fail("Forbidden", 403);
  return ok({ result });
}
