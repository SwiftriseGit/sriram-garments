"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, ShoppingCart, Menu, X, ShoppingBag, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/collections" },
  { label: "Contact", href: "/pages/contact" },
  { label: "About Us", href: "/pages/about-us" },
  { label: "Privacy Policy", href: "/pages/privacy-policy" },
  { label: "Return Policy", href: "/pages/return-policy" },
];

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Home matches exactly; other links also match their nested routes (e.g. /collections/men)
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 relative">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo (2).png"
            alt="SriRam Garments"
            width={180}
            height={64}
            className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                  active
                    ? "text-zinc-900 border-orange-500"
                    : "text-zinc-600 border-transparent hover:text-zinc-900 hover:border-zinc-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
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
            <Sheet>
              <SheetTrigger
                aria-label="Wishlist"
                className="relative p-1 text-zinc-700 hover:text-orange-500 transition-colors"
              >
                <Heart className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  0
                </span>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-white border-l border-zinc-200">
                <SheetHeader className="border-b border-zinc-100 pb-4 mb-4">
                  <SheetTitle className="text-xl font-bold">Your Wishlist</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-900">Your wishlist is empty</h3>
                  <p className="text-zinc-500 mb-8 max-w-[250px]">
                    Save items you love here. Choose a category below to start exploring.
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-6 text-base font-semibold">
                    Start Shopping
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger
                aria-label="Cart"
                className="relative p-1 text-zinc-700 hover:text-orange-500 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  0
                </span>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-white border-l border-zinc-200 flex flex-col p-0">
                <SheetHeader className="border-b border-zinc-100 p-6 pb-4">
                  <SheetTitle className="text-xl font-bold">Your Cart (0)</SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto p-6 pt-2">
                  <div className="flex flex-col items-center justify-center h-full text-center min-h-[50vh]">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-zinc-900">Your cart is empty</h3>
                    <p className="text-zinc-500 mb-8 max-w-[250px]">
                      Let's find something special. Choose a category to start exploring.
                    </p>
                    
                    <div className="w-full space-y-3 mt-4 text-left border-t border-zinc-100 pt-8">
                      <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Quick Links</h4>
                      <a href="#" className="flex justify-between items-center py-2 text-zinc-700 hover:text-orange-500 group border-b border-zinc-50">
                        <span className="font-medium text-sm">Shop Men's Clothing</span>
                        <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                      </a>
                      <a href="#" className="flex justify-between items-center py-2 text-zinc-700 hover:text-orange-500 group border-b border-zinc-50">
                        <span className="font-medium text-sm">New Arrivals</span>
                        <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                      </a>
                      <a href="#" className="flex justify-between items-center py-2 text-zinc-700 hover:text-orange-500 group">
                        <span className="font-medium text-sm">Special Offers</span>
                        <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100 p-6 bg-white mt-auto">
                  <div className="flex items-start gap-3 mb-6 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                    <div className="text-emerald-500 mt-0.5 bg-emerald-100 p-1.5 rounded-full">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <div>
                      <h5 className="font-semibold text-[13px] text-zinc-900 mb-0.5">Free Express Shipping</h5>
                      <p className="text-[11px] text-zinc-500">On all orders over ₹999</p>
                    </div>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-6 text-base font-semibold shadow-md shadow-orange-500/20">
                    Start Shopping
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
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
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-base font-medium ${
                    active ? "text-orange-500" : "text-zinc-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
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
