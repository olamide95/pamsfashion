import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseCard } from "@/components/shared/CourseCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedCourses } from "@/lib/services/courses";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Explore Pam's Fashion Academy's courses — from beginner fundamentals to fashion business, branding, sewing, pattern making and sustainable design.",
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses().catch((err) => {
    console.error("[CoursesPage] getPublishedCourses failed:", err);
    return [];
  });

  return (
    <section className="pt-32 pb-24 md:pt-40">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Courses &amp; Programmes"
          title="Every path starts somewhere"
          description="Whether you're picking up a needle for the first time or building a fashion brand, there's a course designed for where you are."
        />

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Courses are being prepared"
            description="Our programmes will appear here as soon as they're published by the academy team."
          />
        )}
      </Container>
    </section>
  );
}