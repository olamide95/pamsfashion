"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { getGalleryImages } from "@/lib/services/content";
import { createDoc, deleteDocById } from "@/lib/firebase/firestore";
import { uploadFile, galleryImagePath } from "@/lib/firebase/storage";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { GalleryCategory, GalleryImage } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal focus:border-accent focus:outline-none";

const categories: { value: GalleryCategory; label: string }[] = [
  { value: "classrooms", label: "Classrooms" },
  { value: "studios", label: "Studios" },
  { value: "events", label: "Events" },
  { value: "student_work", label: "Student Work" },
  { value: "fashion_shows", label: "Fashion Shows" },
];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  async function load() {
    setImages(await getGalleryImages());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const form = new FormData(e.currentTarget);
    const category = form.get("category") as GalleryCategory;
    const caption = String(form.get("caption") ?? "").trim();
    const file = form.get("image") as File | null;

    if (file && file.size > 0) {
      const imageUrl = await uploadFile(galleryImagePath(category, `${Date.now()}-${file.name}`), file, setProgress);
      await createDoc<GalleryImage>("gallery", {
        imageUrl,
        category,
        caption: caption || undefined,
        order: images.length,
      });
      e.currentTarget.reset();
      load();
    }
    setUploading(false);
    setProgress(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this image from the gallery?")) return;
    await deleteDocById("gallery", id);
    load();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl text-charcoal">Gallery</h1>

      <form onSubmit={handleUpload} className="grid gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/5 sm:grid-cols-[1fr_1fr_auto]">
        <select name="category" className={inputClass}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input type="file" name="image" accept="image/*" required className="text-sm" />
        <input name="caption" placeholder="Caption (optional)" className={inputClass} />
        <Button type="submit" disabled={uploading} className="sm:col-span-3 w-fit">
          {uploading ? `Uploading${progress !== null ? ` ${progress}%` : "..."}` : "Upload Image"}
        </Button>
      </form>

      {loading ? (
        <LoadingState />
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-sand">
              <Image src={img.imageUrl} alt={img.caption ?? ""} fill className="object-cover" />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No images yet" description="Upload photos from classrooms, studios and events." />
      )}
    </div>
  );
}
