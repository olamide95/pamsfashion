import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { CourseCard } from "@/components/shared/CourseCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/shared/Reveal";
import type { Course } from "@/types";

export function CoursesSection({ courses }: { courses: Course[] }) {
  return (
    <section className="py-24 md:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Courses &amp; Programmes"
              title="Choose the path that fits your ambition"
              description="From beginner fundamentals to running a fashion business — every course leads to a dedicated curriculum with real projects and mentorship."
            />
            <LinkButton href="/courses" variant="ghost" className="hidden md:inline-flex">
              View all courses &rarr;
            </LinkButton>
          </div>
        </Reveal>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.slice(0, 8).map((course, i) => (
              <Reveal key={course.id} delay={(i % 4) * 100}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Courses are being prepared"
            description="Our programmes will appear here as soon as they're published by the academy team."
          />
        )}

        <LinkButton href="/courses" variant="ghost" className="md:hidden">
          View all courses &rarr;
        </LinkButton>
      </Container>
    </section>
  );
}
