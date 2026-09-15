"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

const links = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/courses", label: "My Courses" },
  { href: "/courses", label: "Browse Courses" },
  { href: "/student/assignments", label: "Assignments" },
  { href: "/student/quizzes", label: "Quizzes" },
  { href: "/student/certificates", label: "Certificates" },
  { href: "/student/resources", label: "Resources" },
  { href: "/student/announcements", label: "Announcements" },
  { href: "/student/profile", label: "Profile" },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="flex h-full flex-col justify-between p-6" aria-label="Student navigation">
      <div className="flex flex-col gap-1">
        <Link href="/" className="mb-8 font-display text-lg text-charcoal">
          Pam&rsquo;s <span className="text-accent">Fashion Academy</span>
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
