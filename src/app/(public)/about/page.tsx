import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhyLearnSection } from "@/components/sections/WhyLearnSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "About the Academy",
  description:
    "Pam's Fashion Academy nurtures creativity and skill in fashion — combining traditional technique with modern innovation.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-20 md:pt-40">
        <Container className="flex flex-col gap-14">
          <SectionHeading
            eyebrow="About Us"
            title="Nurturing creativity and skill in the world of fashion"
            description="Pam's Fashion Academy provides comprehensive courses designed to equip students with the knowledge and experience needed to excel in the fashion industry. We combine traditional fashion techniques with modern innovations, and focus on helping every student develop their own style and vision."
          />
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl">
            <Image
              src="/images/placeholder-editorial.svg"
              alt="Pam's Fashion Academy studio"
              fill
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Experienced instructors with industry expertise",
            "Hands-on learning with practical projects",
            "Supportive community of aspiring designers",
            "Access to modern fashion technology and resources",
            "Opportunities to showcase student work",
            "Networking with industry professionals and alumni",
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-ivory-deep p-6 text-charcoal/80">
              {item}
            </div>
          ))}
        </Container>
      </section>

      <WhyLearnSection />
      <CTASection />
    </>
  );
}
