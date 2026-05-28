import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const results = await prisma.result.findMany({
    orderBy: [{ percentage: "desc" }, { timeSpent: "asc" }, { createdAt: "asc" }],
    select: { id: true, userId: true, examId: true, percentage: true, timeSpent: true, createdAt: true },
  });

  const seen = new Set<string>();
  const duplicateIds: string[] = [];

  for (const result of results) {
    const key = `${result.userId}:${result.examId}`;
    if (seen.has(key)) {
      duplicateIds.push(result.id);
    } else {
      seen.add(key);
    }
  }

  if (duplicateIds.length === 0) {
    console.log("No duplicate results found.");
    return;
  }

  const deleted = await prisma.result.deleteMany({ where: { id: { in: duplicateIds } } });
  console.log(`Deleted ${deleted.count} duplicate result(s). Kept the highest score, then lowest time for each student/exam.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
