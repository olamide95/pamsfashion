"use client";

import { useEffect, useState } from "react";
import { getApplicationsForAdmin, updateApplicationStatus } from "@/lib/services/content";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Application, ApplicationStatus } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

const tabs: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [tab, setTab] = useState<ApplicationStatus | "all">("all");

  useEffect(() => {
    getApplicationsForAdmin().then((list) => {
      setApplications(list);
      setLoading(false);
    });
  }, []);

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    await updateApplicationStatus(id, status);
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const visible = tab === "all" ? applications : applications.filter((a) => a.status === tab);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal">Applications</h1>
        <p className="mt-1 text-charcoal/60">Review and respond to admissions applications.</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === t.value ? "bg-accent text-ivory" : "bg-white text-charcoal/60 ring-1 ring-black/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : visible.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visible.map((app) => (
            <div key={app.id} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="font-medium text-charcoal">{app.name}</p>
                  <p className="text-sm text-charcoal/60">{app.email} &middot; {app.phone}</p>
                  <p className="mt-1 text-sm text-charcoal/70">
                    Interested in: <span className="font-medium">{app.courseInterest}</span>
                  </p>
                  <p className="text-xs capitalize text-charcoal/50">
                    {app.preferredFormat} &middot; {app.preferredSchedule}
                  </p>
                  {app.message && <p className="mt-2 text-sm italic text-charcoal/60">&ldquo;{app.message}&rdquo;</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="rounded-lg border border-sand bg-white px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No applications" description="Applications submitted through the website will appear here." />
      )}
    </div>
  );
}
