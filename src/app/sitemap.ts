import type { MetadataRoute } from "next";
import { getPublishedCourses } from "@/lib/services/courses";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pamsfashionacademy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/courses",
    "/online-school",
    "/gallery",
    "/testimonials",
    "/contact",
    "/apply",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const courses = await getPublishedCourses().catch(() => []);
  const courseRoutes = courses.map((course) => ({
    url: `${siteUrl}/courses/${course.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...courseRoutes];
}
