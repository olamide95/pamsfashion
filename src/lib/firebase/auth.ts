import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./config";
import type { AppUser, UserRole } from "@/types";

/**
 * Creates the Firestore user profile document for a newly registered account.
 * Role defaults to "student" — elevation to admin/instructor is done manually
 * by an existing admin (see README: "Create admin user"), never client-side.
 */
async function createUserProfile(user: User, displayName: string) {
  const ref = doc(db, "users", user.uid);
  const profile: Omit<AppUser, "id" | "createdAt" | "updatedAt"> = {
    uid: user.uid,
    email: user.email ?? "",
    displayName,
    role: "student" as UserRole,
  };
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await createUserProfile(credential.user, name);
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logout() {
  await firebaseSignOut(auth);
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function fetchUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<AppUser, "id">) };
}

export async function updateOwnProfile(
  data: Partial<Pick<AppUser, "displayName" | "phone" | "bio">>
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in.");

  if (data.displayName) {
    await updateProfile(user, { displayName: data.displayName });
  }
  await setDoc(
    doc(db, "users", user.uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/** Maps Firebase Auth error codes to friendly, user-facing messages. */
export function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}
