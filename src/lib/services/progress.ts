import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getList, where } from "@/lib/firebase/firestore";
import type { CourseProgressSummary, Lesson, LessonProgress } from "@/types";

function progressId(userId: string, lessonId: string) {
  return `${userId}_${lessonId}`;
}

export async function getProgressForCourse(
  userId: string,
  courseId: string
): Promise<LessonProgress[]> {
  return getList<LessonProgress>("lessonProgress", [
    where("userId", "==", userId),
    where("courseId", "==", courseId),
  ]);
}

export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LessonProgress | null> {
  const snap = await getDoc(doc(db, "lessonProgress", progressId(userId, lessonId)));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<LessonProgress, "id">) };
}

/** Records last watched position without marking the lesson complete. Called
 * periodically while a video plays — never on page open alone. */
export async function saveVideoPosition(
  userId: string,
  courseId: string,
  lessonId: string,
  positionSeconds: number
): Promise<void> {
  const ref = doc(db, "lessonProgress", progressId(userId, lessonId));
  await setDoc(
    ref,
    {
      userId,
      courseId,
      lessonId,
      lastPositionSeconds: positionSeconds,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Marks a lesson complete. Intended to be called when the video has actually
 * played to (or near) its end, or the student explicitly clicks
 * "Mark as Complete" — never automatically just because the lesson page
 * was opened.
 */
export async function markLessonComplete(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<void> {
  const ref = doc(db, "lessonProgress", progressId(userId, lessonId));
  const existing = await getDoc(ref);
  await setDoc(
    ref,
    {
      userId,
      courseId,
      lessonId,
      completed: true,
      completedAt: serverTimestamp(),
      createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function summarizeCourseProgress(
  lessons: Lesson[],
  progress: LessonProgress[]
): CourseProgressSummary {
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => completedIds.has(l.id)).length;
  return {
    courseId: lessons[0]?.courseId ?? "",
    totalLessons,
    completedLessons,
    percentage: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
  };
}
