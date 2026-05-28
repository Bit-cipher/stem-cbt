import Link from "next/link";
import { ArrowRight, BarChart3, Cloud, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Timer, title: "Timed CBT engine", text: "Countdowns, autosave, review mode, and auto-submit." },
  { icon: Cloud, title: "Offline sessions", text: "Questions cache after load and answers sync when internet returns." },
  { icon: BarChart3, title: "Instant leaderboard", text: "Top students sorted by score and completion time." },
  { icon: ShieldCheck, title: "Light anti-cheat", text: "Fullscreen, tab switching, copy/paste, and right-click checks." },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm font-semibold text-sky-700 dark:text-sky-200">Physics, Chemistry, Mathematics</p>
          <h1 className="max-w-3xl text-5xl font-black tracking-normal text-slate-950 dark:text-white md:text-7xl">STEM CBT</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">A fast, offline-ready competition platform for timed tests, instant marking, admin question banks, and live leaderboards.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register"><Button>Start competing <ArrowRight size={18} /></Button></Link>
            <Link href="/admin"><Button variant="secondary">Admin portal</Button></Link>
          </div>
        </div>
        <div className="grid gap-4">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="flex items-start gap-4">
              <div className="rounded-lg bg-emerald-500/15 p-3 text-emerald-600 dark:text-emerald-300"><Icon size={22} /></div>
              <div>
                <h2 className="font-bold text-slate-950 dark:text-white">{title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
