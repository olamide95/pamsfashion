"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEnrolledCourses } from "@/lib/services/enrollments";
import { getQuizzesForCourse } from "@/lib/services/quizzes";
import { getAttemptsForUser } from "@/lib/services/quizzes";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Quiz, QuizAttempt } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

interface Row {
  quiz: Quiz;
  courseTitle: string;
  bestAttempt?: QuizAttempt;
}

export default function StudentQuizzesPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    (async () => {
      const enrolled = await getEnrolledCourses(profile.uid);
      const attempts = await getAttemptsForUser(profile.uid);

      const perCourse = await Promise.all(
        enrolled.map(async ({ course }) => {
          const quizzes = await getQuizzesForCourse(course.id);
          return quizzes.map((quiz) => ({
            quiz,
            courseTitle: course.title,
            bestAttempt: attempts
              .filter((a) => a.quizId === quiz.id)
              .sort((a, b) => b.scorePercentage - a.scorePercentage)[0],
          }));
        })
      );

      if (!cancelled) {
        setRows(perCourse.flat());
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl text-charcoal">Quizzes</h1>

      {loading ? (
        <LoadingState />
      ) : rows.length > 0 ? (
        <div className="flex flex-col gap-3">
          {rows.map(({ quiz, courseTitle, bestAttempt }) => (
            <Link
              key={quiz.id}
              href={`/student/quizzes/${quiz.id}`}
              className="flex flex-col justify-between gap-2 rounded-2xl bg-white p-5 ring-1 ring-black/5 hover:shadow-md sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-medium text-charcoal">{quiz.title}</p>
                <p className="text-xs text-charcoal/50">{courseTitle}</p>
              </div>
              {bestAttempt ? (
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    bestAttempt.passed ? "bg-green-100 text-green-700" : "bg-accent-soft text-accent-dark"
                  }`}
                >
                  Best score: {bestAttempt.scorePercentage}%
                </span>
              ) : (
                <span className="w-fit rounded-full bg-ivory-deep px-3 py-1 text-xs font-medium text-charcoal/60">
                  Not attempted
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No quizzes yet" description="Quizzes from your courses will appear here." />
      )}
    </div>
  );
}
