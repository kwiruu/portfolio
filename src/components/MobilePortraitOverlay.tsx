import { useEffect, useState } from "react";
import { useStore, type SplitModeContent } from "../store/useStore";

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

// Navigation order for overlays
const OVERLAY_ORDER: SplitModeContent[] = [
  "about",
  "technical",
  "projects",
  "certifications",
];

const OVERLAY_LABELS: Record<string, string> = {
  about: "About Me",
  technical: "Technical Skills",
  projects: "Projects",
  certifications: "Certifications",
};

// Camera targets for each overlay - shifted right for portrait view
const CAMERA_TARGETS: Record<
  string,
  { position: [number, number, number]; lookAt: [number, number, number] }
> = {
  about: {
    position: [1.6, 1.7, 1.5],
    lookAt: [-2.6, -1, 2.8], // shifted right from 0.3
  },
  technical: {
    position: [0, 1.7, -2],
    lookAt: [-1.8, 2, -2.5], // shifted right from -2.5
  },
  projects: {
    position: [2.5, 1.7, -2.5],
    lookAt: [1.5, 1, -6], // shifted right from 0
  },
  certifications: {
    position: [2, 1.7, 1.2],
    lookAt: [75, 15, -20], // shifted right from 70
  },
};

/**
 * MobilePortraitOverlay
 * Shown when mobile users are in portrait mode and try to enter FPS mode.
 * Automatically redirects them to split mode with overlay navigation.
 * Also shows landscape suggestion when clicking the king piece on portrait.
 */
