"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { submitApplication } from "@/lib/services/content";
import type { Course, LearningFormat } from "@/types";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-accent focus:outline-none";

export function ApplyForm({ courses }: { courses: Course[] }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const courseInterest = String(form.get("courseInterest") ?? "").trim();
    const preferredFormat = form.get("preferredFormat") as LearningFormat;
    const preferredSchedule = form.get("preferredSchedule") as
      | "morning"
      | "evening"
      | "weekend";
    const message = String(form.get("message") ?? "").trim();

    if (!name || !email || !phone || !courseInterest) {
      setError("Please fill in your name, email, phone number and course of interest.");
      setStatus("error");
      return;
    }

    try {
      await submitApplication({
        name,
        email,
        phone,
        courseInterest,
        preferredFormat,
        preferredSchedule,
        message: message || undefined,
      });
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setError("Something went wrong submitting your application. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-ivory-deep p-10 text-center">
        <h2 className="font-display text-2xl text-charcoal">Application received</h2>
        <p className="mt-3 text-charcoal/70">
          Thank you for applying to Pam&rsquo;s Fashion Academy. Our admissions
          team will reach out to the email or phone number you provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-3xl bg-ivory-deep p-8 md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-charcoal">
            Full name
          </label>
          <input id="name" name="name" required className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-charcoal">
            Phone number
          </label>
          <input id="phone" name="phone" required className={inputClass} placeholder="+234..." />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
          Email address
        </label>
        <input id="email" name="email" type="email" required className={inputClass} placeholder="you@example.com" />
      </div>

      <div>
        <label htmlFor="courseInterest" className="mb-1.5 block text-sm font-medium text-charcoal">
          Course / programme
        </label>
        <select id="courseInterest" name="courseInterest" required className={inputClass} defaultValue="">
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.title}>
              {c.title}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet — please advise</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredFormat" className="mb-1.5 block text-sm font-medium text-charcoal">
            Preferred learning format
          </label>
          <select id="preferredFormat" name="preferredFormat" className={inputClass} defaultValue="physical">
            <option value="physical">Physical classes</option>
            <option value="online">Online course</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label htmlFor="preferredSchedule" className="mb-1.5 block text-sm font-medium text-charcoal">
            Preferred class schedule
          </label>
          <select id="preferredSchedule" name="preferredSchedule" className={inputClass} defaultValue="morning">
            <option value="morning">Morning (9:00 AM – 2:00 PM)</option>
            <option value="evening">Evening (2:00 PM – 6:00 PM)</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-charcoal">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          placeholder="Tell us a little about yourself and your goals"
        />
      </div>

      {error && <p className="text-sm text-accent-dark">{error}</p>}

      <Button type="submit" disabled={status === "submitting"} className="w-fit">
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
