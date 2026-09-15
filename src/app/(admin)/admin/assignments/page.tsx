"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Timestamp } from "firebase/firestore";
import { getAllCoursesForAdmin } from "@/lib/services/courses";
import {
  createAssignment,
  getAssignmentsForCourse,
  getSubmissionsForAssignment,
  reviewSubmission,
} from "@/lib/services/assignments";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Assignment, Course, Submission, SubmissionType } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-accent focus:outline-none";

export default function AdminAssignmentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<(Assignment & { courseTitle: string })[]>([]);
  const [submissionsByAssignment, setSubmissionsByAssignment] = useState<Record<string, Submission[]>>({});
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [reviewing, setReviewing] = useState<Submission | null>(null);

  async function load() {
    const courseList = await getAllCoursesForAdmin();
    setCourses(courseList);
    const perCourse = await Promise.all(
      courseList.map(async (c) => {
        const list = await getAssignmentsForCourse(c.id);
        return list.map((a) => ({ ...a, courseTitle: c.title }));
      })
    );
    const flat = perCourse.flat();
    setAssignments(flat);

    const submissionEntries = await Promise.all(
      flat.map(async (a) => [a.id, await getSubmissionsForAssignment(a.id)] as const)
    );
    setSubmissionsByAssignment(Object.fromEntries(submissionEntries));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const deadlineValue = String(form.get("deadline") ?? "");

    await createAssignment({
      courseId: String(form.get("courseId")),
      title: String(form.get("title") ?? "").trim(),
      instructions: String(form.get("instructions") ?? "").trim(),
      deadline: deadlineValue ? Timestamp.fromDate(new Date(deadlineValue)) : null,
      requiredSubmissionType: form.get("requiredSubmissionType") as SubmissionType,
      status: "published",
    });
    setCreateOpen(false);
    load();
  }

  async function handleReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reviewing) return;
    const form = new FormData(e.currentTarget);
    await reviewSubmission(reviewing.id, {
      score: Number(form.get("score") ?? 0),
      feedback: String(form.get("feedback") ?? "").trim(),
    });
    setReviewing(null);
    load();
  }

  const pendingCount = Object.values(submissionsByAssignment)
    .flat()
    .filter((s) => s.status === "pending_review").length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Assignments</h1>
          <p className="mt-1 text-charcoal/60">{pendingCount} submission(s) waiting for review.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create Assignment</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : assignments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {assignments.map((assignment) => {
            const submissions = submissionsByAssignment[assignment.id] ?? [];
            return (
              <div key={assignment.id} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-charcoal">{assignment.title}</p>
                    <p className="text-xs text-charcoal/50">{assignment.courseTitle}</p>
                  </div>
                  <span className="text-xs text-charcoal/50">{submissions.length} submission(s)</span>
                </div>

                {submissions.length > 0 && (
                  <div className="mt-4 divide-y divide-sand">
                    {submissions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between py-2 text-sm">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            s.status === "reviewed" ? "bg-green-100 text-green-700" : "bg-accent-soft text-accent-dark"
                          }`}
                        >
                          {s.status === "reviewed" ? `Reviewed \u2013 ${s.score ?? 0}%` : "Pending review"}
                        </span>
                        {s.status === "pending_review" && (
                          <button onClick={() => setReviewing(s)} className="font-medium text-accent hover:underline">
                            Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No assignments yet" description="Create an assignment to get started." />
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Assignment">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Course</label>
            <select name="courseId" required className={inputClass}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Title</label>
            <input name="title" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Instructions</label>
            <textarea name="instructions" required rows={4} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Deadline (optional)</label>
            <input type="date" name="deadline" className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Required submission type</label>
            <select name="requiredSubmissionType" className={inputClass}>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="file">File</option>
            </select>
          </div>
          <Button type="submit" className="mt-2 w-full">
            Create Assignment
          </Button>
        </form>
      </Modal>

      <Modal open={!!reviewing} onClose={() => setReviewing(null)} title="Review Submission">
        {reviewing && (
          <form onSubmit={handleReview} className="flex flex-col gap-4">
            {reviewing.textContent && (
              <p className="rounded-xl bg-ivory-deep p-4 text-sm text-charcoal/70">{reviewing.textContent}</p>
            )}
            {reviewing.fileUrls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
                View submitted file
              </a>
            ))}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal">Score (%)</label>
              <input type="number" name="score" min={0} max={100} required className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal">Feedback</label>
              <textarea name="feedback" rows={3} className={inputClass} />
            </div>
            <Button type="submit" className="w-full">
              Save Review
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
