import { requireAuth } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <AdminShell session={session}>
      {children}
    </AdminShell>
  );
}
