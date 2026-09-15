"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getQuizById, submitQuizAttempt } from "@/lib/services/quizzes";
import { Button } from "@/components/ui/Button";
import type { Quiz, QuizAttempt } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

export default function QuizTakingPage() {
  const params = useParams<{ quizId: string }>();
  const { profile } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getQuizById(params.quizId).then((q) => {
      if (!cancelled) {
        setQuiz(q);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [params.quizId]);

  async function handleSubmit() {
    if (!quiz || !profile) return;
    if (Object.keys(answers).length < quiz.questions.length) {
      setError("Please answer every question before submitting.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const orderedAnswers = quiz.questions.map((_, i) => answers[i]);
      const attempt = await submitQuizAttempt(quiz, profile.uid, orderedAnswers);
      setResult(attempt);
    } catch {
      setError("Something went wrong submitting your quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState />;
  if (!quiz) return <p className="text-charcoal/50">Quiz not found.</p>;

  if (result) {
    return (
      <div className="max-w-xl rounded-3xl bg-white p-10 text-center ring-1 ring-black/5">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Quiz Result</p>
        <p className="mt-3 font-display text-5xl text-charcoal">{result.scorePercentage}%</p>
        <p className="mt-2 text-charcoal/60">
          {result.passed
            ? "Great work — you passed this quiz!"
            : `You need ${quiz.passScorePercentage}% to pass. Feel free to try again.`}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/student/quizzes" className="text-sm font-medium text-accent hover:underline">
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <Link href="/student/quizzes" className="text-xs text-accent hover:underline">
          &larr; Quizzes
        </Link>
        <h1 className="mt-1 font-display text-3xl text-charcoal">{quiz.title}</h1>
        <p className="mt-1 text-sm text-charcoal/50">Pass mark: {quiz.passScorePercentage}%</p>
      </div>

      <div className="flex flex-col gap-6">
        {quiz.questions.map((q, i) => (
          <fieldset key={q.id} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <legend className="mb-4 font-medium text-charcoal">
              {i + 1}. {q.prompt}
            </legend>
            <div className="flex flex-col gap-2">
              {q.options.map((option, oi) => (
                <label
                  key={oi}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    answers[i] === oi ? "border-accent bg-accent-soft" : "border-sand hover:bg-ivory-deep"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${i}`}
                    className="accent-[var(--color-accent)]"
                    checked={answers[i] === oi}
                    onChange={() => setAnswers((prev) => ({ ...prev, [i]: oi }))}
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <p className="text-sm text-accent-dark">{error}</p>}

      <Button onClick={handleSubmit} disabled={submitting} className="w-fit">
        {submitting ? "Submitting..." : "Submit Quiz"}
      </Button>
    </div>
  );
}
