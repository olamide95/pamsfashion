"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEnrolledCourses } from "@/lib/services/enrollments";
import { getAssignmentsForCourse } from "@/lib/services/assignments";
import { getSubmissionsForUser } from "@/lib/services/assignments";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Assignment, Submission } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

interface Row {
  assignment: Assignment;
  courseTitle: string;
  submission?: Submission;
}

export default function StudentAssignmentsPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    (async () => {
      const enrolled = await getEnrolledCourses(profile.uid);
      const submissions = await getSubmissionsForUser(profile.uid);

      const perCourse = await Promise.all(
        enrolled.map(async ({ course }) => {
          const assignments = await getAssignmentsForCourse(course.id);
          return assignments
            .filter((a) => a.status === "published")
            .map((assignment) => ({
              assignment,
              courseTitle: course.title,
              submission: submissions.find((s) => s.assignmentId === assignment.id),
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
      <h1 className="font-display text-3xl text-charcoal">Assignments</h1>

      {loading ? (
        <LoadingState />
      ) : rows.length > 0 ? (
        <div className="flex flex-col gap-3">
          {rows.map(({ assignment, courseTitle, submission }) => (
            <Link
              key={assignment.id}
              href={`/student/assignments/${assignment.id}`}
              className="flex flex-col justify-between gap-2 rounded-2xl bg-white p-5 ring-1 ring-black/5 hover:shadow-md sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-medium text-charcoal">{assignment.title}</p>
                <p className="text-xs text-charcoal/50">{courseTitle}</p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  !submission
                    ? "bg-accent-soft text-accent-dark"
                    : submission.status === "reviewed"
                      ? "bg-green-100 text-green-700"
                      : "bg-ivory-deep text-charcoal/60"
                }`}
              >
                {!submission ? "Not submitted" : submission.status === "reviewed" ? "Reviewed" : "Pending review"}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No assignments waiting for you" description="Assignments from your courses will appear here." />
      )}
    </div>
  );
}
