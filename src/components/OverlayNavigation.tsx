import { useStore, type SplitModeContent } from "../store/useStore";
import logo from "../assets/k-logo.svg";

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

// Camera targets for each overlay (matching Room.tsx object placements)
const CAMERA_TARGETS: Record<
  string,
  { position: [number, number, number]; lookAt: [number, number, number] }
> = {
  about: {
    position: [1.6, 1.7, 1.5],
    lookAt: [0.3, 0.5, 2.8],
  },
  technical: {
    position: [0, 1.7, -1.5],
    lookAt: [-2.5, 2, -1.7],
  },
  projects: {
    position: [2, 1.7, -2.5],
    lookAt: [0, 1, -6],
  },
  certifications: {
    position: [2, 1.7, -0.5],
    lookAt: [70, 15, -20],
  },
};

export default function OverlayNavigation() {
  const viewMode = useStore((state) => state.viewMode);
  const current = useStore((state) => state.splitModeContent);
  const setSplitModeContent = useStore((state) => state.setSplitModeContent);
  const setCameraTarget = useStore((state) => state.setCameraTarget);

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
      // Set camera target to animate to the new object's view
      setCameraTarget(CAMERA_TARGETS[content]);
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
        className="fixed bottom-6 z-50 flex items-center gap-3 animate-in backdrop-blur-sm px-3 py-2"
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
          className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
          <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 font-equitan">
            {prevContent ? OVERLAY_LABELS[prevContent] : "Previous"}
          </span>
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
