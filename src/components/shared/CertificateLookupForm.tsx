"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function CertificateLookupForm() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/verify-certificate/${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="PFA-2026-000123"
        className="w-full rounded-xl border border-sand px-4 py-3 text-center text-sm focus:border-accent focus:outline-none"
      />
      <Button type="submit" className="w-full">
        Verify Certificate
      </Button>
    </form>
  );
}
