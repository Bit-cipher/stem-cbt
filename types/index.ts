export type QuestionType = "MCQ" | "NUMERIC" | "TRUE_FALSE";

export type PublicQuestion = {
  id: string;
  examId: string;
  subject: string;
  type: QuestionType;
  question: string;
  options: string[];
  marks: number;
};

export type ExamWithQuestions = {
  id: string;
  title: string;
  duration: number;
  subjects: string[];
  createdAt: string;
  questions: PublicQuestion[];
};

export type AnswerMap = Record<string, string>;

export type QueuedSubmission = {
  examId: string;
  answers: AnswerMap;
  startedAt: number;
  submittedAt: number;
  timeSpent: number;
};
