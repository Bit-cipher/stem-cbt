import type { QuestionType } from "@/types";

export type QuestionInput = {
  subject: string;
  type: QuestionType | string;
  question: string;
  options?: string[];
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  answer: string;
  marks?: number | string;
};

export function normalizeType(type: string): QuestionType {
  const value = type.trim().toUpperCase().replace("/", "_");
  if (value === "MCQ" || value === "NUMERIC" || value === "TRUE_FALSE") return value;
  if (value === "TRUEFALSE" || value === "TRUE-FALSE") return "TRUE_FALSE";
  throw new Error(`Unsupported question type: ${type}`);
}

export function validateQuestion(input: QuestionInput) {
  const type = normalizeType(String(input.type || ""));
  const options = input.options?.length
    ? input.options.map(String).filter(Boolean)
    : [input.optionA, input.optionB, input.optionC, input.optionD].filter(Boolean).map(String);

  if (!input.subject || !input.question || !input.answer) throw new Error("subject, question, and answer are required");
  if (type === "MCQ" && options.length !== 4) throw new Error("MCQ questions require exactly four options");
  if (type === "TRUE_FALSE" && options.length === 0) options.push("True", "False");

  return {
    subject: String(input.subject).trim(),
    type,
    question: String(input.question).trim(),
    options,
    answer: String(input.answer).trim(),
    marks: Number(input.marks || 1),
    tolerance: type === "NUMERIC" ? 0.02 : null,
  };
}

export function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}
