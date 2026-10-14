"use client";

import { Package, MapPin, Settings, LogOut, ChevronRight, Phone, Calendar, Crown } from "lucide-react";
import Link from "next/link";

const PROFILE_SECTIONS = [
  {
    title: "My Orders",
    description: "Track, return, or buy again",
    icon: Package,
    href: "/profile/orders",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Addresses",
    description: "Manage delivery addresses",
    icon: MapPin,
    href: "#",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Account Settings",
    description: "Edit profile, password & preferences",
    icon: Settings,
    href: "#",
    color: "bg-purple-50 text-purple-600",
  },
];

// Dummy user data
const DUMMY_USER = {
  name: "Sunil Maharana",
  email: "sunil@example.com",
  phone: "+91 98765 43210",
  joinedDate: "August 2026",
};

export default function ProfilePage() {
  return (
    <section className="max-w-[1340px] mx-auto px-4 md:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-8">
        My Account
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-zinc-200/70 rounded-2xl shadow-sm overflow-hidden">
            {/* Header with warm ambient gradient */}
            <div className="relative bg-gradient-to-b from-[#FFF5EE] via-[#FFF9F5] to-white p-6 pb-5">
              {/* Decorative soft ambient glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 relative z-10">
                {/* Avatar with orange gradient */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-orange-500/25 shrink-0 ring-4 ring-white">
                  {DUMMY_USER.name.charAt(0)}
                </div>

                {/* Name, email and member badge */}
                <div className="min-w-0">
                  <h2 className="font-bold text-lg text-zinc-900 leading-snug truncate">
                    {DUMMY_USER.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-medium truncate mt-0.5">
                    {DUMMY_USER.email}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-100/80 text-orange-600 text-xs font-semibold">
                    <Crown className="w-3.5 h-3.5 text-orange-500" />
                    <span>Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Rows */}
            <div className="px-6 pb-6 pt-2 space-y-1 text-sm">
              <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5 text-zinc-400">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-zinc-500">Phone</span>
                </div>
                <span className="font-semibold text-zinc-800">
                  {DUMMY_USER.phone}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5 text-zinc-400">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span className="font-medium text-zinc-500">Member since</span>
                </div>
                <span className="font-semibold text-zinc-800">
                  {DUMMY_USER.joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="lg:col-span-2 space-y-4">
          {PROFILE_SECTIONS.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="flex items-center gap-4 p-5 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${section.color}`}
              >
                <section.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-zinc-400">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}

          {/* Logout */}
          <button className="flex items-center gap-4 p-5 w-full bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-red-200 transition-all group text-left">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-red-50 text-red-600">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-zinc-900 group-hover:text-red-600 transition-colors">
                Logout
              </h3>
              <p className="text-sm text-zinc-400">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
