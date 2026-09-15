import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Pam's Fashion Academy in Abuja, Nigeria.",
};

export default function ContactPage() {
  return (
    <section className="pt-32 pb-24 md:pt-40">
      <Container className="grid gap-14 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Contact"
          title="We'd love to hear from you"
          description="Whether you have a question about a course, want to visit the studio, or are ready to apply — reach out any time."
        />

        <div className="flex flex-col gap-6 rounded-3xl bg-ivory-deep p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Address</p>
            <p className="mt-2 text-lg text-charcoal">Ahmadu Bello Way, Kado,</p>
            <p className="text-lg text-charcoal">Abuja, Nigeria</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Phone</p>
            <a href="tel:+2347049195181" className="mt-2 block text-lg text-charcoal hover:text-accent">
              +234 704 919 5181
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Email</p>
            <a
              href="mailto:info@Pamsfashionacademy.com"
              className="mt-2 block text-lg text-charcoal hover:text-accent"
            >
              info@Pamsfashionacademy.com
            </a>
          </div>
          <LinkButton href="/apply" className="mt-4 w-fit">
            Apply Now
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
