"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, StatCard } from "@/components/ui/card";

type Exam = { id: string; title: string; duration: number; subjects: string[]; questionCount: number; completedResultId?: string | null };
type Result = { id: string; percentage: number; score: number; timeSpent: number; exam: { title: string } };

export function StudentDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    void Promise.all([fetch("/api/exams").then((r) => r.json()), fetch("/api/results").then((r) => r.json())]).then(([examData, resultData]) => {
      setExams(examData.exams || []);
      setResults(resultData.results || []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Student dashboard</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-300">Pick an exam, continue offline if needed, and sync your result later.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Available exams" value={String(exams.length)} helper="Ready to attempt" />
        <StatCard label="Completed" value={String(results.length)} helper="Submitted results" />
        <StatCard label="Best score" value={`${Math.max(0, ...results.map((r) => r.percentage))}%`} helper="Personal best" />
      </div>
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><BookOpen size={20} /> Available exams</h2>
          <div className="grid gap-3">
            {exams.map((exam) => (
              <div key={exam.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{exam.title}</h3>
                    {exam.completedResultId ? <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-200">Completed</Badge> : null}
                  </div>
                  <p className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1"><Clock size={14} /> {exam.duration} min</span>
                    <span>{exam.questionCount} questions</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">{exam.subjects.map((s) => <Badge key={s}>{s}</Badge>)}</div>
                </div>
                {exam.completedResultId ? (
                  <Link href={`/results/${exam.completedResultId}`}><Button variant="secondary">View result</Button></Link>
                ) : (
                  <Link href={`/exams/${exam.id}`}><Button>Open</Button></Link>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><Award size={20} /> Recent scores</h2>
          <div className="space-y-3">
            {results.slice(0, 6).map((result) => (
              <Link key={result.id} href={`/results/${result.id}`} className="block rounded-lg bg-slate-950/5 p-3 transition hover:bg-slate-950/10 dark:bg-white/10">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{result.exam.title}</span>
                  <span className="font-bold text-emerald-600">{result.percentage}%</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300">{Math.round(result.timeSpent / 60)} min spent</p>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
