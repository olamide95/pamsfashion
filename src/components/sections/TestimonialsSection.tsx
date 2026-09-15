import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/shared/Reveal";
import type { Testimonial } from "@/types";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-white p-8 ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl">
      <blockquote className="font-display text-lg leading-relaxed text-charcoal">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-sand">
          {testimonial.photoUrl && (
            <Image
              src={testimonial.photoUrl}
              alt={testimonial.studentName}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">{testimonial.studentName}</p>
          <p className="text-xs text-charcoal/50">
            {[testimonial.courseTitle, testimonial.graduationYear]
              .filter(Boolean)
              .join(" \u00b7 ")}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-24 md:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Hear from our students"
            align="center"
          />
        </Reveal>
        {testimonials.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t.id} delay={i * 120}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Student stories are coming soon"
            description="As our students graduate and share their journeys, their stories will appear here."
          />
        )}
      </Container>
    </section>
  );
}
