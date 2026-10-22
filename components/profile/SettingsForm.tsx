"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateProfile, changePassword } from "@/actions/user";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SettingsFormProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onUpdateProfile = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    setProfileSuccess(false);
    setProfileError(null);

    const formData = new FormData();
    formData.set("firstName", data.firstName);
    formData.set("lastName", data.lastName);
    formData.set("phone", data.phone);

    const result = await updateProfile(undefined, formData);
    setIsUpdatingProfile(false);

    if (result?.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } else {
      setProfileError(result?.message || "Failed to update profile");
    }
  };

  const onUpdatePassword = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true);
    setPasswordSuccess(false);
    setPasswordError(null);

    const formData = new FormData();
    formData.set("currentPassword", data.currentPassword);
    formData.set("newPassword", data.newPassword);
    formData.set("confirmPassword", data.confirmPassword);

    const result = await changePassword(undefined, formData);
    setIsUpdatingPassword(false);

    if (result?.success) {
      setPasswordSuccess(true);
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 4000);
    } else {
      setPasswordError(result?.error || "Failed to change password");
    }
  };

  const newPasswordValue = watchPassword("newPassword");

  return (
    <div className="space-y-8 max-w-2xl">
      {/* ── Section 1: Profile Information ── */}
      <div className="bg-white border border-zinc-200/70 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-zinc-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-zinc-900">Personal Details</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Update your personal information and contact details
            </p>
          </div>
        </div>

        {profileSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {profileError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                {...registerProfile("firstName", { required: "First name is required" })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              {profileErrors.firstName && (
                <p className="text-xs text-red-500 mt-1">{profileErrors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                {...registerProfile("lastName", { required: "Last name is required" })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              {profileErrors.lastName && (
                <p className="text-xs text-red-500 mt-1">{profileErrors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm bg-zinc-50 text-zinc-500 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              {...registerProfile("phone", {
                required: "Phone number is required",
                minLength: { value: 10, message: "At least 10 digits" },
              })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {profileErrors.phone && (
              <p className="text-xs text-red-500 mt-1">{profileErrors.phone.message}</p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* ── Section 2: Security & Password ── */}
      <div className="bg-white border border-zinc-200/70 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-5 border-b border-zinc-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-zinc-900">Security & Password</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Ensure your account is using a long, random password to stay secure
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Current Password *
            </label>
            <input
              type="password"
              {...registerPassword("currentPassword", {
                required: "Current password is required",
              })}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {passwordErrors.currentPassword && (
              <p className="text-xs text-red-500 mt-1">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                New Password *
              </label>
              <input
                type="password"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: { value: 8, message: "Must be at least 8 characters" },
                })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                {...registerPassword("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (v) => v === newPasswordValue || "Passwords do not match",
                })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              {isUpdatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
