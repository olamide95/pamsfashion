import { getDocs, query, where as fbWhere } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { collectionRef, createDoc, getList, where } from "@/lib/firebase/firestore";
import type { Certificate } from "@/types";

/** Human-readable certificate ID, e.g. PFA-2026-000123. Not guaranteed
 * globally unique under extreme concurrency — acceptable at academy scale,
 * but a Cloud Function with a Firestore counter would be the hardened path. */
function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `PFA-${year}-${random}`;
}

export async function issueCertificate(
  data: Omit<Certificate, "id" | "createdAt" | "updatedAt" | "certificateId" | "issuedAt">
): Promise<string> {
  return createDoc<Certificate>("certificates", {
    ...data,
    certificateId: generateCertificateId(),
    issuedAt: serverTimestamp() as unknown as Certificate["issuedAt"],
  });
}

export async function getCertificatesForUser(userId: string): Promise<Certificate[]> {
  return getList<Certificate>("certificates", [where("userId", "==", userId)]);
}

/** Public lookup used by /verify-certificate/[certificateId] — readable by
 * anyone per the Firestore rules, since verification must work without login. */
export async function getCertificateByPublicId(certificateId: string): Promise<Certificate | null> {
  const snap = await getDocs(
    query(collectionRef("certificates"), fbWhere("certificateId", "==", certificateId))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Certificate;
}
