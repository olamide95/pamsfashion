"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEnrolledCourses } from "@/lib/services/enrollments";
import { getLessonsForCourse } from "@/lib/services/curriculum";
import { getProgressForCourse, summarizeCourseProgress } from "@/lib/services/progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import type { Course, CourseProgressSummary } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

export default function MyCoursesPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<{ course: Course; progress: CourseProgressSummary }[]>([]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    (async () => {
      const enrolled = await getEnrolledCourses(profile.uid);
      const withProgress = await Promise.all(
        enrolled.map(async ({ course }) => {
          const [lessons, progress] = await Promise.all([
            getLessonsForCourse(course.id),
            getProgressForCourse(profile.uid, course.id),
          ]);
          return { course, progress: summarizeCourseProgress(lessons, progress) };
        })
      );
      if (!cancelled) {
        setCourses(withProgress);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-charcoal">My Courses</h1>
        <LinkButton href="/courses" variant="ghost">
          Browse more courses
        </LinkButton>
      </div>

      {loading ? (
        <LoadingState />
      ) : courses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ course, progress }) => (
            <Link
              key={course.id}
              href={`/student/courses/${course.id}`}
              className="flex flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-black/5 transition-shadow hover:shadow-md"
            >
              <p className="font-display text-xl text-charcoal">{course.title}</p>
              <div className="h-1.5 w-full rounded-full bg-sand">
                <div className="h-1.5 rounded-full bg-accent" style={{ width: `${progress.percentage}%` }} />
              </div>
              <p className="text-sm text-charcoal/60">
                {progress.percentage}% Complete &middot; {progress.completedLessons} / {progress.totalLessons} lessons
              </p>
              <span className="mt-auto text-sm font-medium text-accent">Continue Learning &rarr;</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses yet"
          description="Browse the academy's courses and enroll to start learning."
          action={
            <LinkButton href="/courses" variant="secondary" className="mt-2">
              Browse Courses
            </LinkButton>
          }
        />
      )}
    </div>
  );
}
