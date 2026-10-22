"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ShoppingBag,
  ArrowRight,
  LogOut,
  Settings,
  Package,
  Shield,
  Trash2,
  Minus,
  Plus,
  LogIn,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { formatPrice } from "@/lib/format";
import { logout } from "@/actions/auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/collections" },
  { label: "Contact", href: "/pages/contact" },
  { label: "About Us", href: "/pages/about-us" },
  { label: "Privacy Policy", href: "/pages/privacy-policy" },
  { label: "Return Policy", href: "/pages/return-policy" },
];

interface SessionUser {
  userId: string;
  email: string;
  role: string;
  firstName: string;
}

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch auth state from /api/auth/me (Route Handler — correct pattern for client component)
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live stores from localStorage
  const cartItems = useCartStore((s) => s.items);
  const cartSubtotal = useCartStore((s) => s.subtotal);
  const removeCartItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const wishlistItems = useWishlistStore((s) => s.items);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);
  const addCartItem = useCartStore((s) => s.addItem);

  const cartCount = mounted ? cartItems.length : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;
  const subtotal = cartSubtotal();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-335 mx-auto px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 relative">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auth: Login button or Profile dropdown */}
            {user ? (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Account menu"
                    className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 via-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-xs hover:shadow-md transition-shadow cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    {user.firstName.charAt(0).toUpperCase()}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-64 bg-white border border-zinc-200 rounded-2xl shadow-xl p-0 overflow-hidden"
                  >
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                      <p className="font-semibold text-zinc-900 text-sm">{user.firstName}</p>
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <DropdownMenuItem className="p-0 rounded-xl focus:bg-zinc-50 cursor-pointer">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:text-zinc-900 w-full"
                        >
                          <User className="w-4 h-4 text-zinc-400" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0 rounded-xl focus:bg-zinc-50 cursor-pointer">
                        <Link
                          href="/profile/orders"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:text-zinc-900 w-full"
                        >
                          <Package className="w-4 h-4 text-zinc-400" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <DropdownMenuItem className="p-0 rounded-xl focus:bg-indigo-50 cursor-pointer">
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-indigo-600 font-medium w-full"
                          >
                            <Shield className="w-4 h-4 text-indigo-600" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </div>
                    <DropdownMenuSeparator className="bg-zinc-100 m-0" />
                    <div className="p-1.5">
                      <DropdownMenuItem
                        variant="destructive"
                        className="p-0 rounded-xl focus:bg-rose-50 cursor-pointer"
                      >
                        <form action={logout} className="w-full">
                          <button
                            type="submit"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:text-rose-700 transition-colors w-full cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </form>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-orange-600 border border-orange-200 rounded-full hover:bg-orange-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* ── Wishlist Drawer ── */}
            <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
              <SheetTrigger
                aria-label="Wishlist"
                className="relative p-1 text-zinc-700 hover:text-orange-500 transition-colors cursor-pointer"
              >
                <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                <span
                  suppressHydrationWarning
                  className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                >
                  {wishlistCount}
                </span>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-white border-l border-zinc-200 flex flex-col p-0">
                <SheetHeader className="border-b border-zinc-100 p-6 pb-4">
                  <SheetTitle className="text-xl font-bold">
                    Your Wishlist (<span suppressHydrationWarning>{wishlistCount}</span>)
                  </SheetTitle>
                </SheetHeader>

                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-zinc-900">Your wishlist is empty</h3>
                    <p className="text-zinc-500 mb-8 max-w-62.5">
                      Save items you love here. Choose a category below to start exploring.
                    </p>
                    <Link
                      href="/collections"
                      onClick={() => setIsWishlistOpen(false)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3.5 text-center text-sm font-semibold block transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100"
                      >
                        <div className="w-16 h-16 rounded-lg bg-white border border-zinc-200 overflow-hidden shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-zinc-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-zinc-900 truncate">{item.name}</h4>
                          <p className="text-sm font-bold text-zinc-800 mt-1">
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => {
                                addCartItem({
                                  ...item,
                                  size: "M",
                                  quantity: 1,
                                });
                                removeWishlistItem(item.id);
                              }}
                              className="text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer"
                            >
                              Move to Cart
                            </button>
                            <span className="text-zinc-300">·</span>
                            <button
                              onClick={() => removeWishlistItem(item.id)}
                              className="text-xs font-medium text-red-500 hover:text-red-600 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* ── Cart Drawer ── */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger
                aria-label="Cart"
                className="relative p-1 text-zinc-700 hover:text-orange-500 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                <span
                  suppressHydrationWarning
                  className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                >
                  {cartCount}
                </span>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-white border-l border-zinc-200 flex flex-col p-0">
                <SheetHeader className="border-b border-zinc-100 p-6 pb-4">
                  <SheetTitle className="text-xl font-bold">
                    Your Cart (<span suppressHydrationWarning>{cartCount}</span>)
                  </SheetTitle>
                </SheetHeader>

                {cartItems.length === 0 ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-6 pt-2">
                      <div className="flex flex-col items-center justify-center h-full text-center min-h-[50vh]">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                          <ShoppingBag className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-zinc-900">Your cart is empty</h3>
                        <p className="text-zinc-500 mb-8 max-w-62.5">
                          Let's find something special. Choose a category to start exploring.
                        </p>

                        <div className="w-full space-y-3 mt-4 text-left border-t border-zinc-100 pt-8">
                          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Quick Links</h4>
                          <Link
                            href="/collections"
                            onClick={() => setIsCartOpen(false)}
                            className="flex justify-between items-center py-2 text-zinc-700 hover:text-orange-500 group border-b border-zinc-50"
                          >
                            <span className="font-medium text-sm">Shop All Products</span>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-orange-500 transition-colors" />
                          </Link>
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
                      <Link
                        href="/collections"
                        onClick={() => setIsCartOpen(false)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3.5 text-center text-sm font-semibold shadow-md shadow-orange-500/20 block transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.size}`}
                          className="flex gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100"
                        >
                          <div className="w-16 h-20 rounded-lg bg-white border border-zinc-200 overflow-hidden shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-zinc-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-zinc-900 truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color?.name && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-zinc-300 inline-block"
                                      style={{ backgroundColor: item.color.hex }}
                                    />
                                    {item.color.name}
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-sm font-bold text-zinc-800 mt-1">
                              {formatPrice(item.price)}
                            </p>

                            {/* Quantity controls */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 border border-zinc-200 rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.size, item.quantity - 1)
                                  }
                                  className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center text-sm font-semibold text-zinc-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.size, item.quantity + 1)
                                  }
                                  className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeCartItem(item.id, item.size)}
                                className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-100 p-6 bg-white mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500">Subtotal</span>
                        <span className="text-lg font-bold text-zinc-900">{formatPrice(subtotal)}</span>
                      </div>
                      {subtotal < 999 && (
                        <div className="text-xs text-zinc-400">
                          Add {formatPrice(999 - subtotal)} more for free shipping
                        </div>
                      )}
                      {subtotal >= 999 && (
                        <div className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                          <div className="text-emerald-500 mt-0.5 bg-emerald-100 p-1 rounded-full">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                          </div>
                          <p className="text-xs font-medium text-emerald-700">
                            You qualify for free shipping!
                          </p>
                        </div>
                      )}
                      <Link
                        href="/checkout"
                        onClick={() => setIsCartOpen(false)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3.5 text-center text-sm font-semibold shadow-md shadow-orange-500/20 block transition-colors"
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  </>
                )}
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
        className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-xl flex flex-col z-40 transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
      >
        <div className="py-6 px-6 flex flex-col items-center">
          <nav className="flex flex-col items-center gap-1.5 mb-5 border-b border-zinc-100 pb-5 w-full max-w-sm">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`w-full text-center py-2.5 px-4 rounded-xl text-base transition-all ${
                    active
                      ? "text-orange-600 font-semibold bg-orange-50/80 shadow-xs"
                      : "text-zinc-700 font-medium hover:text-orange-500 hover:bg-zinc-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col items-center justify-center w-full max-w-sm space-y-2">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2.5 text-zinc-700 hover:text-orange-600 font-semibold text-sm sm:text-base py-2.5 px-5 rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  <span>My Account</span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2.5 text-indigo-600 hover:text-indigo-700 font-semibold text-sm sm:text-base py-2.5 px-5 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 text-red-600 hover:text-red-700 font-semibold text-sm sm:text-base py-2.5 px-5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Logout</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2.5 text-orange-600 hover:text-orange-700 font-semibold text-sm sm:text-base py-2.5 px-5 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
