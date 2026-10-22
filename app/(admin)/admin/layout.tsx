import { requireAdmin } from "@/lib/auth/dal";
import AdminShell from "@/components/admin/AdminShell";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <AdminShell session={session}>
      {children}
    </AdminShell>
  );
}
