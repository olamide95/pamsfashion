import { createDoc, getList, orderBy, updateDocById, where } from "@/lib/firebase/firestore";
import type { Announcement } from "@/types";

export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  return getList<Announcement>("announcements", [
    where("published", "==", true),
    orderBy("createdAt", "desc"),
  ]);
}

export async function getAllAnnouncementsForAdmin(): Promise<Announcement[]> {
  return getList<Announcement>("announcements", [orderBy("createdAt", "desc")]);
}

export async function createAnnouncement(
  data: Omit<Announcement, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDoc<Announcement>("announcements", data);
}

export async function updateAnnouncement(
  id: string,
  data: Partial<Omit<Announcement, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  return updateDocById<Announcement>("announcements", id, data);
}
