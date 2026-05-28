"use client";

import { CloudOff, RefreshCw, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnline } from "@/hooks/use-online";
import { useExamStore } from "@/store/exam-store";

export function OfflineSync() {
  const online = useOnline();
  const { queued, removeQueuedSubmission } = useExamStore();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!online || queued.length === 0 || syncing) return;
    let cancelled = false;
    async function sync() {
      setSyncing(true);
      for (const submission of queued) {
        const res = await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
        if (!cancelled && (res.ok || res.status === 409)) removeQueuedSubmission(submission.submittedAt);
      }
      if (!cancelled) setSyncing(false);
    }
    void sync();
    return () => {
      cancelled = true;
    };
  }, [online, queued, removeQueuedSubmission, syncing]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur dark:bg-slate-950/85 dark:text-slate-100">
      {syncing ? <RefreshCw className="animate-spin" size={14} /> : online ? <Wifi size={14} /> : <CloudOff size={14} />}
      {syncing ? "Syncing" : online ? queued.length ? `${queued.length} pending` : "Online" : "Offline"}
    </div>
  );
}
