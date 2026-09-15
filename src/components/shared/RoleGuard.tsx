"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";

/**
 * Client-side route gating. This improves UX (instant redirect, no flash of
 * protected content) but is NOT the security boundary — Firestore and
 * Storage security rules are what actually protect the data, since a user
 * can always reach these routes directly regardless of what the UI does.
 */
export function RoleGuard({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { firebaseUser, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/login");
      return;
    }
    if (profile && !allow.includes(profile.role)) {
      router.replace(profile.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    }
  }, [loading, firebaseUser, profile, allow, router]);

  if (loading || !firebaseUser || (profile && !allow.includes(profile.role))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory-deep">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-sand border-t-accent" />
          <p className="font-display text-lg text-charcoal/60">Pam&rsquo;s Fashion Academy</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
