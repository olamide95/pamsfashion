import type { Timestamp } from "firebase/firestore";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

export type UserRole = "student" | "admin" | "instructor";

export type LearningFormat = "online" | "physical" | "hybrid";

export type PublishStatus = "draft" | "published" | "archived";

export interface FirestoreDoc {
  id: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

/* -------------------------------------------------------------------------- */
/*  Users                                                                      */
/* -------------------------------------------------------------------------- */

export interface AppUser extends FirestoreDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  bio?: string; // used for instructors
}

/* -------------------------------------------------------------------------- */
/*  Courses / Modules / Lessons                                                */
/* -------------------------------------------------------------------------- */

export interface Course extends FirestoreDoc {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl?: string;
  heroImageUrl?: string;
  outcomes: string[]; // "What students will learn"
  requirements: string[];
  duration: string; // e.g. "8 weeks"
  format: LearningFormat;
  instructorId?: string;
  instructorName?: string;
  isFree: boolean;
  price: number; // 0 if free
  currency: string; // e.g. "NGN"
  status: PublishStatus;
  category?: string; // e.g. "Sustainable Fashion"
  order: number;
}

export interface Module extends FirestoreDoc {
  courseId: string;
  title: string;
  order: number;
}

export type LessonContentBlockType = "text" | "image" | "pdf";

export interface LessonContentBlock {
  type: LessonContentBlockType;
  value: string; // text content or storage URL
  caption?: string;
}

export interface LessonResource {
  name: string;
  url: string;
  type: "pdf" | "image" | "file";
}

export interface Lesson extends FirestoreDoc {
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  videoPath?: string; // Storage path, resolved to signed/download URL at render time
  videoDurationSeconds?: number;
  contentBlocks: LessonContentBlock[];
  resources: LessonResource[];
  quizId?: string;
  assignmentId?: string;
  status: PublishStatus;
}

/* -------------------------------------------------------------------------- */
/*  Enrollment / Progress                                                      */
/* -------------------------------------------------------------------------- */

export type PaymentStatus = "not_required" | "pending" | "paid" | "failed";
export type EnrollmentStatus = "active" | "completed" | "cancelled";

export interface Enrollment extends FirestoreDoc {
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  enrolledAt: Timestamp | null;
}

export interface LessonProgress extends FirestoreDoc {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  lastPositionSeconds: number;
  completedAt: Timestamp | null;
}

export interface CourseProgressSummary {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  lastLessonId?: string;
}

/* -------------------------------------------------------------------------- */
/*  Quizzes                                                                    */
/* -------------------------------------------------------------------------- */

export type QuizQuestionType = "multiple_choice" | "true_false";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: string[]; // for true_false: ["True", "False"]
  correctOptionIndex: number;
}

export interface Quiz extends FirestoreDoc {
  courseId: string;
  lessonId?: string;
  title: string;
  questions: QuizQuestion[];
  passScorePercentage: number;
}

export interface QuizAttempt extends FirestoreDoc {
  quizId: string;
  userId: string;
  courseId: string;
  answers: number[]; // option index per question
  scorePercentage: number;
  passed: boolean;
  submittedAt: Timestamp | null;
}

/* -------------------------------------------------------------------------- */
/*  Assignments                                                                */
/* -------------------------------------------------------------------------- */

export type SubmissionType = "text" | "image" | "file";
export type SubmissionStatus = "pending_review" | "reviewed";

export interface Assignment extends FirestoreDoc {
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  title: string;
  instructions: string;
  deadline: Timestamp | null;
  requiredSubmissionType: SubmissionType;
  status: PublishStatus;
}

export interface Submission extends FirestoreDoc {
  assignmentId: string;
  userId: string;
  courseId: string;
  textContent?: string;
  fileUrls: string[];
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  submittedAt: Timestamp | null;
  reviewedAt: Timestamp | null;
}

/* -------------------------------------------------------------------------- */
/*  Certificates                                                               */
/* -------------------------------------------------------------------------- */

export interface Certificate extends FirestoreDoc {
  certificateId: string; // human-readable public ID, e.g. PFA-2026-000123
  userId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorName?: string;
  issuedAt: Timestamp | null;
}

/* -------------------------------------------------------------------------- */
/*  Admissions                                                                 */
/* -------------------------------------------------------------------------- */

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Application extends FirestoreDoc {
  name: string;
  email: string;
  phone: string;
  courseInterest: string;
  preferredFormat: LearningFormat;
  preferredSchedule: "morning" | "evening" | "weekend";
  message?: string;
  status: ApplicationStatus;
}

/* -------------------------------------------------------------------------- */
/*  Content: Gallery / Testimonials / Announcements                           */
/* -------------------------------------------------------------------------- */

export type GalleryCategory =
  | "classrooms"
  | "studios"
  | "events"
  | "student_work"
  | "fashion_shows";

export interface GalleryImage extends FirestoreDoc {
  imageUrl: string;
  category: GalleryCategory;
  caption?: string;
  order: number;
}

export interface Testimonial extends FirestoreDoc {
  studentName: string;
  photoUrl?: string;
  quote: string;
  courseTitle?: string;
  graduationYear?: number;
  published: boolean;
  order: number;
}

export interface Announcement extends FirestoreDoc {
  title: string;
  message: string;
  courseId?: string; // optional: scoped to one course
  published: boolean;
}
