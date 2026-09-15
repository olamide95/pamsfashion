import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { getPublishedTestimonials } from "@/lib/services/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Hear from students of Pam's Fashion Academy about their learning journey.",
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials().catch(() => []);

  return (
    <section className="pt-32 pb-8 md:pt-40">
      <Container className="pb-14">
        <SectionHeading
          eyebrow="Testimonials"
          title="Stories from our students"
          align="center"
        />
      </Container>
      <TestimonialsSection testimonials={testimonials} />
    </section>
  );
}
