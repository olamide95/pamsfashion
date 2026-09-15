import { RoleGuard } from "@/components/shared/RoleGuard";
import { PortalShell } from "@/components/layout/PortalShell";
import { StudentSidebar } from "@/components/layout/StudentSidebar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow={["student", "instructor", "admin"]}>
      <PortalShell sidebar={<StudentSidebar />} title="Student Portal">
        {children}
      </PortalShell>
    </RoleGuard>
  );
}
