"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/actions/admin";
import { toast } from "sonner";
import { ShieldCheck, UserCheck, ShieldAlert, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleChangeButtonProps {
  userId: string;
  userName: string;
  currentRole: "customer" | "admin";
  isCurrentUser: boolean;
}

export default function RoleChangeButton({
  userId,
  userName,
  currentRole,
  isCurrentUser,
}: RoleChangeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  if (isCurrentUser) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-400 bg-zinc-100/70 border border-zinc-200/60 rounded-lg cursor-not-allowed select-none"
        title="You cannot alter your own admin privileges to avoid accidental lockout."
      >
        <Lock className="w-3 h-3 text-zinc-400" />
        You (Active)
      </span>
    );
  }

  const targetRole = currentRole === "admin" ? "customer" : "admin";

  const handleRoleChange = () => {
    startTransition(async () => {
      try {
        const res = await updateUserRole(userId, targetRole);
        if (res.success) {
          toast.success(res.message || "Role updated successfully!");
          setIsConfirming(false);
          router.refresh();
        } else {
          toast.error(res.error || "Failed to update role");
          setIsConfirming(false);
        }
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        setIsConfirming(false);
      }
    });
  };

  if (isConfirming) {
    return (
      <div className="inline-flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          disabled={isPending}
          onClick={handleRoleChange}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-white shadow-xs transition-all",
            targetRole === "admin"
              ? "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400"
              : "bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400"
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Updating...
            </>
          ) : (
            `Yes, Make ${targetRole === "admin" ? "Admin" : "Customer"}`
          )}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setIsConfirming(false)}
          className="px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (currentRole === "customer") {
    return (
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-purple-200/80 bg-purple-50/70 text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-all shadow-xs group"
        title={`Promote ${userName} to Administrator`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
        Make Admin
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 transition-all shadow-xs group"
      title={`Change ${userName}'s role back to standard Customer`}
    >
      <UserCheck className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-700 group-hover:scale-110 transition-transform" />
      Make Customer
    </button>
  );
}
