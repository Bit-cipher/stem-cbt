import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function POST(request: Request) {
  await clearSessionCookie();
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/html")) redirect("/login");
  return ok({ success: true });
}
