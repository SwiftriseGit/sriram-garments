import { FaTruckFast } from "react-icons/fa6";

export default function TopBar() {
  return (
    <div className="bg-[#111111] text-white text-[11px] py-2 px-4 md:px-8 hidden sm:flex justify-between items-center tracking-wide font-medium">
      <div className="flex items-center gap-2">
        <FaTruckFast className="text-[#ff3800] text-[15px]" />
        <span>Free Shipping on orders above ₹999</span>
      </div>
      <div className="text-zinc-300 hidden md:block">
        Quality Garments for Every You
        <span className="mx-2 text-zinc-500">|</span>
        SriRam Garments
      </div>
      <div className="flex items-center gap-1 text-zinc-300">
        <a href="#" className="hover:text-white transition-colors">
          Track Order
        </a>
        <span className="text-zinc-500 mx-1">|</span>
        <a href="#" className="hover:text-white transition-colors">
          Help
        </a>
        <span className="text-zinc-500 mx-1">|</span>
        <a href="#" className="hover:text-white transition-colors">
          Store Locator
        </a>
      </div>
    </div>
  );
}
