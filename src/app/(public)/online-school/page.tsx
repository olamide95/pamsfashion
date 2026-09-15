import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { CourseCard } from "@/components/shared/CourseCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedCourses } from "@/lib/services/courses";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Online School",
  description:
    "Learn fashion design from anywhere through Pam's Fashion Academy's online school — video lessons, quizzes, assignments and certificates.",
};

export default async function OnlineSchoolPage() {
  const courses = (await getPublishedCourses().catch(() => [])).filter(
    (c) => c.format === "online" || c.format === "hybrid"
  );

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 pb-24 text-ivory md:pt-40 md:pb-32">
        <Container className="flex flex-col gap-6">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Online School</span>
          <h1 className="max-w-2xl font-display text-4xl leading-tight md:text-6xl">
            Learn fashion design from anywhere
          </h1>
          <p className="max-w-xl text-lg text-ivory/70">
            Video lessons, hands-on assignments, quizzes and certificates —
            the same Pam&rsquo;s Fashion Academy curriculum, on your schedule.
          </p>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <LinkButton href="/register" size="lg">
              Create a student account
            </LinkButton>
            <LinkButton href="/login" variant="outline-light" size="lg">
              Login
            </LinkButton>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow="Available Online"
            title="Courses you can start today"
          />
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Online courses are coming soon"
              description="Our online curriculum is being prepared — check back shortly."
            />
          )}
        </Container>
      </section>
    </>
  );
}
