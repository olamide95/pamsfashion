"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCertificatesForUser } from "@/lib/services/certificates";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Certificate } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

export default function StudentCertificatesPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    getCertificatesForUser(profile.uid).then((list) => {
      if (!cancelled) {
        setCertificates(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [profile]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-3xl text-charcoal">Certificates</h1>

      {loading ? (
        <LoadingState />
      ) : certificates.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">Certificate of Completion</p>
              <p className="mt-3 font-display text-xl text-charcoal">{cert.courseTitle}</p>
              <p className="mt-1 text-sm text-charcoal/50">
                Issued{" "}
                {cert.issuedAt ? new Date(cert.issuedAt.toMillis()).toLocaleDateString() : ""}
              </p>
              <p className="mt-4 text-xs text-charcoal/40">ID: {cert.certificateId}</p>
              <Link
                href={`/verify-certificate/${cert.certificateId}`}
                className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
              >
                View &amp; verify &rarr;
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="You haven't earned a certificate yet"
          description="Complete a course's lessons, quizzes and assignments to earn your certificate."
        />
      )}
    </div>
  );
}
