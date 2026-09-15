import { getDocs, query, where } from "firebase/firestore";
import { collectionRef, createDoc, getById, getList, orderBy, updateDocById } from "@/lib/firebase/firestore";
import type { Course } from "@/types";

const COLLECTION = "courses";

export async function getPublishedCourses(): Promise<Course[]> {
  // No orderBy in the query: avoids the composite-index requirement and,
  // more importantly, avoids silently dropping docs that have no `order` field.
  // The where() is also load-bearing for security rules — /courses only
  // permits a list query that provably returns published docs.
  const courses = await getList<Course>(COLLECTION, [
    where("status", "==", "published"),
  ]);

  return courses.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// Unconstrained read — only permitted for signed-in staff. Callers must be
// behind an admin guard or this throws permission-denied.
export async function getAllCoursesForAdmin(): Promise<Course[]> {
  const courses = await getList<Course>(COLLECTION, []);
  return courses.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}



export async function getCourseById(id: string): Promise<Course | null> {
  return getById<Course>(COLLECTION, id);
}

export async function createCourse(
  data: Omit<Course, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDoc<Course>(COLLECTION, data);
}
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const snap = await getDocs(
    query(
      collectionRef(COLLECTION),
      where("slug", "==", slug),
      where("status", "==", "published")
    )
  );
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Course;
}
export async function updateCourse(
  id: string,
  data: Partial<Omit<Course, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  return updateDocById<Course>(COLLECTION, id, data);
}