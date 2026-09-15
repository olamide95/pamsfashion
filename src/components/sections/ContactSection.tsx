import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";

export function ContactSection() {
  return (
    <section className="py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="Visit or Reach Us"
            title="We'd love to hear from you"
            description="Come see the studios in person, or reach out with any questions about our courses and the online school."
          />
        </Reveal>
        <Reveal delay={150}>
          <div className="flex flex-col gap-4 rounded-3xl bg-ivory-deep p-8 transition-shadow duration-300 hover:shadow-lg">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">Address</p>
              <p className="mt-1 text-charcoal/80">Ahmadu Bello Way, Kado, Abuja, Nigeria</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">Phone</p>
              <a href="tel:+2347049195181" className="mt-1 block text-charcoal/80 hover:text-accent">
                +234 704 919 5181
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent">Email</p>
              <a
                href="mailto:info@Pamsfashionacademy.com"
                className="mt-1 block text-charcoal/80 hover:text-accent"
              >
                info@Pamsfashionacademy.com
              </a>
            </div>
            <LinkButton href="/contact" variant="secondary" className="mt-2 w-fit">
              Get in touch
            </LinkButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
