"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function InitialLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show on first visit in the current session
    try {
      const alreadyShown = sessionStorage.getItem("initial-loader-shown");
      if (alreadyShown) {
        setLoading(false);
        return;
      }
    } catch {
      // Handle private browsing or restricted storage gracefully
    }

    // 850ms display duration
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 850);

    // 1200ms total: fade out completes and loader is removed from DOM
    const removeTimer = setTimeout(() => {
      setLoading(false);
      try {
        sessionStorage.setItem("initial-loader-shown", "true");
      } catch {
        // Ignore storage errors
      }
    }, 1250);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {/* Full-Screen Preloader Layer */}
      {loading && (
        <div
          id="initial-preloader"
          className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-400 ease-out ${
            fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{ willChange: "opacity" }}
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Spinning Orange Ring */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[2.5px] border-orange-100 border-t-orange-500 animate-spin" />

            {/* Shopping Bag Icon centered in ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center relative transition-transform duration-500 ease-out">
                <Image
                  src="/images/loader-bag.png"
                  alt="Loading"
                  width={250}
                  height={250}
                  priority
                  className="object-cover absolute max-w-none"
                />
              </div>
            </div>

            {/* Soft ground shadow */}
            <div className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-1 bg-orange-500/15 rounded-full blur-[2px]" />
          </div>
        </div>
      )}

      {/* Main Website Wrapper: hidden during loader, then smoothly revealed */}
      <div
        className={`min-h-full flex flex-col transition-opacity duration-500 ease-out ${
          loading && !fadeOut ? "opacity-0 invisible" : "opacity-100 visible"
        }`}
      >
        {children}
      </div>
    </>
  );
}
