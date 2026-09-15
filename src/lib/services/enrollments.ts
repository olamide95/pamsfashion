import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getList, orderBy, where } from "@/lib/firebase/firestore";
import type { Course, Enrollment } from "@/types";
import { getCourseById } from "./courses";

function enrollmentId(userId: string, courseId: string) {
  return `${userId}_${courseId}`;
}

export async function getEnrollmentsForUser(userId: string): Promise<Enrollment[]> {
  return getList<Enrollment>("enrollments", [
    where("userId", "==", userId),
    orderBy("enrolledAt", "desc"),
  ]);
}

export async function getEnrollment(
  userId: string,
  courseId: string
): Promise<Enrollment | null> {
  const snap = await getDoc(doc(db, "enrollments", enrollmentId(userId, courseId)));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Enrollment, "id">) };
}

/**
 * Self-service enrollment for a FREE course only — creates the record with
 * paymentStatus "not_required", which the Firestore rules require in order
 * to accept a student-created (rather than staff-created) enrollment. Do
 * not call this for a paid course; the write will be rejected by the
 * rules, by design (see firestore.rules) — route paid-course sign-ups
 * through /apply instead, until payment processing exists.
 */
export async function enrollInFreeCourse(userId: string, course: Course): Promise<void> {
  if (!course.isFree) {
    throw new Error("enrollInFreeCourse called with a paid course — this is not allowed.");
  }
  const ref = doc(db, "enrollments", enrollmentId(userId, course.id));
  await setDoc(ref, {
    userId,
    courseId: course.id,
    status: "active",
    paymentStatus: "not_required",
    enrolledAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Staff-only: grants a student access to any course (free or paid),
 * typically used after approving an admissions application or confirming
 * an offline/manual payment. Firestore rules restrict this write to
 * admins/instructors regardless of what paymentStatus is passed in.
 */
export async function adminEnrollStudent(
  userId: string,
  course: Course,
  paymentStatus: Enrollment["paymentStatus"] = course.isFree ? "not_required" : "paid"
): Promise<void> {
  const ref = doc(db, "enrollments", enrollmentId(userId, course.id));
  await setDoc(ref, {
    userId,
    courseId: course.id,
    status: "active",
    paymentStatus,
    enrolledAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Enrolled courses for a student, joined with course details, dropping any
 * course that's been deleted or unpublished since enrollment. */
export async function getEnrolledCourses(userId: string): Promise<
  { enrollment: Enrollment; course: Course }[]
> {
  const enrollments = await getEnrollmentsForUser(userId);
  const results = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = await getCourseById(enrollment.courseId);
      return course ? { enrollment, course } : null;
    })
  );
  return results.filter((r): r is { enrollment: Enrollment; course: Course } => r !== null);
}
