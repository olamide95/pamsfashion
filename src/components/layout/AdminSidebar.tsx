"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/firebase/auth";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/assignments", label: "Assignments" },
  { href: "/admin/quizzes", label: "Quizzes" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex h-full flex-col justify-between p-6" aria-label="Admin navigation">
      <div className="flex flex-col gap-1">
        <Link href="/" className="mb-8 font-display text-lg text-charcoal">
          Pam&rsquo;s <span className="text-accent">Fashion Academy</span>
          <span className="ml-2 rounded-full bg-charcoal px-2 py-0.5 text-[10px] uppercase tracking-wide text-ivory">
            Admin
          </span>
        </Link>
        {links.map((link) => {
          const active = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-accent-soft text-accent-dark"
                  : "text-charcoal/70 hover:translate-x-0.5 hover:bg-ivory-deep"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
              )}
              {link.label}
            </Link>
          );
        })}
      </div>
      <button
        onClick={async () => {
          await logout();
          router.push("/");
        }}
        className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-charcoal/60 hover:bg-ivory-deep"
      >
        Logout
      </button>
    </nav>
  );
}
