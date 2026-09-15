"use client";

import type { Lesson, Module } from "@/types";

interface Props {
  groups: { module: Module; lessons: Lesson[] }[];
  completedLessonIds: Set<string>;
  activeLessonId: string;
  onSelect: (lesson: Lesson) => void;
}

export function CourseCurriculumSidebar({ groups, completedLessonIds, activeLessonId, onSelect }: Props) {
  return (
    <nav
      aria-label="Course curriculum"
      className="thin-scrollbar max-h-[70vh] overflow-y-auto rounded-2xl bg-white ring-1 ring-black/5"
    >
      {groups.map(({ module, lessons }, mi) => (
        <div key={module.id} className="border-b border-sand last:border-b-0">
          <p className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/50">
            Module {mi + 1} &middot; {module.title}
          </p>
          <ul>
            {lessons.map((lesson) => {
              const completed = completedLessonIds.has(lesson.id);
              const active = lesson.id === activeLessonId;
              return (
                <li key={lesson.id}>
                  <button
                    onClick={() => onSelect(lesson)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors ${
                      active ? "bg-accent-soft text-accent-dark" : "text-charcoal/75 hover:bg-ivory-deep"
                    }`}
                  >
                    <span aria-hidden className="w-4 shrink-0 text-center">
                      {completed ? "\u2713" : active ? "\u25B6" : "\u25CB"}
                    </span>
                    <span className="line-clamp-1">{lesson.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
