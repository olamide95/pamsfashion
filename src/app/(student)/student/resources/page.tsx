"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEnrolledCourses } from "@/lib/services/enrollments";
import { getLessonsForCourse } from "@/lib/services/curriculum";
import { EmptyState } from "@/components/ui/EmptyState";
import type { LessonResource } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

interface ResourceRow extends LessonResource {
  lessonTitle: string;
  courseTitle: string;
}

export default function StudentResourcesPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<ResourceRow[]>([]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    (async () => {
      const enrolled = await getEnrolledCourses(profile.uid);
      const perCourse = await Promise.all(
        enrolled.map(async ({ course }) => {
          const lessons = await getLessonsForCourse(course.id);
          return lessons.flatMap((lesson) =>
            lesson.resources.map((r) => ({ ...r, lessonTitle: lesson.title, courseTitle: course.title }))
          );
        })
      );
      if (!cancelled) {
        setResources(perCourse.flat());
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl text-charcoal">Resources</h1>

      {loading ? (
        <LoadingState />
      ) : resources.length > 0 ? (
        <div className="flex flex-col gap-3">
          {resources.map((r, i) => (
            <a
              key={`${r.url}-${i}`}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between gap-1 rounded-2xl bg-white p-5 ring-1 ring-black/5 hover:shadow-md sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-medium text-charcoal">{r.name}</p>
                <p className="text-xs text-charcoal/50">
                  {r.courseTitle} &middot; {r.lessonTitle}
                </p>
              </div>
              <span className="text-sm font-medium text-accent">Download &rarr;</span>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState title="No resources yet" description="Downloadable materials from your lessons will appear here." />
      )}
    </div>
  );
}
