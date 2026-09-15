"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getEnrollment, enrollInFreeCourse } from "@/lib/services/enrollments";
import { LinkButton, Button } from "@/components/ui/Button";
import type { Course } from "@/types";

export function CourseEnrollCta({
  course,
  className = "",
  size = "md",
}: {
  course: Course;
  className?: string;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const { firebaseUser, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    getEnrollment(firebaseUser.uid, course.id).then((enrollment) => {
      if (!cancelled) {
        setEnrolled(!!enrollment);
        setChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, firebaseUser, course.id]);

  if (authLoading || checking) {
    return (
      <div className={`h-12 w-40 animate-pulse rounded-full bg-sand/60 ${className}`} aria-hidden />
    );
  }

  // Already enrolled (free or paid, staff-granted or self-serve) — go straight in.
  if (firebaseUser && enrolled) {
    return (
      <LinkButton href={`/student/courses/${course.id}`} size={size} className={className}>
        Continue Learning
      </LinkButton>
    );
  }

  // Signed in, free course, not yet enrolled — one-click self-enroll.
  if (firebaseUser && course.isFree) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          size={size}
          className={className}
          onClick={async () => {
            setError(null);
            setEnrolling(true);
            try {
              await enrollInFreeCourse(firebaseUser.uid, course);
              router.push(`/student/courses/${course.id}`);
            } catch {
              setError("Something went wrong enrolling you. Please try again.");
              setEnrolling(false);
            }
          }}
          disabled={enrolling}
        >
          {enrolling ? "Enrolling..." : "Enroll for Free"}
        </Button>
        {error && <p className="text-sm text-accent-dark">{error}</p>}
      </div>
    );
  }

  // Signed in, paid course, not yet enrolled — payment isn't wired up yet,
  // so route through the human-reviewed admissions flow (see README
  // "Future payment support").
  if (firebaseUser && !course.isFree) {
    return (
      <LinkButton href="/apply" size={size} className={className}>
        Apply to Enroll
      </LinkButton>
    );
  }

  // Not signed in at all.
  return (
    <LinkButton href="/register" size={size} className={className}>
      {course.isFree ? "Sign Up to Start Learning" : "Sign Up to Apply"}
    </LinkButton>
  );
}
