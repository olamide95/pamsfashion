import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getGalleryImages } from "@/lib/services/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Pam's Fashion Academy classrooms, studios, events and fashion shows.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages().catch(() => []);

  return (
    <section className="pt-32 pb-24 md:pt-40">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Gallery"
          title="Life inside the academy"
          description="Classrooms, studios, events, student work and our fashion shows."
        />
        {images.length > 0 ? (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {images.map((image) => (
              <div key={image.id} className="break-inside-avoid overflow-hidden rounded-2xl bg-sand">
                <Image
                  src={image.imageUrl}
                  alt={image.caption ?? "Pam's Fashion Academy"}
                  width={600}
                  height={800}
                  className="w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="The gallery is being curated"
            description="Photos from our studios, classes and showcases will appear here soon."
          />
        )}
      </Container>
    </section>
  );
}
