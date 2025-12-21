import { useEffect, useState, useRef } from "react";
import { useStore } from "../store/useStore";

function checkIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = window.innerWidth <= 1024 || window.innerHeight <= 768;
  const uaMobile =
    /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  return touchCapable || coarse || smallScreen || uaMobile;
}

function checkIsPortrait(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerHeight > window.innerWidth;
}

export default function LandscapePrompt() {
  const viewMode = useStore((state) => state.viewMode);
  const setIsPortrait = useStore((state) => state.setIsPortrait);
  const [showPrompt, setShowPrompt] = useState(false);
  const hasInitialized = useRef(false);

  // Effect to handle orientation changes
  useEffect(() => {
    const updateOrientation = () => {
      const isMobile = checkIsMobile();
      const isPortrait = checkIsPortrait();
      const isActiveMode =
        viewMode === "SPLIT_MODE" ||
        viewMode === "FPS_MODE" ||
        viewMode === "TOUR_MODE";

      // Update the global portrait state so TourController can react
      setIsPortrait(isMobile && isPortrait);
      setShowPrompt(isMobile && isPortrait && isActiveMode);
    };

    // Initialize on mount or viewMode change
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      updateOrientation();
    } else {
      updateOrientation();
    }

    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, [viewMode, setIsPortrait]);

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 animate-fadeIn">
      {/* Rotate Phone Icon */}
      <div className="mb-6 animate-tilt">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
          />
        </svg>
      </div>

      {/* Text */}
      <h2 className="text-xl font-bold text-white font-equitan mb-2 text-center">
        Rotate Your Phone
      </h2>
      <p className="text-sm text-neutral-400 font-equitan text-center max-w-xs">
        Please rotate your device to landscape mode for the best experience
      </p>
    </div>
  );
}
