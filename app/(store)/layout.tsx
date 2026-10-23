import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getOptionalSession } from "@/lib/auth/dal";

// Dedicated Server Component wrapper for streaming dynamic session resolution
async function StoreHeader() {
  const user = await getOptionalSession();
  return <SiteHeader initialUser={user} />;
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <Suspense fallback={<header className="h-16 bg-white border-b border-zinc-200" />}>
        <StoreHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
