"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
export default function SiteLoader() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Set timeout to start fade out
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1800); // Show solid for 1.8s

    // Set timeout to completely remove from DOM
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 2300); // 500ms fade transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Return null on server-side to avoid hydration mismatch, 
  // but since we want the loader to show immediately, we'll render it
  // and handle the hiding purely on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!show || !mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-500 ease-in-out ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Spinning Ring */}
        <div className="absolute w-24 h-24 sm:w-28 sm:h-28 border-[3px] border-orange-50 rounded-full animate-spin border-t-orange-500" />
        
        {/* Center Icon */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden flex items-center justify-center rounded-full">
            {/* Displaying the exact image provided inside the loader */}
            <Image 
              src="/splash-loader.png" 
              alt="Loader Icon" 
              width={260} 
              height={260} 
              className="object-cover absolute"
            />
          </div>
          
          {/* Soft Bottom Shadow */}
          <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 transform -translate-x-1/2 w-8 sm:w-10 h-1 sm:h-1.5 bg-orange-500/20 rounded-[100%] blur-[2px]" />
        </div>
      </div>
    </div>
  );
}
