import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { verifySession } from "@/lib/auth/dal";
import connectDB from "@/lib/db";
import AddressModel from "@/lib/models/Address";
import { AddressManager } from "@/components/profile/AddressManager";

export default function AddressesPage() {
  return (
    <section className="max-w-335 mx-auto px-4 md:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
        <Link href="/profile" className="hover:text-zinc-900 transition-colors">
          My Account
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 font-medium">Addresses</span>
      </div>

      <Suspense fallback={<AddressesSkeleton />}>
        <AddressesContent />
      </Suspense>
    </section>
  );
}

async function AddressesContent() {
  const session = await verifySession();

  await connectDB();
  const addresses = await AddressModel.find({ userId: session.userId })
    .sort({ isDefault: -1, createdAt: -1 })
    .lean();

  const serialized = addresses.map((a) => ({
    _id: a._id.toString(),
    label: a.label || "Home",
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    isDefault: a.isDefault,
  }));

  return <AddressManager initialAddresses={serialized} />;
}

function AddressesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-zinc-100 rounded-lg w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-44 bg-zinc-100 rounded-2xl" />
        <div className="h-44 bg-zinc-100 rounded-2xl" />
      </div>
    </div>
  );
}
