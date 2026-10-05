import { requireAuth } from "@/lib/auth/session";
import { Tags } from "lucide-react";

export default async function AdminCategoriesPage() {
  await requireAuth();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Categories</h1>
        <p className="text-sm text-zinc-500 mt-1 font-medium">
          Manage product categories.
        </p>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm p-16 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100">
          <Tags className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">Coming Soon</h2>
        <p className="text-zinc-500 max-w-sm">
          Category management is currently under development. Please check back later.
        </p>
      </div>
    </div>
  );
}
