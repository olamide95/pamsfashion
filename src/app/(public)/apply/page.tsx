import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ApplyForm } from "@/components/shared/ApplyForm";
import { getPublishedCourses } from "@/lib/services/courses";

export const metadata: Metadata = {
  title: "Apply Now",
  description: "Apply to Pam's Fashion Academy — start your journey into fashion design, business and branding.",
};

export default async function ApplyPage() {
  const courses = await getPublishedCourses().catch(() => []);

  return (
    <section className="pt-32 pb-24 md:pt-40">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <SectionHeading
          eyebrow="Admissions"
          title="Apply to Pam's Fashion Academy"
          description="Tell us a little about yourself and the programme you're interested in. Our admissions team will follow up with next steps."
        />
        <ApplyForm courses={courses} />
      </Container>
    </section>
  );
}
