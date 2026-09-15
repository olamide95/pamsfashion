import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const pillars = [
  {
    title: "Professional Training",
    description:
      "Learn from experienced instructors with real industry expertise, through hands-on projects rather than theory alone.",
  },
  {
    title: "Modern Techniques",
    description:
      "Study traditional craftsmanship alongside modern fashion technology, tools and workflows used across the industry today.",
  },
  {
    title: "Industry Exposure",
    description:
      "Showcase your work, build a portfolio, and network with industry professionals and academy alumni.",
  },
  {
    title: "Creative Environment",
    description:
      "Work inside real design studios and sewing labs, supported by a community of aspiring designers and mentors.",
  },
];

export function WhyLearnSection() {
  return (
    <section className="bg-ivory-deep py-24 md:py-32">
      <Container className="flex flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Why Learn With Us"
            title="Everything you need to grow from hobbyist to professional"
            align="left"
          />
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-3xl bg-sand/60 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 100} className="h-full">
              <div className="group flex h-full flex-col gap-4 bg-ivory-deep p-8 transition-colors duration-300 hover:bg-white">
                <span className="font-display text-2xl text-accent transition-transform duration-300 group-hover:-translate-y-1">
                  0{i + 1}
                </span>
                <h3 className="font-display text-lg text-charcoal">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal/60">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
