import { serverTimestamp } from "firebase/firestore";
import { createDoc, getById, getList, orderBy, updateDocById, where } from "@/lib/firebase/firestore";
import type { Assignment, Submission } from "@/types";

/* Assignments ---------------------------------------------------------- */

export async function getAssignmentsForCourse(courseId: string): Promise<Assignment[]> {
  return getList<Assignment>("assignments", [where("courseId", "==", courseId)]);
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  return getById<Assignment>("assignments", id);
}

export async function createAssignment(
  data: Omit<Assignment, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDoc<Assignment>("assignments", data);
}

export async function updateAssignment(
  id: string,
  data: Partial<Omit<Assignment, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  return updateDocById<Assignment>("assignments", id, data);
}

/* Submissions ------------------------------------------------------------ */

export async function getSubmissionsForUser(userId: string): Promise<Submission[]> {
  return getList<Submission>("submissions", [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  ]);
}

export async function getSubmissionsForAssignment(assignmentId: string): Promise<Submission[]> {
  return getList<Submission>("submissions", [where("assignmentId", "==", assignmentId)]);
}

export async function submitAssignment(
  data: Omit<Submission, "id" | "createdAt" | "updatedAt" | "status" | "submittedAt" | "reviewedAt">
): Promise<string> {
  return createDoc<Submission>("submissions", {
    ...data,
    status: "pending_review",
    submittedAt: serverTimestamp() as unknown as Submission["submittedAt"],
    reviewedAt: null,
  });
}

export async function reviewSubmission(
  id: string,
  data: { score?: number; feedback?: string }
): Promise<void> {
  await updateDocById<Submission>("submissions", id, {
    ...data,
    status: "reviewed",
    reviewedAt: serverTimestamp() as unknown as Submission["reviewedAt"],
  });
}
