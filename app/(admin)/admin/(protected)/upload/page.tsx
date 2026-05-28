"use client";

import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";

type Exam = { id: string; title: string };

export default function UploadQuestionsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => { void fetch("/api/exams").then((r) => r.json()).then((data) => setExams(data.exams || [])); }, []);
  async function submit(formData: FormData) {
    setMessage("");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setMessage(res.ok ? `Imported ${data.inserted} questions.` : data.error || "Upload failed");
  }
  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 text-2xl font-black"><Upload /> Upload question bank</h1>
      <form action={submit} className="mt-6 space-y-4">
        <div><Label>Exam</Label><Select name="examId" required>{exams.map((exam) => <option key={exam.id} value={exam.id}>{exam.title}</option>)}</Select></div>
        <div><Label>CSV or JSON file</Label><Input name="file" type="file" accept=".csv,.json" required /></div>
        <Button>Upload</Button>
        {message ? <p className="text-sm font-semibold text-sky-600 dark:text-sky-300">{message}</p> : null}
      </form>
      <div className="mt-6 rounded-lg bg-slate-950/5 p-4 text-sm dark:bg-white/10">
        CSV columns: subject,type,question,optionA,optionB,optionC,optionD,answer,marks
      </div>
    </Card>
  );
}
