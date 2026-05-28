import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireUser(role?: "STUDENT" | "ADMIN") {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: fail("Authentication required", 401) };
  if (role && user.role !== role) return { user: null, error: fail("Forbidden", 403) };
  return { user, error: null };
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
