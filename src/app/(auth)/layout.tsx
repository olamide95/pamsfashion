import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-deep px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 block text-center font-display text-2xl text-charcoal"
        >
          Pam&rsquo;s <span className="text-accent">Fashion Academy</span>
        </Link>
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
