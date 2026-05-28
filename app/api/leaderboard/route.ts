import { prisma } from "@/lib/db";
import { ok } from "@/lib/api";

export async function GET() {
  const results = await prisma.result.findMany({
    take: 10,
    orderBy: [{ percentage: "desc" }, { timeSpent: "asc" }],
    include: { user: { select: { name: true, school: true } }, exam: { select: { title: true } } },
  });
  return ok({
    leaderboard: results.map((result) => ({
      id: result.id,
      name: result.user.name,
      school: result.user.school,
      exam: result.exam.title,
      score: result.score,
      percentage: result.percentage,
      timeSpent: result.timeSpent,
    })),
  });
}
