import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CertificateLookupForm } from "@/components/shared/CertificateLookupForm";

export const metadata: Metadata = {
  title: "Verify a Certificate",
};

export default function VerifyCertificateLandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-deep px-6 py-24">
      <Container className="max-w-md">
        <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-black/5">
          <p className="font-display text-xl text-charcoal">Pam&rsquo;s Fashion Academy</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-accent">Certificate Verification</p>
          <p className="mt-4 text-sm text-charcoal/60">
            Enter a certificate ID (e.g. PFA-2026-000123) to verify it.
          </p>
          <CertificateLookupForm />
        </div>
      </Container>
    </div>
  );
}
