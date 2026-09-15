import { getList, orderBy, updateDocById } from "@/lib/firebase/firestore";
import type { AppUser, UserRole } from "@/types";

export async function getAllUsers(): Promise<AppUser[]> {
  return getList<AppUser>("users", [orderBy("createdAt", "desc")]);
}

export async function getUsersByRole(role: UserRole): Promise<AppUser[]> {
  const all = await getAllUsers();
  return all.filter((u) => u.role === role);
}

/**
 * Elevates or changes a user's role. This only updates the Firestore
 * profile document. For routes/features gated by Firebase custom claims
 * (a stronger guarantee than a Firestore field), pair this with a Cloud
 * Function trigger — see README "Elevating a user to admin".
 */
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDocById<AppUser>("users", uid, { role });
}
