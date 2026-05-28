"use client";

import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Maximize2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useOnline } from "@/hooks/use-online";
import { useExamStore } from "@/store/exam-store";
import type { ExamWithQuestions } from "@/types";

function format(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.max(0, seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function ExamClient({ exam }: { exam: ExamWithQuestions }) {
  const router = useRouter();
  const online = useOnline();
  const [startedAt] = useState(() => Date.now());
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { answers, currentIndex, remainingSeconds, violations, setAnswer, setCurrentIndex, setRemainingSeconds, addViolation, resetExam, queueSubmission } = useExamStore();
  const current = exam.questions[currentIndex];
  const answered = useMemo(() => Object.values(answers).filter(Boolean).length, [answers]);

  const submit = useCallback(async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    const payload = { examId: exam.id, answers, startedAt, submittedAt: Date.now(), timeSpent: Math.round((Date.now() - startedAt) / 1000) };
    if (!online) {
      queueSubmission(payload);
      router.push("/dashboard");
      return;
    }
    const res = await fetch("/api/results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (res.ok) router.push(`/results/${data.result.id}`);
    else if (res.status === 409) router.push("/dashboard");
    else if (auto) router.push("/dashboard");
    setSubmitting(false);
  }, [answers, exam.id, online, queueSubmission, router, startedAt, submitting]);

  useEffect(() => {
    if (remainingSeconds <= 0) resetExam(exam.duration * 60);
  }, [exam.duration, remainingSeconds, resetExam]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = useExamStore.getState().remainingSeconds - 1;
      setRemainingSeconds(next);
      if (next <= 0) void submit(true);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [setRemainingSeconds, submit]);

  useEffect(() => {
    function warn() {
      const count = addViolation();
      if (count >= 3) void submit(true);
    }
    const block = (event: Event) => {
      event.preventDefault();
      warn();
    };
    const visibility = () => { if (document.hidden) warn(); };
    const fullscreen = () => { if (!document.fullscreenElement) warn(); };
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("fullscreenchange", fullscreen);
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("fullscreenchange", fullscreen);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
    };
  }, [addViolation, submit]);

  if (reviewing) {
    return (
      <div className="space-y-5">
        <Card>
          <h1 className="text-2xl font-black">Review answers</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-300">{answered} of {exam.questions.length} answered. Time left: {format(remainingSeconds)}</p>
          <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-10">
            {exam.questions.map((q, i) => <button key={q.id} onClick={() => { setCurrentIndex(i); setReviewing(false); }} className={`h-10 rounded-lg text-sm font-bold ${answers[q.id] ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-white/10"}`}>{i + 1}</button>)}
          </div>
          <div className="mt-6 flex gap-3"><Button variant="secondary" onClick={() => setReviewing(false)}>Back</Button><Button onClick={() => submit()} disabled={submitting}><Send size={18} /> Submit</Button></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><Badge>{current.subject}</Badge><h1 className="mt-3 text-xl font-bold">Question {currentIndex + 1} of {exam.questions.length}</h1></div>
          <div className="text-right"><p className="font-mono text-3xl font-black text-sky-600">{format(remainingSeconds)}</p><p className="text-xs text-rose-500">{violations} warnings</p></div>
        </div>
        <p className="mt-6 text-lg leading-8">{current.question}</p>
        <div className="mt-6 grid gap-3">
          {current.type === "NUMERIC" ? (
            <Input inputMode="decimal" placeholder="Enter numeric answer" value={answers[current.id] || ""} onChange={(e) => setAnswer(current.id, e.target.value)} />
          ) : current.options.map((option) => (
            <button key={option} onClick={() => setAnswer(current.id, option)} className={`rounded-lg border p-4 text-left transition ${answers[current.id] === option ? "border-emerald-400 bg-emerald-500/15" : "border-slate-200 bg-white/60 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5"}`}>
              {option}
            </button>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <Button variant="secondary" disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)}><ChevronLeft size={18} /> Previous</Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => document.documentElement.requestFullscreen().catch(() => null)}><Maximize2 size={18} /> Fullscreen</Button>
            {currentIndex === exam.questions.length - 1 ? <Button onClick={() => setReviewing(true)}><CheckCircle2 size={18} /> Review</Button> : <Button onClick={() => setCurrentIndex(currentIndex + 1)}>Next <ChevronRight size={18} /></Button>}
          </div>
        </div>
      </Card>
      <Card>
        <h2 className="font-bold">Question palette</h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {exam.questions.map((q, i) => <button key={q.id} onClick={() => setCurrentIndex(i)} className={`h-10 rounded-lg text-sm font-bold ${i === currentIndex ? "bg-sky-500 text-white" : answers[q.id] ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-white/10"}`}>{i + 1}</button>)}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300"><AlertTriangle size={16} /> Three warnings auto-submit the exam.</p>
      </Card>
    </div>
  );
}
