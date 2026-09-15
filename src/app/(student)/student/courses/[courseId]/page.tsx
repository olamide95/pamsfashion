"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getCourseById } from "@/lib/services/courses";
import {
  getLessonsForCourse,
  getModulesForCourse,
  groupLessonsByModule,
} from "@/lib/services/curriculum";
import {
  getProgressForCourse,
  markLessonComplete,
  saveVideoPosition,
} from "@/lib/services/progress";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { CourseCurriculumSidebar } from "@/components/shared/CourseCurriculumSidebar";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import type { Course, Lesson, LessonProgress, Module } from "@/types";

export default function CourseLearningPage() {
  const params = useParams<{ courseId: string }>();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const lastSaveRef = useRef(0);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    (async () => {
      const [courseData, moduleData, lessonData, progressData] = await Promise.all([
        getCourseById(params.courseId),
        getModulesForCourse(params.courseId),
        getLessonsForCourse(params.courseId),
        getProgressForCourse(profile.uid, params.courseId),
      ]);

      if (cancelled) return;

      setCourse(courseData);
      setModules(moduleData);
      setLessons(lessonData);
      setProgress(progressData);

      const completedIds = new Set(progressData.filter((p) => p.completed).map((p) => p.lessonId));
      const firstIncomplete = lessonData.find((l) => !completedIds.has(l.id));
      setActiveLesson(firstIncomplete ?? lessonData[0] ?? null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [profile, params.courseId]);

  const groups = useMemo(() => groupLessonsByModule(modules, lessons), [modules, lessons]);
  const completedLessonIds = useMemo(
    () => new Set(progress.filter((p) => p.completed).map((p) => p.lessonId)),
    [progress]
  );
  const activeLessonProgress = progress.find((p) => p.lessonId === activeLesson?.id);

  function handleProgress(positionSeconds: number) {
    if (!profile || !activeLesson) return;
    // Throttle writes to roughly once every 10 seconds of playback.
    if (positionSeconds - lastSaveRef.current < 10) return;
    lastSaveRef.current = positionSeconds;
    saveVideoPosition(profile.uid, params.courseId, activeLesson.id, positionSeconds);
  }

  async function handleNearComplete() {
    if (!profile || !activeLesson) return;
    await markLessonComplete(profile.uid, params.courseId, activeLesson.id);
    setProgress((prev) => [
      ...prev.filter((p) => p.lessonId !== activeLesson.id),
      {
        id: `${profile.uid}_${activeLesson.id}`,
        userId: profile.uid,
        courseId: params.courseId,
        lessonId: activeLesson.id,
        completed: true,
        lastPositionSeconds: 0,
        completedAt: null,
        createdAt: null,
        updatedAt: null,
      },
    ]);
  }

  function goToLesson(offset: number) {
    if (!activeLesson) return;
    const index = lessons.findIndex((l) => l.id === activeLesson.id);
    const next = lessons[index + offset];
    if (next) setActiveLesson(next);
  }

  if (loading) return <LoadingState label="Loading course" />;
  if (!course) return <p className="text-charcoal/50">Course not found.</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/student/courses" className="text-xs text-accent hover:underline">
            &larr; My Courses
          </Link>
          <h1 className="mt-1 font-display text-2xl text-charcoal md:text-3xl">{course.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {activeLesson ? (
            <>
              {activeLesson.videoPath ? (
                <VideoPlayer
                  key={activeLesson.id}
                  videoPath={activeLesson.videoPath}
                  startAtSeconds={activeLessonProgress?.lastPositionSeconds ?? 0}
                  onProgress={handleProgress}
                  onNearComplete={handleNearComplete}
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-ivory-deep text-sm text-charcoal/50">
                  This lesson has no video — see the content below.
                </div>
              )}

              <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
                <h2 className="font-display text-xl text-charcoal">{activeLesson.title}</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-charcoal/70">
                  {activeLesson.description}
                </p>

                {activeLesson.resources.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-charcoal">Resources</h3>
                    <ul className="mt-2 flex flex-col gap-2">
                      {activeLesson.resources.map((r) => (
                        <li key={r.url}>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-accent hover:underline"
                          >
                            {r.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {activeLesson.quizId && (
                    <Link
                      href={`/student/quizzes/${activeLesson.quizId}`}
                      className="rounded-full bg-ivory-deep px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-sand"
                    >
                      Take Quiz
                    </Link>
                  )}
                  {activeLesson.assignmentId && (
                    <Link
                      href={`/student/assignments/${activeLesson.assignmentId}`}
                      className="rounded-full bg-ivory-deep px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-sand"
                    >
                      View Assignment
                    </Link>
                  )}
                  {!completedLessonIds.has(activeLesson.id) && (
                    <Button variant="secondary" onClick={handleNearComplete}>
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => goToLesson(-1)}
                  disabled={lessons.findIndex((l) => l.id === activeLesson.id) === 0}
                >
                  &larr; Previous
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => goToLesson(1)}
                  disabled={lessons.findIndex((l) => l.id === activeLesson.id) === lessons.length - 1}
                >
                  Next &rarr;
                </Button>
              </div>
            </>
          ) : (
            <p className="text-charcoal/50">This course doesn&rsquo;t have any lessons published yet.</p>
          )}
        </div>

        <CourseCurriculumSidebar
          groups={groups}
          completedLessonIds={completedLessonIds}
          activeLessonId={activeLesson?.id ?? ""}
          onSelect={setActiveLesson}
        />
      </div>
    </div>
  );
}
