"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getAssignmentById, getSubmissionsForUser, submitAssignment } from "@/lib/services/assignments";
import { uploadFile, submissionFilePath } from "@/lib/firebase/storage";
import { Button } from "@/components/ui/Button";
import type { Assignment, Submission } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

export default function AssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>();
  const { profile } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    (async () => {
      const [a, submissions] = await Promise.all([
        getAssignmentById(params.assignmentId),
        getSubmissionsForUser(profile.uid),
      ]);
      if (cancelled) return;
      setAssignment(a);
      setSubmission(submissions.find((s) => s.assignmentId === params.assignmentId) ?? null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [profile, params.assignmentId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile || !assignment) return;
    setError(null);
    setSubmitting(true);

    try {
      const form = new FormData(e.currentTarget);
      const textContent = String(form.get("textContent") ?? "").trim();
      const file = form.get("file") as File | null;
      const fileUrls: string[] = [];

      if (file && file.size > 0) {
        const url = await uploadFile(
          submissionFilePath(profile.uid, assignment.id, file.name),
          file
        );
        fileUrls.push(url);
      }

      if (assignment.requiredSubmissionType === "text" && !textContent) {
        setError("Please write your submission before sending.");
        setSubmitting(false);
        return;
      }
      if (assignment.requiredSubmissionType !== "text" && fileUrls.length === 0) {
        setError("Please attach a file before sending.");
        setSubmitting(false);
        return;
      }

      await submitAssignment({
        assignmentId: assignment.id,
        userId: profile.uid,
        courseId: assignment.courseId,
        textContent: textContent || undefined,
        fileUrls,
      });

      setSubmission({
        id: "pending",
        assignmentId: assignment.id,
        userId: profile.uid,
        courseId: assignment.courseId,
        textContent,
        fileUrls,
        status: "pending_review",
        submittedAt: null,
        reviewedAt: null,
        createdAt: null,
        updatedAt: null,
      });
    } catch {
      setError("Something went wrong submitting your work. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState />;
  if (!assignment) return <p className="text-charcoal/50">Assignment not found.</p>;

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal">{assignment.title}</h1>
        {assignment.deadline && (
          <p className="mt-1 text-sm text-charcoal/50">
            Deadline: {new Date(assignment.deadline.toMillis()).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal/50">Instructions</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-charcoal/70">
          {assignment.instructions}
        </p>
      </div>

      {submission ? (
        <div className="rounded-2xl bg-ivory-deep p-6">
          <p className="font-medium text-charcoal">
            {submission.status === "reviewed" ? "Reviewed" : "Submitted \u2014 pending review"}
          </p>
          {submission.status === "reviewed" && (
            <div className="mt-3 space-y-1 text-sm text-charcoal/70">
              {typeof submission.score === "number" && <p>Score: {submission.score}%</p>}
              {submission.feedback && <p>Feedback: {submission.feedback}</p>}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/5">
          {(assignment.requiredSubmissionType === "text") && (
            <textarea
              name="textContent"
              rows={6}
              placeholder="Write your response here"
              className="w-full rounded-xl border border-sand px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
          )}
          {(assignment.requiredSubmissionType === "image" || assignment.requiredSubmissionType === "file") && (
            <input
              type="file"
              name="file"
              accept={assignment.requiredSubmissionType === "image" ? "image/*" : undefined}
              className="text-sm"
            />
          )}
          {error && <p className="text-sm text-accent-dark">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-fit">
            {submitting ? "Submitting..." : "Submit Assignment"}
          </Button>
        </form>
      )}
    </div>
  );
}
