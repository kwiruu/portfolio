import { useState, useEffect } from "react";
import { useStore, type SplitModeContent } from "../store/useStore";
import logo from "../assets/k-logo.svg";

// Helper function to detect mobile devices
function checkIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = window.innerWidth <= 1024 || window.innerHeight <= 768;
  return touchCapable || coarse || smallScreen;
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

// Camera targets for each overlay - separate configs for desktop and mobile
const CAMERA_TARGETS = {
  about: {
    desktop: {
      position: [1.6, 1.7, 1.5] as [number, number, number],
      lookAt: [0.3, 0.5, 2.8] as [number, number, number],
    },
    mobile: {
      position: [2, 1.7, 1.6] as [number, number, number],
      lookAt: [1.3, 0.5, 2.8] as [number, number, number],
    },
  },
  technical: {
    desktop: {
      position: [0, 1.7, -1.5] as [number, number, number],
      lookAt: [-2.5, 2, -1.7] as [number, number, number],
    },
    mobile: {
      position: [0, 1.7, -1.5] as [number, number, number],
      lookAt: [-2.5, 2, -1] as [number, number, number],
    },
  },
  projects: {
    desktop: {
      position: [2, 1.7, -2.5] as [number, number, number],
      lookAt: [0, 1, -6] as [number, number, number],
    },
    mobile: {
      position: [2, 1.7, -2.5] as [number, number, number],
      lookAt: [-1, 1, -6] as [number, number, number],
    },
  },
  certifications: {
    desktop: {
      position: [2, 1.7, -0.5] as [number, number, number],
      lookAt: [70, 15, -20] as [number, number, number],
    },
    mobile: {
      position: [2, 1.7, -0.5] as [number, number, number],
      lookAt: [70, 15, -35] as [number, number, number],
    },
  },
};

export default function OverlayNavigation() {
  const viewMode = useStore((state) => state.viewMode);
  const current = useStore((state) => state.splitModeContent);
  const setSplitModeContent = useStore((state) => state.setSplitModeContent);
  const setCameraTarget = useStore((state) => state.setCameraTarget);
  const [isMobile, setIsMobile] = useState(checkIsMobile());

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only show when in split mode with valid content
  if (viewMode !== "SPLIT_MODE" || !current) return null;

  const currentIndex = OVERLAY_ORDER.indexOf(current);
  const prevContent = currentIndex > 0 ? OVERLAY_ORDER[currentIndex - 1] : null;
  const nextContent =
    currentIndex < OVERLAY_ORDER.length - 1
      ? OVERLAY_ORDER[currentIndex + 1]
      : null;

  const handleNavigate = (content: SplitModeContent) => {
    if (content) {
      // Set camera target to animate to the new object's view (use mobile or desktop config)
      const targets = CAMERA_TARGETS[content];
      setCameraTarget(isMobile ? targets.mobile : targets.desktop);
      setSplitModeContent(content);
    }
  };

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
      </div>
      <div
        data-overlay-nav="true"
        className="fixed bottom-6 z-50 flex items-center gap-3 animate-in px-3 py-2"
        style={{
          left: "auto",
          right: 24,
          justifyContent: "flex-end",
          pointerEvents: "auto",
        }}
      >
        {/* Previous Button */}
        <button
          onClick={() => handleNavigate(prevContent)}
          disabled={!prevContent}
          className="group flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label={
            prevContent ? `Go to ${OVERLAY_LABELS[prevContent]}` : "No previous"
          }
        >
          <svg
            className="w-4 h-4 text-neutral-600 group-hover:text-neutral-900 group-hover:-translate-x-0.5 transition-all"
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

        {/* Next Button */}
        <button
          onClick={() => handleNavigate(nextContent)}
          disabled={!nextContent}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label={
            nextContent ? `Go to ${OVERLAY_LABELS[nextContent]}` : "No next"
          }
        >
          <span className="text-sm font-medium text-white font-equitan">
            {nextContent ? OVERLAY_LABELS[nextContent] : "Next"}
          </span>
          <svg
            className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-all"
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
    </div>
  );
}
