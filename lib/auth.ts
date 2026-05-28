import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  school?: string | null;
};

const COOKIE_NAME = "stem_cbt_token";

function secret() {
  return process.env.JWT_SECRET || "dev-only-change-this-secret";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(user: SessionUser) {
  return jwt.sign(user, secret(), { expiresIn: "7d" });
}

export function verifySession(token?: string): SessionUser | null {
  if (!token) return null;
  try {
    return jwt.verify(token, secret()) as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  (await cookies()).set(COOKIE_NAME, signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const session = verifySession(token);
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true, school: true },
  });
  return user as SessionUser | null;
}

export function toSessionUser(user: { id: string; name: string; email: string; role: "STUDENT" | "ADMIN"; school?: string | null }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, school: user.school };
}