export default function MobilePortraitOverlay() {
  const viewMode = useStore((state) => state.viewMode);
  const splitModeContent = useStore((state) => state.splitModeContent);
  const enterSplitMode = useStore((state) => state.enterSplitMode);
  const setSplitModeContent = useStore((state) => state.setSplitModeContent);
  const setCameraTarget = useStore((state) => state.setCameraTarget);
  const setViewMode = useStore((state) => state.setViewMode);
  const showLandscapePrompt = useStore((state) => state.showLandscapePrompt);
  const setShowLandscapePrompt = useStore(
    (state) => state.setShowLandscapePrompt
  );

  const [isMobile, setIsMobile] = useState(() => checkIsMobile());
  const [isPortrait, setIsPortrait] = useState(() => checkIsPortrait());
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<SplitModeContent | null>(
    null
  );

  useEffect(() => {
    const handleChange = () => {
      setIsMobile(checkIsMobile());
      const newIsPortrait = checkIsPortrait();
      // Auto-dismiss landscape prompt when orientation changes to landscape
      if (!newIsPortrait && isPortrait && showLandscapePrompt) {
        setShowLandscapePrompt(false);
      }
      setIsPortrait(newIsPortrait);
    };

    window.addEventListener("resize", handleChange);
    window.addEventListener("orientationchange", handleChange);

    return () => {
      window.removeEventListener("resize", handleChange);
      window.removeEventListener("orientationchange", handleChange);
    };
  }, [isPortrait, showLandscapePrompt, setShowLandscapePrompt]);

  // Auto-redirect portrait mobile users from FPS to split mode after a delay
  useEffect(() => {
    if (isMobile && isPortrait && viewMode === "FPS_MODE") {
      // Wait 1 second to let user see the 3D scene before entering split mode
      const timer = setTimeout(() => {
        setCameraTarget(CAMERA_TARGETS["about"]);
        enterSplitMode("about");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMobile, isPortrait, viewMode, enterSplitMode, setCameraTarget]);

  // Show landscape suggestion when triggered from king piece click
  if (showLandscapePrompt && isMobile && isPortrait) {
    const handleProceedWithPortrait = () => {
      setShowLandscapePrompt(false);
      // Continue to split mode with about content
      setCameraTarget(CAMERA_TARGETS["about"]);
      enterSplitMode("about");
    };

    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-[fadeInOverlay_220ms_ease-out]">
        <div className="bg-white h-5/6 rounded-2xl p-8 max-w-sm text-center flex justify-center flex-col animate-[popCard_260ms_cubic-bezier(0.22,0.61,0.36,1)]">
          {/* Animated rotate phone icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-24 h-24">
              {/* Phone outline that rotates */}
              <svg
                className="w-24 h-24 text-neutral-700 animate-[tilt_2s_ease-in-out_infinite]"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                {/* Phone body */}
                <rect
                  x="30"
                  y="15"
                  width="40"
                  height="70"
                  rx="6"
                  ry="6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                {/* Screen */}
                <rect
                  x="34"
                  y="22"
                  width="32"
                  height="50"
                  rx="2"
                  fill="currentColor"
                  opacity="0.1"
                />
                {/* Home button */}
                <circle
                  cx="50"
                  cy="78"
                  r="3"
                  fill="currentColor"
                  opacity="0.4"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-neutral-900 mb-3 font-equitan">
            Rotate for Full Experience
          </h2>
          <p className="text-neutral-600 text-sm mb-6 font-equitan leading-relaxed">
            For the best 3D portfolio experience, please rotate your device to
            landscape mode.
          </p>

          <button
            onClick={handleProceedWithPortrait}
            className="w-full py-3 px-4 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors font-equitan"
            style={{ touchAction: "manipulation" }}
          >
            Proceed with Portrait
          </button>
        </div>
      </div>
    );
  }

  // Don't render if not mobile, not portrait, or not in split mode
  if (!isMobile || !isPortrait || viewMode !== "SPLIT_MODE") {
    return null;
  }

  // Use the navigating target during transitions, otherwise current content
  const effectiveContent = navigatingTo || splitModeContent || "about";
  const currentIndex = OVERLAY_ORDER.indexOf(effectiveContent);
  const prevContent = currentIndex > 0 ? OVERLAY_ORDER[currentIndex - 1] : null;
  const nextContent =
    currentIndex < OVERLAY_ORDER.length - 1
      ? OVERLAY_ORDER[currentIndex + 1]
      : null;

  const handleNavigate = (content: SplitModeContent) => {
    if (content && !isNavigating) {
      setIsNavigating(true);
      setNavigatingTo(content); // Track where we're going for button states
      // First move the camera
      setCameraTarget(CAMERA_TARGETS[content]);
      // Hide current overlay
      setSplitModeContent(null);

      // Wait 1 second to show 3D scene, then show the new overlay
      setTimeout(() => {
        setSplitModeContent(content);
        setIsNavigating(false);
        setNavigatingTo(null);
      }, 1000);
    }
  };

  const handleExit = () => {
    // Exit to website mode on mobile portrait
    setViewMode("WEBSITE_MODE");
  };

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Top bar with exit button */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <button
          onClick={handleExit}
          className="px-4 py-2 text-sm font-semibold text-neutral-600 bg-white"
          style={{ touchAction: "manipulation" }}
        >
          ✕ Exit
        </button>
      </div>

      {/* Left navigation button - centered vertically */}
      <button
        onClick={() => handleNavigate(prevContent)}
        disabled={!prevContent || isNavigating}
        className="absolute left-3 top-1/2 -translate-y-1/2 disabled:opacity-40 disabled:cursor-not-allowed transition-all pointer-events-auto"
        style={{ touchAction: "manipulation" }}
        data-overlay-nav="true"
        aria-label={
          prevContent ? `Go to ${OVERLAY_LABELS[prevContent]}` : "No previous"
        }
      >
        <svg
          className="w-6 h-6 text-neutral-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Right navigation button - centered vertically */}
      <button
        onClick={() => handleNavigate(nextContent)}
        disabled={!nextContent || isNavigating}
        className="absolute right-3 top-1/2 -translate-y-1/2 disabled:opacity-40 disabled:cursor-not-allowed transition-all pointer-events-auto"
        style={{ touchAction: "manipulation" }}
        data-overlay-nav="true"
        aria-label={
          nextContent ? `Go to ${OVERLAY_LABELS[nextContent]}` : "No next"
        }
      >
        <svg
          className="w-6 h-6 text-neutral-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
