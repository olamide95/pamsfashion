"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { createCourse, updateCourse } from "@/lib/services/courses";
import { uploadFile, courseThumbnailPath } from "@/lib/firebase/storage";
import type { Course, LearningFormat } from "@/types";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-accent focus:outline-none";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CourseFormModal({
  open,
  onClose,
  onSaved,
  course,
  nextOrder,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  course?: Course;
  nextOrder: number;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const form = new FormData(e.currentTarget);
      const title = String(form.get("title") ?? "").trim();
      const isFree = form.get("isFree") === "on";
      const thumbnailFile = form.get("thumbnail") as File | null;

      let thumbnailUrl = course?.thumbnailUrl;
      if (thumbnailFile && thumbnailFile.size > 0) {
        thumbnailUrl = await uploadFile(
          courseThumbnailPath(course?.id ?? slugify(title), thumbnailFile.name),
          thumbnailFile,
          setUploadProgress
        );
      }

      const payload = {
        slug: course?.slug || slugify(title),
        title,
        shortDescription: String(form.get("shortDescription") ?? "").trim(),
        fullDescription: String(form.get("fullDescription") ?? "").trim(),
        thumbnailUrl,
        outcomes: String(form.get("outcomes") ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: String(form.get("requirements") ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        duration: String(form.get("duration") ?? "").trim(),
        format: form.get("format") as LearningFormat,
        instructorName: String(form.get("instructorName") ?? "").trim() || undefined,
        isFree,
        price: isFree ? 0 : Number(form.get("price") ?? 0),
        currency: String(form.get("currency") ?? "NGN"),
        status: form.get("status") as Course["status"],
        category: String(form.get("category") ?? "").trim() || undefined,
        order: course?.order ?? nextOrder,
      };

      if (course) {
        await updateCourse(course.id, payload);
      } else {
        await createCourse(payload);
      }
      onSaved();
      onClose();
    } catch {
      setError("Something went wrong saving this course. Please try again.");
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={course ? "Edit Course" : "Create Course"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Title</label>
          <input name="title" required defaultValue={course?.title} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Category (optional)</label>
          <input
            name="category"
            defaultValue={course?.category}
            placeholder="e.g. Sustainable Fashion"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Short description</label>
          <textarea
            name="shortDescription"
            required
            rows={2}
            defaultValue={course?.shortDescription}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Full description</label>
          <textarea
            name="fullDescription"
            required
            rows={4}
            defaultValue={course?.fullDescription}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">
            What students will learn (one per line)
          </label>
          <textarea
            name="outcomes"
            rows={3}
            defaultValue={course?.outcomes.join("\n")}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Requirements (one per line)</label>
          <textarea
            name="requirements"
            rows={2}
            defaultValue={course?.requirements.join("\n")}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Duration</label>
            <input
              name="duration"
              required
              placeholder="e.g. 8 weeks"
              defaultValue={course?.duration}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Format</label>
            <select name="format" defaultValue={course?.format ?? "physical"} className={inputClass}>
              <option value="physical">Physical</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Instructor (optional)</label>
          <input name="instructorName" defaultValue={course?.instructorName} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" name="isFree" defaultChecked={course?.isFree ?? true} />
            Free course
          </label>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Price</label>
            <input
              name="price"
              type="number"
              min={0}
              defaultValue={course?.price ?? 0}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Status</label>
          <select name="status" defaultValue={course?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">
            Thumbnail image {course?.thumbnailUrl && "(leave empty to keep current)"}
          </label>
          <input type="file" name="thumbnail" accept="image/*" className="text-sm" />
          {uploadProgress !== null && (
            <p className="mt-1 text-xs text-charcoal/50">Uploading: {uploadProgress}%</p>
          )}
        </div>

        {error && <p className="text-sm text-accent-dark">{error}</p>}

        <Button type="submit" disabled={saving} className="mt-2 w-full">
          {saving ? "Saving..." : course ? "Save Changes" : "Create Course"}
        </Button>
      </form>
    </Modal>
  );
}
