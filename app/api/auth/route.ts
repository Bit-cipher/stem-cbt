import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { fail, ok, readJson } from "@/lib/api";
import { hashPassword, setSessionCookie, toSessionUser, verifyPassword } from "@/lib/auth";

type AuthBody = {
  action?: "register" | "login";
  name?: string;
  fullName?: string;
  email?: string;
  school?: string;
  password?: string;
  role?: "STUDENT" | "ADMIN";
};

export async function POST(request: Request) {
  const body = await readJson<AuthBody>(request);
  if (!body?.email || !body.password) return fail("Email and password are required");

  if (body.action === "register") {
    const name = body.fullName || body.name;
    if (!name || !body.school) return fail("Full name and school are required");
    const exists = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (exists) return fail("Email is already registered", 409);
    const user = await prisma.user.create({
      data: {
        name,
        email: body.email.toLowerCase(),
        school: body.school,
        password: await hashPassword(body.password),
        role: Role.STUDENT,
      },
      select: { id: true, name: true, email: true, role: true, school: true },
    });
    await setSessionCookie(toSessionUser(user));
    return ok({ user });
  }

  const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (!user || !(await verifyPassword(body.password, user.password))) return fail("Invalid email or password", 401);
  if (body.role === "ADMIN" && user.role !== Role.ADMIN) return fail("Admin access required", 403);
  const sessionUser = toSessionUser(user);
  await setSessionCookie(sessionUser);
  return ok({ user: sessionUser });
}
