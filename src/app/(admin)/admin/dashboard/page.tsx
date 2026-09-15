"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllUsers } from "@/lib/services/users";
import { getAllCoursesForAdmin } from "@/lib/services/courses";
import { getApplicationsForAdmin } from "@/lib/services/content";
import { getList } from "@/lib/firebase/firestore";
import type { Certificate, Submission } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

interface Stats {
  totalStudents: number;
  activeStudents: number;
  courses: number;
  applications: number;
  assignmentsPendingReview: number;
  certificatesIssued: number;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [users, courses, applications, submissions, certificates] = await Promise.all([
        getAllUsers(),
        getAllCoursesForAdmin(),
        getApplicationsForAdmin(),
        getList<Submission>("submissions"),
        getList<Certificate>("certificates"),
      ]);

      const students = users.filter((u) => u.role === "student");

      if (!cancelled) {
        setStats({
          totalStudents: students.length,
          activeStudents: students.length, // all registered students are considered active for now
          courses: courses.length,
          applications: applications.filter((a) => a.status === "pending").length,
          assignmentsPendingReview: submissions.filter((s) => s.status === "pending_review").length,
          certificatesIssued: certificates.length,
        });
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = stats
    ? [
        { label: "Total Students", value: stats.totalStudents, href: "/admin/students" },
        { label: "Active Students", value: stats.activeStudents, href: "/admin/students" },
        { label: "Courses", value: stats.courses, href: "/admin/courses" },
        { label: "Pending Applications", value: stats.applications, href: "/admin/applications" },
        { label: "Assignments to Review", value: stats.assignmentsPendingReview, href: "/admin/assignments" },
        { label: "Certificates Issued", value: stats.certificatesIssued, href: "/admin/certificates" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal">Dashboard</h1>
        <p className="mt-1 text-charcoal/60">An overview of the academy right now.</p>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl bg-white p-6 ring-1 ring-black/5 transition-shadow hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-accent">{card.label}</p>
              <p className="mt-2 font-display text-4xl text-charcoal">{card.value}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
