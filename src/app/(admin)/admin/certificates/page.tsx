"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getUsersByRole } from "@/lib/services/users";
import { getAllCoursesForAdmin } from "@/lib/services/courses";
import { getList } from "@/lib/firebase/firestore";
import { issueCertificate } from "@/lib/services/certificates";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AppUser, Certificate, Course } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-accent focus:outline-none";

export default function AdminCertificatesPage() {
  const [students, setStudents] = useState<AppUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);

  async function load() {
    const [studentList, courseList, certList] = await Promise.all([
      getUsersByRole("student"),
      getAllCoursesForAdmin(),
      getList<Certificate>("certificates"),
    ]);
    setStudents(studentList);
    setCourses(courseList);
    setCertificates(certList);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleIssue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIssuing(true);
    const form = new FormData(e.currentTarget);
    const student = students.find((s) => s.uid === form.get("userId"));
    const course = courses.find((c) => c.id === form.get("courseId"));
    if (!student || !course) {
      setIssuing(false);
      return;
    }

    await issueCertificate({
      userId: student.uid,
      studentName: student.displayName,
      courseId: course.id,
      courseTitle: course.title,
      instructorName: course.instructorName,
    });
    setIssuing(false);
    setModalOpen(false);
    load();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Certificates</h1>
          <p className="mt-1 text-charcoal/60">Issue and track certificates of completion.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Issue Certificate</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : certificates.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-sand text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Certificate ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {certificates.map((cert) => (
                <tr key={cert.id}>
                  <td className="px-5 py-4 font-medium text-charcoal">{cert.studentName}</td>
                  <td className="px-5 py-4 text-charcoal/70">{cert.courseTitle}</td>
                  <td className="px-5 py-4 text-xs text-charcoal/50">{cert.certificateId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No certificates issued yet" description="Issue your first certificate once a student completes a course." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Issue Certificate">
        <form onSubmit={handleIssue} className="flex flex-col gap-4">
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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Course</label>
            <select name="courseId" required className={inputClass}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={issuing} className="w-full">
            {issuing ? "Issuing..." : "Issue Certificate"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
