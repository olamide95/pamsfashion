import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const items = [
  "Practical, project-based learning",
  "A creative, collaborative environment",
  "Real client and portfolio projects",
  "Direct industry exposure",
  "One-on-one mentorship",
  "Fashion showcases for your work",
];

export function StudentExperienceSection() {
  return (
    <section className="py-24 md:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Student Experience"
            title="What it feels like to learn here"
            align="center"
          />
        </Reveal>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item} delay={(i % 2) * 100}>
              <div className="group flex items-center gap-4 border-b border-sand pb-4 text-left transition-colors duration-300 hover:border-accent">
                <span className="font-display text-lg text-accent transition-transform duration-300 group-hover:scale-110">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base text-charcoal/80">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
