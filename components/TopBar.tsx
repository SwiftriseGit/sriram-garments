import { FaTruckFast } from "react-icons/fa6";

export default function TopBar() {
  return (
    <div className="bg-[#111111] text-white text-[11px] py-2 px-3 sm:px-4 md:px-8 flex justify-center sm:justify-between items-center tracking-wide font-medium">
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <FaTruckFast className="text-[#ff3800] text-[14px] sm:text-[15px]" />
        <span>Free Shipping on orders above ₹2999</span>
      </div>
      <div className="text-zinc-300 hidden md:block">
        Quality Garments for Every You
        <span className="mx-2 text-zinc-500">|</span>
        SriRam Garments
      </div>
      <div className="hidden sm:flex items-center gap-1 text-zinc-300">
        <a href="/pages/contact" className="hover:text-white transition-colors">
          Help
        </a>
        <span className="text-zinc-500 mx-1">|</span>
        <a
          href="https://www.google.com/maps/place/18%C2%B051'29.4%22N+82%C2%B034'24.0%22E/@18.8581581,82.5707588,17z/data=!3m1!4b1!4m4!3m3!8m2!3d18.8581581!4d82.5733337?hl=en&entry=ttu&g_ep=EgoyMDI2MTEwNC4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          Store Locator
        </a>
      </div>
    </div>
  );
}
