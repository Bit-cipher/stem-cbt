"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Exam = { id: string; title: string; duration: number; subjects: string[]; questionCount: number; resultCount: number };

export default function ManageExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  async function load() { const data = await fetch("/api/exams").then((r) => r.json()); setExams(data.exams || []); }
  useEffect(() => {
    let cancelled = false;
    void fetch("/api/exams").then((r) => r.json()).then((data) => {
      if (!cancelled) setExams(data.exams || []);
    });
    return () => { cancelled = true; };
  }, []);
  async function remove(id: string) {
    await fetch(`/api/exams/${id}`, { method: "DELETE" });
    await load();
  }
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Manage exams</h1>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-950/5 dark:bg-white/10"><tr><th className="p-4">Title</th><th>Duration</th><th>Subjects</th><th>Questions</th><th>Results</th><th /></tr></thead>
          <tbody>{exams.map((exam) => <tr key={exam.id} className="border-t border-slate-200 dark:border-white/10"><td className="p-4 font-semibold">{exam.title}</td><td>{exam.duration} min</td><td>{exam.subjects.join(", ")}</td><td>{exam.questionCount}</td><td>{exam.resultCount}</td><td><Button size="icon" variant="danger" onClick={() => remove(exam.id)}><Trash2 size={16} /></Button></td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}
