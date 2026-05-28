import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full">
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-300">
          New student? <Link className="font-semibold text-sky-600" href="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
