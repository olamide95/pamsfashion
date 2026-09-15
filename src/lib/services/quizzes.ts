import { serverTimestamp } from "firebase/firestore";
import { createDoc, getById, getList, orderBy, updateDocById, where } from "@/lib/firebase/firestore";
import type { Quiz, QuizAttempt, QuizQuestion } from "@/types";

export async function getQuizzesForCourse(courseId: string): Promise<Quiz[]> {
  return getList<Quiz>("quizzes", [where("courseId", "==", courseId)]);
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  return getById<Quiz>("quizzes", id);
}

export async function createQuiz(
  data: Omit<Quiz, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDoc<Quiz>("quizzes", data);
}

export async function updateQuiz(
  id: string,
  data: Partial<Omit<Quiz, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  return updateDocById<Quiz>("quizzes", id, data);
}

export function scoreQuiz(questions: QuizQuestion[], answers: number[]) {
  const correct = questions.reduce(
    (count, q, i) => (answers[i] === q.correctOptionIndex ? count + 1 : count),
    0
  );
  const scorePercentage = questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100);
  return scorePercentage;
}

export async function submitQuizAttempt(
  quiz: Quiz,
  userId: string,
  answers: number[]
): Promise<QuizAttempt> {
  const scorePercentage = scoreQuiz(quiz.questions, answers);
  const passed = scorePercentage >= quiz.passScorePercentage;
  const id = await createDoc<QuizAttempt>("quizAttempts", {
    quizId: quiz.id,
    userId,
    courseId: quiz.courseId,
    answers,
    scorePercentage,
    passed,
    submittedAt: serverTimestamp() as unknown as QuizAttempt["submittedAt"],
  });
  return {
    id,
    quizId: quiz.id,
    userId,
    courseId: quiz.courseId,
    answers,
    scorePercentage,
    passed,
    submittedAt: null,
    createdAt: null,
    updatedAt: null,
  };
}

export async function getAttemptsForUser(userId: string): Promise<QuizAttempt[]> {
  return getList<QuizAttempt>("quizAttempts", [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  ]);
}
