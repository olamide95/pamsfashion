"use client";

import { useEffect, useState } from "react";
import { getAllUsers, setUserRole } from "@/lib/services/users";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AppUser, UserRole } from "@/types";
import { LoadingState } from "@/components/ui/LoadingState";

export default function AdminStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers().then((list) => {
      setUsers(list);
      setLoading(false);
    });
  }, []);

  async function handleRoleChange(uid: string, role: UserRole) {
    setUpdatingId(uid);
    await setUserRole(uid, role);
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
    setUpdatingId(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-charcoal">Students</h1>
        <p className="mt-1 text-charcoal/60">
          Manage every registered account and adjust roles when needed.
        </p>
      </div>

      {loading ? (
        <LoadingState />
      ) : users.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-sand text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {users.map((user) => (
                <tr key={user.uid}>
                  <td className="px-5 py-4 font-medium text-charcoal">{user.displayName}</td>
                  <td className="px-5 py-4 text-charcoal/70">{user.email}</td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      disabled={updatingId === user.uid}
                      onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                      className="rounded-lg border border-sand bg-white px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No students yet" description="Registered students will appear here." />
      )}
    </div>
  );
}
