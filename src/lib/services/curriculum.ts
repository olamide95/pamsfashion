import { createDoc, getList, orderBy, updateDocById, where } from "@/lib/firebase/firestore";
import { getById, deleteDocById } from "@/lib/firebase/firestore";
import type { Lesson, Module } from "@/types";

/* Modules ------------------------------------------------------------------ */

export async function getModulesForCourse(courseId: string): Promise<Module[]> {
  return getList<Module>("modules", [
    where("courseId", "==", courseId),
    orderBy("order", "asc"),
  ]);
}

export async function createModule(
  data: Omit<Module, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDoc<Module>("modules", data);
}

export async function updateModule(
  id: string,
  data: Partial<Omit<Module, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  return updateDocById<Module>("modules", id, data);
}

export async function deleteModule(id: string): Promise<void> {
  return deleteDocById("modules", id);
}

/* Lessons -------------------------------------------------------------------- */

export async function getLessonsForModule(moduleId: string): Promise<Lesson[]> {
  return getList<Lesson>("lessons", [
    where("moduleId", "==", moduleId),
    orderBy("order", "asc"),
  ]);
}

export async function getLessonsForCourse(courseId: string): Promise<Lesson[]> {
  return getList<Lesson>("lessons", [
    where("courseId", "==", courseId),
    orderBy("order", "asc"),
  ]);
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  return getById<Lesson>("lessons", id);
}

export async function createLesson(
  data: Omit<Lesson, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDoc<Lesson>("lessons", data);
}

export async function updateLesson(
  id: string,
  data: Partial<Omit<Lesson, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  return updateDocById<Lesson>("lessons", id, data);
}

export async function deleteLesson(id: string): Promise<void> {
  return deleteDocById("lessons", id);
}

/** Groups published lessons by their module, in module + lesson order — the
 * shape the curriculum sidebar on the learning page renders directly. */
export function groupLessonsByModule(
  modules: Module[],
  lessons: Lesson[]
): { module: Module; lessons: Lesson[] }[] {
  return modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((module) => ({
      module,
      lessons: lessons
        .filter((l) => l.moduleId === module.id)
        .sort((a, b) => a.order - b.order),
    }));
}
