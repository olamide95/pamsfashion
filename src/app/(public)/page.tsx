import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { WhyLearnSection } from "@/components/sections/WhyLearnSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { SustainableFashionSection } from "@/components/sections/SustainableFashionSection";
import { LearningOptionsSection } from "@/components/sections/LearningOptionsSection";
import { StudentExperienceSection } from "@/components/sections/StudentExperienceSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getPublishedCourses } from "@/lib/services/courses";
import { getGalleryImages, getPublishedTestimonials } from "@/lib/services/content";

// Revalidate periodically so admin edits (new courses, testimonials, gallery
// uploads) show up on the public site without needing a full redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const [courses, testimonials, gallery] = await Promise.all([
    getPublishedCourses().catch(() => []),
    getPublishedTestimonials().catch(() => []),
    getGalleryImages().catch(() => []),
  ]);

  // Real course/category names for the hero marquee — falls back to a
  // generic (still truthful) list inside MarqueeStrip if there's no
  // published content yet.
  const courseNames = Array.from(
    new Set(courses.map((c) => c.category || c.title))
  );

  return (
    <>
      <HeroSection courseCategories={courseNames} />
      <AboutSection />
      <WhyLearnSection />
      <CoursesSection courses={courses} />
      <SustainableFashionSection />
      <LearningOptionsSection />
      <StudentExperienceSection />
      <GallerySection images={gallery} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
      <ContactSection />
    </>
  );
}
