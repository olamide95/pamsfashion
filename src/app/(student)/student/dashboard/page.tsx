"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEnrolledCourses } from "@/lib/services/enrollments";
import { getLessonsForCourse } from "@/lib/services/curriculum";
import { getProgressForCourse, summarizeCourseProgress } from "@/lib/services/progress";
import { getPublishedAnnouncements } from "@/lib/services/announcements";
import { getCertificatesForUser } from "@/lib/services/certificates";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import type { Announcement, Certificate, Course, CourseProgressSummary } from "@/types";

interface CourseWithProgress {
  course: Course;
  progress: CourseProgressSummary;
}

export default function StudentDashboardPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    async function load() {
      const enrolled = await getEnrolledCourses(profile!.uid);
      const withProgress = await Promise.all(
        enrolled.map(async ({ course }) => {
          const [lessons, progress] = await Promise.all([
            getLessonsForCourse(course.id),
            getProgressForCourse(profile!.uid, course.id),
          ]);
          return { course, progress: summarizeCourseProgress(lessons, progress) };
        })
      );
      const [announcementsList, certificatesList] = await Promise.all([
        getPublishedAnnouncements(),
        getCertificatesForUser(profile!.uid),
      ]);

      if (!cancelled) {
        setCourses(withProgress);
        setAnnouncements(announcementsList.slice(0, 3));
        setCertificates(certificatesList);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profile]);

  const continueCourse = courses.find((c) => c.progress.percentage < 100) ?? courses[0];

  if (loading) {
    return <LoadingState label="Loading your dashboard" />;
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl text-charcoal">
          Welcome back{profile?.displayName ? `, ${profile.displayName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-charcoal/60">Here&rsquo;s where you left off.</p>
      </div>

      {continueCourse ? (
        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-charcoal p-8 text-ivory md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Continue Learning</p>
            <p className="mt-2 font-display text-2xl">{continueCourse.course.title}</p>
            <p className="mt-1 text-sm text-ivory/60">
              {continueCourse.progress.completedLessons} / {continueCourse.progress.totalLessons} lessons &middot;{" "}
              {continueCourse.progress.percentage}% complete
            </p>
          </div>
          <LinkButton href={`/student/courses/${continueCourse.course.id}`} variant="primary">
            Continue
          </LinkButton>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <p className="text-xs uppercase tracking-[0.15em] text-accent">My Courses</p>
          <p className="mt-2 font-display text-3xl text-charcoal">{courses.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <p className="text-xs uppercase tracking-[0.15em] text-accent">Certificates Earned</p>
          <p className="mt-2 font-display text-3xl text-charcoal">{certificates.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <p className="text-xs uppercase tracking-[0.15em] text-accent">Average Progress</p>
          <p className="mt-2 font-display text-3xl text-charcoal">
            {courses.length === 0
              ? "0%"
              : `${Math.round(
                  courses.reduce((sum, c) => sum + c.progress.percentage, 0) / courses.length
                )}%`}
          </p>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-charcoal">My Courses</h2>
          <Link href="/student/courses" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        {courses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map(({ course, progress }) => (
              <Link
                key={course.id}
                href={`/student/courses/${course.id}`}
                className="rounded-2xl bg-white p-5 ring-1 ring-black/5 transition-shadow hover:shadow-md"
              >
                <p className="font-display text-lg text-charcoal">{course.title}</p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-sand">
                  <div
                    className="h-1.5 rounded-full bg-accent"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-charcoal/50">
                  {progress.completedLessons} / {progress.totalLessons} lessons &middot; {progress.percentage}%
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No courses yet" description="Enroll in a course to see it here." />
        )}
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl text-charcoal">Recent Announcements</h2>
        {announcements.length > 0 ? (
          <div className="flex flex-col gap-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
                <p className="font-medium text-charcoal">{a.title}</p>
                <p className="mt-1 text-sm text-charcoal/60">{a.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No announcements yet" description="School announcements will appear here." />
        )}
      </div>
    </div>
  );
}
