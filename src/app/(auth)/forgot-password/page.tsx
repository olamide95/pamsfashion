"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { getAuthErrorMessage, requestPasswordReset } from "@/lib/firebase/auth";

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-accent focus:outline-none";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const email = String(new FormData(e.currentTarget).get("email") ?? "");

    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h1 className="font-display text-2xl text-charcoal">Check your email</h1>
        <p className="text-sm text-charcoal/60">
          If an account exists for that email, we&rsquo;ve sent a link to reset your password.
        </p>
        <Link href="/login" className="text-sm font-medium text-accent hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-charcoal">Reset your password</h1>
        <p className="mt-1 text-sm text-charcoal/60">
          Enter your email and we&rsquo;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-charcoal">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>

        {error && <p className="text-sm text-accent-dark" role="alert">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-center text-sm text-charcoal/60">
        <Link href="/login" className="font-medium text-accent hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
