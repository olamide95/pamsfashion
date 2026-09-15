import { RoleGuard } from "@/components/shared/RoleGuard";
import { PortalShell } from "@/components/layout/PortalShell";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={["admin"]}>
      <PortalShell sidebar={<AdminSidebar />} title="Admin Dashboard">
        {children}
      </PortalShell>
    </RoleGuard>
  );
}
