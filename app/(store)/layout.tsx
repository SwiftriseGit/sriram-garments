import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getOptionalSession } from "@/lib/auth/dal";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalSession();

  return (
    <>
      <TopBar />
      <Suspense fallback={<header className="h-16 bg-white border-b border-zinc-200" />}>
        <SiteHeader initialUser={user} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
