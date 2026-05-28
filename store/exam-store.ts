"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnswerMap, QueuedSubmission } from "@/types";

type ExamState = {
  answers: AnswerMap;
  currentIndex: number;
  remainingSeconds: number;
  violations: number;
  queued: QueuedSubmission[];
  setAnswer: (questionId: string, answer: string) => void;
  setCurrentIndex: (index: number) => void;
  setRemainingSeconds: (seconds: number) => void;
  addViolation: () => number;
  resetExam: (durationSeconds: number) => void;
  queueSubmission: (submission: QueuedSubmission) => void;
  removeQueuedSubmission: (submittedAt: number) => void;
};

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      answers: {},
      currentIndex: 0,
      remainingSeconds: 0,
      violations: 0,
      queued: [],
      setAnswer: (questionId, answer) => set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
      setCurrentIndex: (currentIndex) => set({ currentIndex }),
      setRemainingSeconds: (remainingSeconds) => set({ remainingSeconds }),
      addViolation: () => {
        const next = get().violations + 1;
        set({ violations: next });
        return next;
      },
      resetExam: (durationSeconds) => set({ answers: {}, currentIndex: 0, remainingSeconds: durationSeconds, violations: 0 }),
      queueSubmission: (submission) => set((state) => ({ queued: [...state.queued, submission] })),
      removeQueuedSubmission: (submittedAt) => set((state) => ({ queued: state.queued.filter((item) => item.submittedAt !== submittedAt) })),
    }),
    { name: "stem-cbt-exam" },
  ),
);
