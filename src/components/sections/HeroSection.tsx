import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MarqueeStrip } from "@/components/shared/MarqueeStrip";

export function HeroSection({ courseCategories = [] }: { courseCategories?: string[] }) {
  return (
    <section className="relative overflow-hidden bg-charcoal">
      {/* Layered background: image + gradient + soft accent glow */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-placeholder.svg"
          alt="A Pam's Fashion Academy student draping fabric on a mannequin in the design studio"
          fill
          priority
          className="animate-reveal object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        <div
          aria-hidden
          className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-accent/25 blur-[140px]"
        />
      </div>

      <Container className="relative flex min-h-[92vh] flex-col justify-end gap-8 pb-16 pt-40 md:pb-20">
        <div className="flex animate-fade-up items-center gap-2 [animation-delay:0.1s]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-ivory/70">
            Abuja, Nigeria &middot; A home for fashion makers
          </span>
        </div>

        <h1 className="max-w-4xl font-display text-5xl leading-[1.03] text-ivory md:text-[5.5rem]">
          <span className="block animate-fade-up [animation-delay:0.2s]">Unleash Your</span>
          <span className="block animate-fade-up italic text-accent [animation-delay:0.35s]">
            Fashion Potential
          </span>
        </h1>

        <p className="max-w-xl animate-fade-up text-base leading-relaxed text-ivory/80 [animation-delay:0.5s] md:text-lg">
          Pam&rsquo;s Fashion Academy turns passion into a profession &mdash;
          through hands-on training, modern technique and a community of
          makers who push each other forward.
        </p>

        <div className="flex animate-fade-up flex-col gap-4 [animation-delay:0.65s] sm:flex-row">
          <LinkButton
            href="/apply"
            size="lg"
            className="transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_8px_30px_-8px_var(--color-accent)]"
          >
            Apply Now
          </LinkButton>
          <LinkButton
            href="/courses"
            variant="outline-light"
            size="lg"
            className="transition-transform duration-300 hover:scale-[1.03]"
          >
            Explore Courses
          </LinkButton>
        </div>

        <a
          href="#about-academy"
          aria-label="Scroll to learn more"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ivory/50 transition-colors hover:text-ivory sm:flex"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-9 w-px animate-[float_2s_ease-in-out_infinite] bg-gradient-to-b from-ivory/60 to-transparent" />
        </a>
      </Container>

      <MarqueeStrip items={courseCategories} />
    </section>
  );
}
