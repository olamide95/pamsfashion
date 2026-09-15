import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getCertificateByPublicId } from "@/lib/services/certificates";

interface Props {
  params: Promise<{ certificateId: string }>;
}

export const metadata: Metadata = {
  title: "Verify a Certificate",
  robots: { index: false },
};

export default async function VerifyCertificatePage({ params }: Props) {
  const { certificateId } = await params;
  const certificate = await getCertificateByPublicId(certificateId).catch(() => null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-deep px-6 py-24">
      <Container className="max-w-xl">
        <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-black/5">
          <p className="font-display text-xl text-charcoal">Pam&rsquo;s Fashion Academy</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-accent">Certificate Verification</p>

          {certificate ? (
            <div className="mt-8 flex flex-col gap-3">
              <span className="mx-auto w-fit rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                Verified
              </span>
              <p className="mt-4 font-display text-2xl text-charcoal">{certificate.studentName}</p>
              <p className="text-charcoal/70">has successfully completed</p>
              <p className="font-display text-xl text-accent">{certificate.courseTitle}</p>
              {certificate.issuedAt && (
                <p className="mt-2 text-sm text-charcoal/50">
                  Issued {new Date(certificate.issuedAt.toMillis()).toLocaleDateString()}
                </p>
              )}
              <p className="mt-4 text-xs text-charcoal/40">Certificate ID: {certificate.certificateId}</p>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-3">
              <span className="mx-auto w-fit rounded-full bg-red-100 px-4 py-1 text-sm font-medium text-red-700">
                Not Found
              </span>
              <p className="text-charcoal/60">
                We couldn&rsquo;t find a certificate with ID &ldquo;{certificateId}&rdquo;. Please check
                the ID and try again.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
