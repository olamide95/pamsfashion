import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type CollectionReference,
  type DocumentData,
  type Firestore,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type { FirestoreDoc } from "@/types";

/**
 * Generic Firestore data-access helpers. UI components should never import
 * `firebase/firestore` directly — they call these (or the domain-specific
 * services in `lib/services`) so that query shape and error handling stay
 * consistent and testable in one place.
 *
 * Deliberately untyped at the Firestore SDK boundary (raw DocumentData
 * collections, cast to `T` on the way out): a generic `FirestoreDataConverter<T>`
 * fights the SDK's own generic constraints without adding real safety, since
 * the actual shape check happens in the domain services in `lib/services`.
 */

export function collectionRef(path: string, database: Firestore = db): CollectionReference<DocumentData> {
  return collection(database, path);
}

export async function getById<T extends FirestoreDoc>(
  path: string,
  id: string
): Promise<T | null> {
  const snap = await getDoc(doc(db, path, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function getList<T extends FirestoreDoc>(
  path: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collectionRef(path), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function createDoc<T extends FirestoreDoc>(
  path: string,
  data: Omit<T, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collectionRef(path), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocById<T extends FirestoreDoc>(
  path: string,
  id: string,
  data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const ref = doc(db, path, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocById(path: string, id: string): Promise<void> {
  await deleteDoc(doc(db, path, id));
}

export { orderBy, where };
