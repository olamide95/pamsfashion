import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ivory-deep to-sand">
            <span className="font-display text-sm text-taupe">Pam&rsquo;s Fashion Academy</span>
          </div>
        )}
        {course.isFree ? (
          <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-charcoal">
            Free
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {course.category && (
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent">
            {course.category}
          </span>
        )}
        <h3 className="font-display text-xl text-charcoal">{course.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-charcoal/60">
          {course.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-charcoal/50">
          <span>{course.duration}</span>
          <span className="font-medium text-accent group-hover:underline">
            View course &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
