"use client";

import { useEffect, useState } from "react";
import { getPublishedAnnouncements } from "@/lib/services/announcements";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Announcement } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

export default function StudentAnnouncementsPage() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    getPublishedAnnouncements().then((list) => {
      setAnnouncements(list);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl text-charcoal">Announcements</h1>

      {loading ? (
        <LoadingState />
      ) : announcements.length > 0 ? (
        <div className="flex flex-col gap-3">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
              <p className="font-display text-lg text-charcoal">{a.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{a.message}</p>
              {a.createdAt && (
                <p className="mt-3 text-xs text-charcoal/40">
                  {new Date(a.createdAt.toMillis()).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No announcements yet" description="School announcements will appear here." />
      )}
    </div>
  );
}
