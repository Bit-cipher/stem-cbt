"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function CreateExamPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    const subjects = String(formData.get("subjects") || "").split(",").map((s) => s.trim()).filter(Boolean);
    const res = await fetch("/api/exams", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: formData.get("title"), duration: Number(formData.get("duration")), subjects }) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Unable to create exam");
    router.push("/admin/upload");
  }
  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-black">Create exam</h1>
      <form action={submit} className="mt-6 space-y-4">
        <div><Label>Title</Label><Input name="title" required /></div>
        <div><Label>Duration in minutes</Label><Input name="duration" type="number" min={1} required /></div>
        <div><Label>Subjects</Label><Input name="subjects" defaultValue="Physics, Chemistry, Mathematics" required /></div>
        {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        <Button>Create exam</Button>
      </form>
    </Card>
  );
}
