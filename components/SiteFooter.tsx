import Image from "next/image";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export default function SiteFooter() {
  return (
    <footer className="w-full">
      {/* Main Footer Content */}
      <div className="bg-[#f9f9f9] py-10 sm:py-14">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
            {/* Logo Area */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-2">
              <a href="/" className="inline-block mb-4 sm:mb-6">
                <Image
                  src="/logo (2).png"
                  alt="SriRam Garments"
                  width={160}
                  height={54}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </a>
              <p className="text-[12px] sm:text-[13px] text-zinc-500 font-medium leading-relaxed max-w-sm">
                Quality garments designed for comfort and style. Experience the perfect blend of tradition and modern fashion with SriRam Garments.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-4 sm:mb-5">Shop</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {["Men", "New Arrivals", "Offers"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12px] sm:text-[13px] font-medium text-zinc-600 hover:text-orange-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-4 sm:mb-5">Help</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {[
                  "Track Order",
                  "Returns & Exchanges",
                  "Shipping Policy",
                  "Size Guide",
                  "FAQ",
                ].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12px] sm:text-[13px] font-medium text-zinc-600 hover:text-orange-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[14px] sm:text-[15px] text-zinc-900 mb-4 sm:mb-5">About</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {["Our Story", "Quality Promise", "Store Locator", "Contact Us"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[12px] sm:text-[13px] font-medium text-zinc-600 hover:text-orange-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-200 mt-10 sm:mt-12 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-[11px] sm:text-[12px] font-medium text-zinc-500">
              © 2026 Built by <a href="https://swiftrise.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">Swiftrise Solution Pvt Ltd</a>.
            </p>
            <div className="flex items-center gap-4 text-zinc-500">
              <a href="#" className="hover:text-zinc-900 transition-colors" aria-label="Instagram">
                <FaInstagram className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
              <a href="#" className="hover:text-zinc-900 transition-colors" aria-label="Facebook">
                <FaFacebook className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
              <a href="#" className="hover:text-zinc-900 transition-colors" aria-label="YouTube">
                <FaYoutube className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
