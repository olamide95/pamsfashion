import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { CourseEnrollCta } from "@/components/shared/CourseEnrollCta";
import { getCourseBySlug, getPublishedCourses } from "@/lib/services/courses";
import { getModulesForCourse, getLessonsForCourse, groupLessonsByModule } from "@/lib/services/curriculum";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = await getPublishedCourses().catch(() => []);
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug).catch(() => null);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: course.heroImageUrl ? [course.heroImageUrl] : undefined,
    },
  };
}

export default async function CourseDetailsPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug).catch(() => null);
  if (!course || course.status !== "published") notFound();

  const [modules, lessons] = await Promise.all([
    getModulesForCourse(course.id).catch(() => []),
    getLessonsForCourse(course.id).catch(() => []),
  ]);
  const curriculum = groupLessonsByModule(modules, lessons);

  const priceLabel = course.isFree
    ? "Free"
    : `${course.currency} ${course.price.toLocaleString()}`;

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 pb-24 text-ivory md:pt-40">
        <div className="absolute inset-0">
          <Image
            src={course.heroImageUrl || "/images/hero-placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
        </div>
        <Container className="relative flex flex-col gap-6">
          {course.category && (
            <span className="text-xs uppercase tracking-[0.3em] text-accent">
              {course.category}
            </span>
          )}
          <h1 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">
            {course.title}
          </h1>
          <p className="max-w-2xl text-lg text-ivory/75">{course.shortDescription}</p>
          <div className="flex flex-wrap gap-6 pt-2 text-sm text-ivory/70">
            <span>Duration: {course.duration}</span>
            <span className="capitalize">Format: {course.format}</span>
            {course.instructorName && <span>Instructor: {course.instructorName}</span>}
            <span>{priceLabel}</span>
          </div>
          <CourseEnrollCta course={course} size="lg" className="mt-4 w-fit" />
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-14">
            <div className="prose-none">
              <h2 className="font-display text-2xl text-charcoal">About this course</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-charcoal/70">
                {course.fullDescription}
              </p>
            </div>

            {course.outcomes.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-charcoal">What you&rsquo;ll learn</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-charcoal/75">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {curriculum.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-charcoal">Course modules</h2>
                <div className="mt-4 divide-y divide-sand rounded-2xl border border-sand">
                  {curriculum.map(({ module, lessons: moduleLessons }, i) => (
                    <div key={module.id} className="p-5">
                      <p className="text-xs uppercase tracking-[0.15em] text-accent">
                        Module {i + 1}
                      </p>
                      <p className="mt-1 font-display text-lg text-charcoal">{module.title}</p>
                      <p className="mt-1 text-sm text-charcoal/50">
                        {moduleLessons.length} lesson{moduleLessons.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.requirements.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-charcoal">Requirements</h2>
                <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
                  {course.requirements.map((r) => (
                    <li key={r}>&bull; {r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl bg-ivory-deep p-8">
            <p className="font-display text-3xl text-charcoal">{priceLabel}</p>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between border-b border-sand pb-3">
                <dt className="text-charcoal/50">Duration</dt>
                <dd className="text-charcoal">{course.duration}</dd>
              </div>
              <div className="flex justify-between border-b border-sand pb-3">
                <dt className="text-charcoal/50">Format</dt>
                <dd className="capitalize text-charcoal">{course.format}</dd>
              </div>
              {course.instructorName && (
                <div className="flex justify-between border-b border-sand pb-3">
                  <dt className="text-charcoal/50">Instructor</dt>
                  <dd className="text-charcoal">{course.instructorName}</dd>
                </div>
              )}
            </dl>
            <CourseEnrollCta course={course} className="mt-6 w-full" />
          </aside>
        </Container>
      </section>
    </>
  );
}
