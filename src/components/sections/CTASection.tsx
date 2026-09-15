import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-24 text-center text-ivory md:py-32">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[130px]"
      />
      <Container className="relative flex flex-col items-center gap-8">
        <Reveal variant="scale">
          <h2 className="max-w-2xl font-display text-3xl leading-[1.15] md:text-5xl">
            Turn Your Fashion Dreams Into Reality
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <LinkButton
            href="/apply"
            size="lg"
            className="transition-transform duration-300 hover:scale-105 hover:shadow-[0_8px_30px_-8px_var(--color-accent)]"
          >
            Apply Now
          </LinkButton>
        </Reveal>
      </Container>
    </section>
  );
}
