import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const shopLinks = [
  { label: "Men", href: "/collections?gender=Men" },
  { label: "New Arrivals", href: "/collections" },
  { label: "Offers", href: "/collections" },
];

const helpLinks = [
  { label: "Return Policy", href: "/pages/return-policy" },
  { label: "Privacy Policy", href: "/pages/privacy-policy" },
  { label: "Size Guide", href: "#" },
  { label: "FAQ", href: "#" },
];

const aboutLinks = [
  { label: "Our Story", href: "/pages/about-us" },
  { label: "Quality Promise", href: "/pages/about-us" },
  { label: "Store Locator", href: "#" },
  { label: "Contact Us", href: "/pages/contact" },
];

export default function SiteFooter() {
  return (
    <footer className="w-full">
      {/* Main Footer Content */}
      <div className="bg-[#f9f9f9] py-10 sm:py-14">
        <div className="max-w-335 mx-auto px-3 sm:px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
            {/* Logo Area */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-2">
              <Link href="/" className="inline-block mb-4 sm:mb-6">
                <Image
                  src="/logo (2).png"
                  alt="SriRam Garments"
                  width={240}
                  height={80}
                  className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
                />
              </Link>
              <p className="text-[12px] sm:text-[13px] text-zinc-500 font-medium leading-relaxed max-w-sm">
                Quality garments designed for comfort and style. Experience the perfect blend of tradition and modern fashion with SriRam Garments.
              </p>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-4 sm:mb-5">Shop</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] sm:text-[13px] font-medium text-zinc-600 hover:text-orange-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Links (Moved Return Policy & Privacy Policy here, removed Track Order, Shipping Policy, Returns & Exchanges) */}
            <div>
              <h4 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-4 sm:mb-5">Help</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {helpLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] sm:text-[13px] font-medium text-zinc-600 hover:text-orange-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Links */}
            <div>
              <h4 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-4 sm:mb-5">About</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {aboutLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] sm:text-[13px] font-medium text-zinc-600 hover:text-orange-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-200 mt-10 sm:mt-12 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-[11px] sm:text-[12px] font-medium text-zinc-500">
              © 2026 Built by{" "}
              <a
                href="https://swiftrise.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
              >
                Swiftrise Solution Pvt Ltd
              </a>
              .
            </p>
            {/* Social Icons: Keep Instagram & Facebook, removed YouTube, added WhatsApp */}
            <div className="flex items-center gap-4 text-zinc-500">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
