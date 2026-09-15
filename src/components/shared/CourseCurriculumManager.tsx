"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  createLesson,
  createModule,
  deleteLesson,
  deleteModule,
  getLessonsForCourse,
  getModulesForCourse,
  groupLessonsByModule,
  updateLesson,
} from "@/lib/services/curriculum";
import { getCourseById } from "@/lib/services/courses";
import { uploadFile, lessonVideoPath, lessonResourcePath } from "@/lib/firebase/storage";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Course, Lesson, LessonResource, Module } from "@/types";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-accent focus:outline-none";

export function CourseCurriculumManager() {
  const params = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [lessonModalModuleId, setLessonModalModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [savingLesson, setSavingLesson] = useState(false);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);

  async function load() {
    const [courseData, moduleData, lessonData] = await Promise.all([
      getCourseById(params.courseId),
      getModulesForCourse(params.courseId),
      getLessonsForCourse(params.courseId),
    ]);
    setCourse(courseData);
    setModules(moduleData);
    setLessons(lessonData);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.courseId]);

  async function handleAddModule() {
    if (!newModuleTitle.trim()) return;
    await createModule({
      courseId: params.courseId,
      title: newModuleTitle.trim(),
      order: modules.length,
    });
    setNewModuleTitle("");
    load();
  }

  async function handleDeleteModule(moduleId: string) {
    if (!confirm("Delete this module and its lessons list entry? Lessons inside it will remain but be unassigned.")) return;
    await deleteModule(moduleId);
    load();
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!confirm("Delete this lesson?")) return;
    await deleteLesson(lessonId);
    load();
  }

  async function handleSaveLesson(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!lessonModalModuleId) return;
    setSavingLesson(true);

    try {
      const form = new FormData(e.currentTarget);
      const title = String(form.get("title") ?? "").trim();
      const description = String(form.get("description") ?? "").trim();
      const textContent = String(form.get("textContent") ?? "").trim();
      const videoFile = form.get("video") as File | null;
      const resourceFile = form.get("resource") as File | null;
      const status = form.get("status") as Lesson["status"];

      const moduleLessons = lessons.filter((l) => l.moduleId === lessonModalModuleId);
      const lessonId = editingLesson?.id;

      let videoPath = editingLesson?.videoPath;
      if (videoFile && videoFile.size > 0) {
        const targetId = lessonId ?? crypto.randomUUID();
        videoPath = lessonVideoPath(params.courseId, targetId, videoFile.name);
        await uploadFile(videoPath, videoFile, setVideoProgress);
      }

      const resources: LessonResource[] = editingLesson?.resources ?? [];
      if (resourceFile && resourceFile.size > 0) {
        const targetId = lessonId ?? crypto.randomUUID();
        const path = lessonResourcePath(params.courseId, targetId, resourceFile.name);
        const url = await uploadFile(path, resourceFile);
        resources.push({
          name: resourceFile.name,
          url,
          type: resourceFile.type.includes("pdf") ? "pdf" : resourceFile.type.startsWith("image") ? "image" : "file",
        });
      }

      const payload = {
        courseId: params.courseId,
        moduleId: lessonModalModuleId,
        title,
        description,
        order: editingLesson?.order ?? moduleLessons.length,
        videoPath,
        contentBlocks: textContent ? [{ type: "text" as const, value: textContent }] : editingLesson?.contentBlocks ?? [],
        resources,
        status,
      };

      if (lessonId) {
        await updateLesson(lessonId, payload);
      } else {
        await createLesson(payload);
      }

      setLessonModalModuleId(null);
      setEditingLesson(null);
      load();
    } finally {
      setSavingLesson(false);
      setVideoProgress(null);
    }
  }

  if (loading) return <p className="text-charcoal/50">Loading&hellip;</p>;
  if (!course) return <p className="text-charcoal/50">Course not found.</p>;

  const groups = groupLessonsByModule(modules, lessons);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin/courses" className="text-xs text-accent hover:underline">
          &larr; Courses
        </Link>
        <h1 className="mt-1 font-display text-3xl text-charcoal">{course.title}</h1>
        <p className="text-charcoal/60">Manage modules and lessons for this course.</p>
      </div>

      <div className="flex gap-3">
        <input
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          placeholder="New module title, e.g. Introduction to Fashion Design"
          className={`${inputClass} max-w-md`}
        />
        <Button onClick={handleAddModule} variant="secondary">
          Add Module
        </Button>
      </div>

      {groups.length > 0 ? (
        <div className="flex flex-col gap-6">
          {groups.map(({ module, lessons: moduleLessons }, i) => (
            <div key={module.id} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-accent">Module {i + 1}</p>
                  <p className="font-display text-lg text-charcoal">{module.title}</p>
                </div>
                <div className="flex gap-3 text-xs">
                  <button
                    onClick={() => {
                      setEditingLesson(null);
                      setLessonModalModuleId(module.id);
                    }}
                    className="font-medium text-accent hover:underline"
                  >
                    Add Lesson
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete Module
                  </button>
                </div>
              </div>

              {moduleLessons.length > 0 ? (
                <ul className="divide-y divide-sand">
                  {moduleLessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{lesson.title}</p>
                        <p className="text-xs capitalize text-charcoal/50">
                          {lesson.status} {lesson.videoPath ? "\u00b7 has video" : ""}
                        </p>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <button
                          onClick={() => {
                            setEditingLesson(lesson);
                            setLessonModalModuleId(module.id);
                          }}
                          className="font-medium text-accent hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-charcoal/40">No lessons in this module yet.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No modules yet" description="Add your first module above to start building the curriculum." />
      )}

      <Modal
        open={!!lessonModalModuleId}
        onClose={() => {
          setLessonModalModuleId(null);
          setEditingLesson(null);
        }}
        title={editingLesson ? "Edit Lesson" : "Add Lesson"}
      >
        <form onSubmit={handleSaveLesson} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Lesson title</label>
            <input name="title" required defaultValue={editingLesson?.title} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Description</label>
            <textarea
              name="description"
              rows={3}
              required
              defaultValue={editingLesson?.description}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Text content (optional)</label>
            <textarea
              name="textContent"
              rows={3}
              defaultValue={editingLesson?.contentBlocks.find((b) => b.type === "text")?.value}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">
              Video {editingLesson?.videoPath && "(leave empty to keep current)"}
            </label>
            <input type="file" name="video" accept="video/*" className="text-sm" />
            {videoProgress !== null && (
              <p className="mt-1 text-xs text-charcoal/50">Uploading: {videoProgress}%</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Add a resource (PDF/file, optional)</label>
            <input type="file" name="resource" className="text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Status</label>
            <select name="status" defaultValue={editingLesson?.status ?? "draft"} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <Button type="submit" disabled={savingLesson} className="mt-2 w-full">
            {savingLesson ? "Saving..." : "Save Lesson"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
