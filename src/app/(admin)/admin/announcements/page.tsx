"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createAnnouncement, getAllAnnouncementsForAdmin, updateAnnouncement } from "@/lib/services/announcements";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Announcement } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal focus:border-accent focus:outline-none";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setAnnouncements(await getAllAnnouncementsForAdmin());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createAnnouncement({
      title: String(form.get("title") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
      published: true,
    });
    setModalOpen(false);
    load();
  }

  async function togglePublished(a: Announcement) {
    await updateAnnouncement(a.id, { published: !a.published });
    load();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-charcoal">Announcements</h1>
        <Button onClick={() => setModalOpen(true)}>New Announcement</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : announcements.length > 0 ? (
        <div className="flex flex-col gap-3">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-charcoal">{a.title}</p>
                <button onClick={() => togglePublished(a)} className="text-xs font-medium text-accent hover:underline">
                  {a.published ? "Unpublish" : "Publish"}
                </button>
              </div>
              <p className="mt-1 text-sm text-charcoal/60">{a.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No announcements yet" description="Publish an announcement to notify all students." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input name="title" placeholder="Title" required className={inputClass} />
          <textarea name="message" placeholder="Message" required rows={4} className={inputClass} />
          <Button type="submit" className="w-full">
            Publish Announcement
          </Button>
        </form>
      </Modal>
    </div>
  );
}
