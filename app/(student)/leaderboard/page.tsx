"use client";

import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Row = { id: string; name: string; school: string; exam: string; percentage: number; score: number; timeSpent: number };

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    void fetch("/api/leaderboard").then((r) => r.json()).then((data) => setRows(data.leaderboard || []));
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-black text-slate-950 dark:text-white"><Trophy /> Leaderboard</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-300">Top 10 ranked by highest score and lowest completion time.</p>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-950/5 dark:bg-white/10"><tr><th className="p-4">Rank</th><th>Name</th><th>School</th><th>Exam</th><th>Score</th><th>Time</th></tr></thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-t border-slate-200 dark:border-white/10">
                <td className="p-4 font-bold">#{index + 1}</td><td>{row.name}</td><td>{row.school}</td><td>{row.exam}</td><td>{row.percentage}%</td><td>{Math.round(row.timeSpent / 60)} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
