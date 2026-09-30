"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Heart, ShoppingCart, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Men", href: "#", active: true },
  { label: "Women", href: "#", active: false },
  { label: "Kids", href: "#", active: false },
  { label: "New Arrivals", href: "#", active: false },
  { label: "Offers", href: "#", active: false },
];

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 relative">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <Image
            src="/logo (2).png"
            alt="SriRam Garments"
            width={180}
            height={64}
            className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
            priority
          />
        </a>

        {/* Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium pb-1 transition-colors ${
                link.active
                  ? "text-zinc-900 border-b-2 border-orange-500"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Account"
              className="p-1 text-zinc-700 hover:text-orange-500 transition-colors hidden sm:block"
            >
              <User className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </button>
            <button
              aria-label="Wishlist"
              className="relative p-1 text-zinc-700 hover:text-orange-500 transition-colors"
            >
              <Heart className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                0
              </span>
            </button>
            <button
              aria-label="Cart"
              className="relative p-1 text-zinc-700 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Open menu"
            className="lg:hidden p-1 text-zinc-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-lg flex flex-col z-40 transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
      >
        <div className="py-4 px-6">
          <nav className="flex flex-col gap-4 mb-6 border-b border-zinc-100 pb-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-base font-medium ${
                  link.active ? "text-orange-500" : "text-zinc-600"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="flex flex-col gap-4">
            <button className="flex items-center gap-3 text-zinc-700 hover:text-orange-500 font-medium transition-colors">
              <User className="w-5 h-5" />
              My Account
            </button>
            <button className="flex items-center gap-3 text-zinc-700 hover:text-orange-500 font-medium transition-colors">
              <Heart className="w-5 h-5" />
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
