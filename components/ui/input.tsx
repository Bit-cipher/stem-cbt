import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const base = "w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-950 outline-none ring-sky-500/30 transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 dark:border-white/10 dark:bg-white/10 dark:text-white";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, "min-h-28", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(base, className)} {...props} />;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{children}</label>;
}
