"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getAllTestimonialsForAdmin } from "@/lib/services/content";
import { createDoc, deleteDocById, updateDocById } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Testimonial } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal focus:border-accent focus:outline-none";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setTestimonials(await getAllTestimonialsForAdmin());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createDoc<Testimonial>("testimonials", {
      studentName: String(form.get("studentName") ?? "").trim(),
      quote: String(form.get("quote") ?? "").trim(),
      courseTitle: String(form.get("courseTitle") ?? "").trim() || undefined,
      graduationYear: form.get("graduationYear") ? Number(form.get("graduationYear")) : undefined,
      published: true,
      order: testimonials.length,
    });
    setModalOpen(false);
    load();
  }

  async function togglePublished(t: Testimonial) {
    await updateDocById<Testimonial>("testimonials", t.id, { published: !t.published });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteDocById("testimonials", id);
    load();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-charcoal">Testimonials</h1>
        <Button onClick={() => setModalOpen(true)}>Add Testimonial</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : testimonials.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
              <p className="text-sm italic text-charcoal/70">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-3 text-sm font-medium text-charcoal">{t.studentName}</p>
              <div className="mt-4 flex gap-4 text-xs">
                <button onClick={() => togglePublished(t)} className="font-medium text-accent hover:underline">
                  {t.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => handleDelete(t.id)} className="font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No testimonials yet" description="Add a testimonial from a graduate to feature it on the site." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Testimonial">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input name="studentName" placeholder="Student name" required className={inputClass} />
          <textarea name="quote" placeholder="Testimonial" required rows={3} className={inputClass} />
          <input name="courseTitle" placeholder="Course (optional)" className={inputClass} />
          <input name="graduationYear" type="number" placeholder="Graduation year (optional)" className={inputClass} />
          <Button type="submit" className="w-full">
            Save Testimonial
          </Button>
        </form>
      </Modal>
    </div>
  );
}
