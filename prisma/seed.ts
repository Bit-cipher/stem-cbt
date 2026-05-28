import bcrypt from "bcryptjs";
import { PrismaClient, QuestionType, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin12345", 10);
  const studentPassword = await bcrypt.hash("student12345", 10);

  await prisma.user.upsert({
    where: { email: "admin@stemcbt.local" },
    update: {},
    create: { name: "STEM Admin", email: "admin@stemcbt.local", password: adminPassword, role: Role.ADMIN, school: "Platform" },
  });

  await prisma.user.upsert({
    where: { email: "bol3xy@gmail.com" },
    update: {},
    create: { name: "STEM Admin", email: "bol3xy@gmail.com", password: adminPassword, role: Role.ADMIN, school: "Platform" },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@stemcbt.local" },
    update: {},
    create: { name: "Ada Okafor", email: "student@stemcbt.local", password: studentPassword, school: "Unity STEM College" },
  });

  const exam = await prisma.exam.create({
    data: { title: "STEM Sprint Practice", duration: 20, subjects: ["Physics", "Chemistry", "Mathematics"] },
  });

  await prisma.question.createMany({
    data: [
      { examId: exam.id, subject: "Physics", type: QuestionType.MCQ, question: "What is the approximate value of g on Earth?", options: ["8.9", "9.8", "10.8", "11.8"], answer: "9.8", marks: 2 },
      { examId: exam.id, subject: "Chemistry", type: QuestionType.TRUE_FALSE, question: "Water has the chemical formula H2O.", options: ["True", "False"], answer: "True", marks: 1 },
      { examId: exam.id, subject: "Mathematics", type: QuestionType.NUMERIC, question: "Evaluate 12 x 12.", options: [], answer: "144", tolerance: 0.02, marks: 2 },
    ],
  });

  await prisma.result.create({
    data: { userId: student.id, examId: exam.id, score: 5, percentage: 100, timeSpent: 560, subjectBreakdown: { Physics: { score: 2, total: 2 }, Chemistry: { score: 1, total: 1 }, Mathematics: { score: 2, total: 2 } } },
  });
}

main().finally(async () => prisma.$disconnect());
