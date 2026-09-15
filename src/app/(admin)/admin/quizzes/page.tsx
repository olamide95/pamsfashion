"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getAllCoursesForAdmin } from "@/lib/services/courses";
import { createQuiz, getQuizzesForCourse } from "@/lib/services/quizzes";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Course, Quiz, QuizQuestion, QuizQuestionType } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-accent focus:outline-none";

function emptyQuestion(): QuizQuestion {
  return {
    id: crypto.randomUUID(),
    type: "multiple_choice",
    prompt: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
  };
}

export default function AdminQuizzesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<(Quiz & { courseTitle: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()]);

  async function load() {
    const courseList = await getAllCoursesForAdmin();
    setCourses(courseList);
    if (!courseId && courseList[0]) setCourseId(courseList[0].id);
    const perCourse = await Promise.all(
      courseList.map(async (c) => {
        const list = await getQuizzesForCourse(c.id);
        return list.map((q) => ({ ...q, courseTitle: c.title }));
      })
    );
    setQuizzes(perCourse.flat());
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.map((o, oi) => (oi === oIndex ? value : o)) } : q
      )
    );
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createQuiz({
      courseId,
      title: String(form.get("title") ?? "").trim(),
      passScorePercentage: Number(form.get("passScorePercentage") ?? 70),
      questions,
    });
    setCreateOpen(false);
    setQuestions([emptyQuestion()]);
    load();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Quizzes</h1>
          <p className="mt-1 text-charcoal/60">Build multiple choice and true/false quizzes for your courses.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create Quiz</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : quizzes.length > 0 ? (
        <div className="flex flex-col gap-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <p className="font-medium text-charcoal">{quiz.title}</p>
              <p className="text-xs text-charcoal/50">
                {quiz.courseTitle} &middot; {quiz.questions.length} question(s) &middot; Pass at {quiz.passScorePercentage}%
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No quizzes yet" description="Create your first quiz to get started." />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Quiz">
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Course</label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClass}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Quiz title</label>
            <input name="title" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Pass score (%)</label>
            <input
              name="passScorePercentage"
              type="number"
              min={0}
              max={100}
              defaultValue={70}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-4">
            {questions.map((q, qi) => (
              <div key={q.id} className="rounded-xl border border-sand p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                    Question {qi + 1}
                  </p>
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const type = e.target.value as QuizQuestionType;
                      updateQuestion(qi, {
                        type,
                        options: type === "true_false" ? ["True", "False"] : ["", "", "", ""],
                        correctOptionIndex: 0,
                      });
                    }}
                    className="rounded-lg border border-sand px-2 py-1 text-xs"
                  >
                    <option value="multiple_choice">Multiple choice</option>
                    <option value="true_false">True / False</option>
                  </select>
                </div>
                <input
                  value={q.prompt}
                  onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
                  placeholder="Question prompt"
                  className={`${inputClass} mb-3`}
                />
                <div className="flex flex-col gap-2">
                  {q.options.map((option, oi) => (
                    <label key={oi} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctOptionIndex === oi}
                        onChange={() => updateQuestion(qi, { correctOptionIndex: oi })}
                      />
                      {q.type === "true_false" ? (
                        <span>{option}</span>
                      ) : (
                        <input
                          value={option}
                          onChange={(e) => updateOption(qi, oi, e.target.value)}
                          placeholder={`Option ${oi + 1}`}
                          className={inputClass}
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
              className="text-sm font-medium text-accent hover:underline"
            >
              + Add another question
            </button>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => setQuestions((prev) => prev.slice(0, -1))}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Remove last question
              </button>
            )}
          </div>

          <Button type="submit" className="w-full">
            Create Quiz
          </Button>
        </form>
      </Modal>
    </div>
  );
}
