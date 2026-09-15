import { createDoc, getList, orderBy, updateDocById, where } from "@/lib/firebase/firestore";
import type { Application, GalleryImage, Testimonial } from "@/types";

/* Testimonials --------------------------------------------------------- */

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  return getList<Testimonial>("testimonials", [
    where("published", "==", true),
    orderBy("order", "asc"),
  ]);
}

export async function getAllTestimonialsForAdmin(): Promise<Testimonial[]> {
  return getList<Testimonial>("testimonials", [orderBy("order", "asc")]);
}

/* Gallery ---------------------------------------------------------------- */

export async function getGalleryImages(
  category?: GalleryImage["category"]
): Promise<GalleryImage[]> {
  const constraints = category
    ? [where("category", "==", category), orderBy("order", "asc")]
    : [orderBy("order", "asc")];
  return getList<GalleryImage>("gallery", constraints);
}

/* Applications (Admissions) ---------------------------------------------- */

export async function submitApplication(
  data: Omit<Application, "id" | "createdAt" | "updatedAt" | "status">
): Promise<string> {
  return createDoc<Application>("applications", {
    ...data,
    status: "pending",
  });
}

export async function getApplicationsForAdmin(
  status?: Application["status"]
): Promise<Application[]> {
  const constraints = status
    ? [where("status", "==", status), orderBy("createdAt", "desc")]
    : [orderBy("createdAt", "desc")];
  return getList<Application>("applications", constraints);
}

export async function updateApplicationStatus(
  id: string,
  status: Application["status"]
): Promise<void> {
  return updateDocById<Application>("applications", id, { status });
}
