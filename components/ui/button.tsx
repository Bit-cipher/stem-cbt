import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400",
    secondary: "border border-white/15 bg-white/10 text-slate-950 hover:bg-white/20 dark:text-white",
    ghost: "text-slate-700 hover:bg-slate-950/5 dark:text-slate-200 dark:hover:bg-white/10",
    danger: "bg-rose-500 text-white hover:bg-rose-400",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
    icon: "h-10 w-10 p-0",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
