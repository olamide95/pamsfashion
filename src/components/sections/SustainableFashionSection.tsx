import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";

const pillars = [
  "Sustainable fabric selection",
  "Low-waste pattern making",
  "Natural dyeing techniques",
  "Ethical production practices",
];

export function SustainableFashionSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 text-ivory md:py-32">
      <div
        aria-hidden
        className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <Container className="relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="flex flex-col gap-6">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Sustainable Fashion
            </span>
            <h2 className="font-display text-3xl leading-[1.1] md:text-5xl">
              Designing for the industry&rsquo;s future, not just its trends
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-ivory/70">
              Our sustainable fashion and upcycling programmes teach the next
              generation of designers to work responsibly — reducing waste,
              respecting materials, and building brands that last.
            </p>
            <ul className="grid grid-cols-2 gap-3 pt-2 text-sm text-ivory/80">
              {pillars.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <LinkButton
              href="/courses"
              variant="outline-light"
              className="mt-4 w-fit transition-transform duration-300 hover:scale-[1.03]"
            >
              Explore Sustainable Fashion
            </LinkButton>
          </div>
        </Reveal>
        <Reveal delay={150} variant="scale">
          <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
            <Image
              src="/images/placeholder-editorial.svg"
              alt="Upcycled and sustainably made garments created by academy students"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
