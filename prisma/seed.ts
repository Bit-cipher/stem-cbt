import bcrypt from "bcryptjs";
import { PrismaClient, QuestionType, Role } from "@prisma/client";

const prisma = new PrismaClient();

function getAdminEmails() {
  const envEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()).filter(Boolean) ?? [];
  return Array.from(new Set(["admin@stemcbt.local", ...envEmails]));
}

function getAdminPassword() {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD must be set before running the seed script.");
  }

  return process.env.ADMIN_PASSWORD;
}

async function main() {
  const adminPassword = await bcrypt.hash(getAdminPassword(), 10);
  const studentPassword = await bcrypt.hash("student12345", 10);

  const adminEmails = getAdminEmails();

  for (const email of adminEmails) {
    await prisma.user.upsert({
      where: { email },
      update: { role: Role.ADMIN, school: "Platform" },
      create: { name: "STEM Admin", email, password: adminPassword, role: Role.ADMIN, school: "Platform" },
    });
  }

  
}

main().finally(async () => prisma.$disconnect());
