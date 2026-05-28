import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-white/20 bg-white/70 p-5 shadow-xl shadow-slate-950/5 backdrop-blur dark:bg-white/10", className)} {...props} />;
}

export function StatCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </Card>
  );
}
