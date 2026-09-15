"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { getAllCoursesForAdmin, updateCourse } from "@/lib/services/courses";
import { adminEnrollStudent } from "@/lib/services/enrollments";
import { getUsersByRole } from "@/lib/services/users";
import { CourseFormModal } from "@/components/shared/CourseFormModal";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { AppUser, Course } from "@/types";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal focus:border-accent focus:outline-none";

export default function AdminCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<AppUser[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [enrollingCourse, setEnrollingCourse] = useState<Course | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);

  async function load() {
    const [courseList, studentList] = await Promise.all([
      getAllCoursesForAdmin(),
      getUsersByRole("student"),
    ]);
    setCourses(courseList);
    setStudents(studentList);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(course: Course, status: Course["status"]) {
    await updateCourse(course.id, { status });
    setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, status } : c)));
  }

  async function handleEnroll(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enrollingCourse) return;
    setEnrolling(true);
    setEnrollMessage(null);
    const form = new FormData(e.currentTarget);
    const student = students.find((s) => s.uid === form.get("userId"));
    const paymentStatus = form.get("paymentStatus") as "paid" | "not_required";

    if (!student) {
      setEnrolling(false);
      return;
    }

    await adminEnrollStudent(student.uid, enrollingCourse, paymentStatus);
    setEnrollMessage(`${student.displayName} now has access to ${enrollingCourse.title}.`);
    setEnrolling(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Courses</h1>
          <p className="mt-1 text-charcoal/60">Create and manage every course on the site.</p>
        </div>
        <Button
          onClick={() => {
            setEditingCourse(undefined);
            setModalOpen(true);
          }}
        >
          Create Course
        </Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : courses.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-sand text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Format</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-5 py-4 font-medium text-charcoal">{course.title}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        course.status === "published"
                          ? "bg-green-100 text-green-700"
                          : course.status === "draft"
                            ? "bg-ivory-deep text-charcoal/60"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 capitalize text-charcoal/70">{course.format}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-3 text-xs">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setModalOpen(true);
                        }}
                        className="font-medium text-accent hover:underline"
                      >
                        Edit
                      </button>
                      <Link
                        href={`/admin/courses/${course.id}/lessons`}
                        className="font-medium text-accent hover:underline"
                      >
                        Manage Lessons
                      </Link>
                      <button
                        onClick={() => {
                          setEnrollMessage(null);
                          setEnrollingCourse(course);
                        }}
                        className="font-medium text-accent hover:underline"
                      >
                        Enroll Student
                      </button>
                      {course.status === "published" ? (
                        <button
                          onClick={() => toggleStatus(course, "draft")}
                          className="font-medium text-charcoal/60 hover:underline"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(course, "published")}
                          className="font-medium text-charcoal/60 hover:underline"
                        >
                          Publish
                        </button>
                      )}
                      {course.status !== "archived" && (
                        <button
                          onClick={() => toggleStatus(course, "archived")}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No courses yet" description="Create your first course to get started." />
      )}

      <CourseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        course={editingCourse}
        nextOrder={courses.length}
      />

      <Modal
        open={!!enrollingCourse}
        onClose={() => setEnrollingCourse(null)}
        title={`Enroll a Student — ${enrollingCourse?.title ?? ""}`}
      >
        {enrollingCourse && (
          <form onSubmit={handleEnroll} className="flex flex-col gap-4">
            <p className="text-sm text-charcoal/60">
              Use this after approving an application or confirming payment
              outside the site (e.g. bank transfer) — it grants the student
              immediate access to this course&rsquo;s lessons.
            </p>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal">Student</label>
              <select name="userId" required className={inputClass}>
                {students.map((s) => (
                  <option key={s.uid} value={s.uid}>
                    {s.displayName} ({s.email})
                  </option>
                ))}
              </select>
            </div>
            {!enrollingCourse.isFree && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal">
                  Payment status
                </label>
                <select name="paymentStatus" defaultValue="paid" className={inputClass}>
                  <option value="paid">Paid</option>
                  <option value="not_required">Waived / not required</option>
                </select>
              </div>
            )}
            {enrollMessage && <p className="text-sm text-green-700">{enrollMessage}</p>}
            <Button type="submit" disabled={enrolling} className="w-full">
              {enrolling ? "Enrolling..." : "Grant Access"}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
