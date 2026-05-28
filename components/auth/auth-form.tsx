"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export function AuthForm({ mode, admin = false }: { mode: "login" | "register"; admin?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const body = Object.fromEntries(formData);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, action: mode, role: admin ? "ADMIN" : "STUDENT" }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Something went wrong");
    router.push(admin ? "/admin/dashboard" : "/dashboard");
    router.refresh();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">{admin ? "Admin login" : mode === "login" ? "Student login" : "Create student account"}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Access timed STEM competitions, instant marking, and offline exam sessions.</p>
        <form action={submit} className="mt-6 space-y-4">
          {mode === "register" ? (
            <>
              <div><Label>Full name</Label><Input name="fullName" required /></div>
              <div><Label>School</Label><Input name="school" required /></div>
            </>
          ) : null}
          <div><Label>Email</Label><Input name="email" type="email" required /></div>
          <div><Label>Password</Label><Input name="password" type="password" minLength={8} required /></div>
          {error ? <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-200">{error}</p> : null}
          <Button className="w-full" disabled={loading}>{loading ? "Please wait..." : mode === "register" ? "Register" : "Login"}</Button>
        </form>
      </Card>
    </motion.div>
  );
}
