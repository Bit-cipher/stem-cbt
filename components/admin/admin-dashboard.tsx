"use client";

import Link from "next/link";
import { FileUp, Plus, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, StatCard } from "@/components/ui/card";

type Exam = { id: string; title: string; questionCount: number; resultCount: number };
type Result = { id: string; percentage: number };

export function AdminDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  useEffect(() => {
    void Promise.all([fetch("/api/exams").then((r) => r.json()), fetch("/api/results").then((r) => r.json())]).then(([e, r]) => {
      setExams(e.exams || []);
      setResults(r.results || []);
    });
  }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">Admin dashboard</h1><p className="mt-2 text-slate-500 dark:text-slate-300">Create exams, upload banks, and monitor competition outcomes.</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Exams" value={String(exams.length)} />
        <StatCard label="Questions" value={String(exams.reduce((n, e) => n + e.questionCount, 0))} />
        <StatCard label="Submissions" value={String(results.length)} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[["Create exam", "/admin/exams/create", Plus], ["Upload questions", "/admin/upload", FileUp], ["Manage exams", "/admin/exams/manage", Settings], ["View results", "/admin/results", Users]].map(([label, href, Icon]) => (
          <Link key={String(href)} href={String(href)}><Card className="h-full transition hover:-translate-y-1"><Icon className="mb-4 text-sky-500" /><h2 className="font-bold">{String(label)}</h2></Card></Link>
        ))}
      </div>
      <Card>
        <h2 className="mb-4 text-xl font-bold">Recent exams</h2>
        <div className="grid gap-3">
          {exams.slice(0, 5).map((exam) => <div key={exam.id} className="flex items-center justify-between rounded-lg bg-slate-950/5 p-3 dark:bg-white/10"><span>{exam.title}</span><Button size="sm" variant="secondary">Manage</Button></div>)}
        </div>
      </Card>
    </div>
  );
}
