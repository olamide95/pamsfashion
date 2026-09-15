import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

export function AboutSection() {
  return (
    <section id="about-academy" className="py-24 md:py-32 scroll-mt-20">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal variant="scale">
          <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
            <Image
              src="/images/placeholder-editorial.svg"
              alt="Students working in the Pam's Fashion Academy design studio"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-ivory/90 px-5 py-4 backdrop-blur-sm">
              <p className="font-display text-lg text-charcoal">Since day one</p>
              <p className="text-sm text-charcoal/60">
                Traditional technique, modern tools, one studio.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="About the Academy"
              title="A home for fashion makers, from first sketch to finished collection"
              description="Pam&rsquo;s Fashion Academy is dedicated to nurturing creativity and skill in the world of fashion. Our courses equip students with the knowledge and hands-on experience needed to excel in the industry — combining traditional technique with modern innovation, and helping every student find their own voice and vision."
            />
            <ul className="grid grid-cols-2 gap-4 pt-2 text-sm text-charcoal/70">
              {["Design studios", "Sewing labs", "Resource library", "Mentorship programmes"].map(
                (item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-ivory-deep px-4 py-3 transition-colors duration-300 hover:bg-accent-soft hover:text-accent-dark"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
