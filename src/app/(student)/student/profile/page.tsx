"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { requestPasswordReset, updateOwnProfile } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-accent focus:outline-none";

export default function StudentProfilePage() {
  const { profile, firebaseUser, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const form = new FormData(e.currentTarget);

    await updateOwnProfile({
      displayName: String(form.get("displayName") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      bio: String(form.get("bio") ?? "").trim(),
    });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
  }

  if (!profile || !firebaseUser) return <LoadingState />;

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <h1 className="font-display text-3xl text-charcoal">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl bg-white p-8 ring-1 ring-black/5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
            Email
          </label>
          <input id="email" value={firebaseUser.email ?? ""} disabled className={`${inputClass} bg-ivory-deep`} />
        </div>
        <div>
          <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium text-charcoal">
            Full name
          </label>
          <input id="displayName" name="displayName" defaultValue={profile.displayName} className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-charcoal">
            Phone
          </label>
          <input id="phone" name="phone" defaultValue={profile.phone ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-charcoal">
            About you
          </label>
          <textarea id="bio" name="bio" rows={3} defaultValue={profile.bio ?? ""} className={inputClass} />
        </div>

        {saved && <p className="text-sm text-green-700">Profile updated.</p>}

        <Button type="submit" disabled={saving} className="w-fit">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      <div className="rounded-3xl bg-ivory-deep p-8">
        <h2 className="font-medium text-charcoal">Password</h2>
        <p className="mt-1 text-sm text-charcoal/60">
          We&rsquo;ll email you a secure link to reset your password.
        </p>
        {resetSent ? (
          <p className="mt-3 text-sm text-green-700">Reset link sent — check your email.</p>
        ) : (
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => firebaseUser.email && requestPasswordReset(firebaseUser.email).then(() => setResetSent(true))}
          >
            Send Password Reset Email
          </Button>
        )}
      </div>
    </div>
  );
}
