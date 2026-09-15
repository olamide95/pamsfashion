import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/shared/Reveal";
import type { GalleryImage } from "@/types";

export function GallerySection({ images }: { images: GalleryImage[] }) {
  return (
    <section className="bg-ivory-deep py-24 md:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Gallery"
              title="Life inside the academy"
              description="Classrooms, studios, showcases and the work our students are proud of."
            />
            <LinkButton href="/gallery" variant="ghost" className="hidden md:inline-flex">
              View full gallery &rarr;
            </LinkButton>
          </div>
        </Reveal>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {images.slice(0, 8).map((image, i) => (
              <Reveal
                key={image.id}
                delay={(i % 4) * 100}
                className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}
              >
                <div
                  className={`group relative overflow-hidden rounded-2xl bg-sand ${
                    i % 5 === 0 ? "aspect-square" : "aspect-square"
                  }`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.caption ?? "Pam's Fashion Academy gallery photo"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="The gallery is being curated"
            description="Photos from our studios, classes and showcases will appear here soon."
          />
        )}

        <LinkButton href="/gallery" variant="ghost" className="md:hidden">
          View full gallery &rarr;
        </LinkButton>
      </Container>
    </section>
  );
}
