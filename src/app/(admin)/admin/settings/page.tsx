"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AdminSettingsPage() {
  const { profile, firebaseUser } = useAuth();

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <h1 className="font-display text-3xl text-charcoal">Settings</h1>

      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="font-medium text-charcoal">Your admin account</h2>
        <dl className="mt-4 space-y-2 text-sm text-charcoal/70">
          <div className="flex justify-between">
            <dt>Name</dt>
            <dd>{profile?.displayName}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Email</dt>
            <dd>{firebaseUser?.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Role</dt>
            <dd className="capitalize">{profile?.role}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl bg-ivory-deep p-6 text-sm text-charcoal/60">
        <p>
          Academy-wide settings (contact details, social links, homepage hero image) are
          managed by editing the relevant content in Courses, Gallery and Testimonials for
          now. A dedicated Website Content editor for static sections can be added here as
          a future enhancement — see the README for suggested next steps.
        </p>
      </div>
    </div>
  );
}
