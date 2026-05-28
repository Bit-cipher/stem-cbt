import type { AnswerMap } from "@/types";

type GradeQuestion = {
  id: string;
  subject: string;
  type: "MCQ" | "NUMERIC" | "TRUE_FALSE";
  answer: string;
  marks: number;
};

export function isCorrect(userAnswer: string | undefined, question: GradeQuestion) {
  if (!userAnswer) return false;
  if (question.type === "NUMERIC") {
    const expected = Number(question.answer);
    const actual = Number(userAnswer);
    if (Number.isNaN(expected) || Number.isNaN(actual)) return false;
    return Math.abs(actual - expected) <= Math.abs(expected) * 0.02;
  }
  return userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
}

export function gradeAnswers(questions: GradeQuestion[], answers: AnswerMap) {
  const total = questions.reduce((sum, q) => sum + q.marks, 0);
  const subjectBreakdown: Record<string, { score: number; total: number }> = {};
  let score = 0;

  for (const question of questions) {
    subjectBreakdown[question.subject] ??= { score: 0, total: 0 };
    subjectBreakdown[question.subject].total += question.marks;
    if (isCorrect(answers[question.id], question)) {
      score += question.marks;
      subjectBreakdown[question.subject].score += question.marks;
    }
  }

  return {
    score,
    total,
    percentage: total ? Math.round((score / total) * 10000) / 100 : 0,
    subjectBreakdown,
  };
}
