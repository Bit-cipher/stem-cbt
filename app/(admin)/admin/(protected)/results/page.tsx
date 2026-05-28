"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Result = { id: string; score: number; percentage: number; timeSpent: number; createdAt: string; user: { name: string; school: string }; exam: { title: string } };

export default function ResultsManagementPage() {
  const [results, setResults] = useState<Result[]>([]);
  useEffect(() => { void fetch("/api/results").then((r) => r.json()).then((data) => setResults(data.results || [])); }, []);
  function exportCsv() {
    const rows = [["name", "school", "exam", "score", "percentage", "timeSpent"], ...results.map((r) => [r.user.name, r.user.school, r.exam.title, r.score, r.percentage, r.timeSpent])];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "stem-cbt-results.csv"; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3"><h1 className="text-3xl font-black">Results management</h1><Button onClick={exportCsv}><Download size={18} /> Export</Button></div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-950/5 dark:bg-white/10"><tr><th className="p-4">Student</th><th>School</th><th>Exam</th><th>Score</th><th>Percentage</th><th>Time</th></tr></thead>
          <tbody>{results.map((r) => <tr key={r.id} className="border-t border-slate-200 dark:border-white/10"><td className="p-4 font-semibold">{r.user.name}</td><td>{r.user.school}</td><td>{r.exam.title}</td><td>{r.score}</td><td>{r.percentage}%</td><td>{Math.round(r.timeSpent / 60)} min</td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}
