import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getUser } from "@/lib/auth/dal";
import { SettingsForm } from "@/components/profile/SettingsForm";

export default function SettingsPage() {
  return (
    <section className="max-w-335 mx-auto px-4 md:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
        <Link href="/profile" className="hover:text-zinc-900 transition-colors">
          My Account
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-medium">Account Settings</span>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </section>
  );
}

async function SettingsContent() {
  const user = await getUser();

  return (
    <SettingsForm
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      }}
    />
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-8 max-w-2xl animate-pulse">
      <div className="h-96 bg-zinc-100 rounded-2xl" />
      <div className="h-72 bg-zinc-100 rounded-2xl" />
    </div>
  );
}
