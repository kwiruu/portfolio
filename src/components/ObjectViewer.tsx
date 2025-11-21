import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import gsap from "gsap";

export default function ObjectViewer() {
  const viewMode = useStore((state) => state.viewMode);
  const activeObject = useStore((state) => state.activeObject);
  const closeObject = useStore((state) => state.closeObject);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    if (viewMode === "VIEWING_OBJECT") {
      // Fade in viewer
      gsap.to(viewerRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
      });
    } else {
      // Fade out viewer
      gsap.to(viewerRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
      });
    }
  }, [viewMode]);

  if (!activeObject) return null;

  return (
    <div
      ref={viewerRef}
      className="fixed top-0 left-0 w-full h-full z-20 flex items-center justify-center bg-black/90 opacity-0 pointer-events-none"
    >
      <div className="max-w-3xl w-[90%] max-h-[80vh] overflow-y-auto bg-zinc-900 rounded-3xl p-16 relative border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* Close button */}
        <button
          onClick={closeObject}
          className="absolute top-5 right-5 w-10 h-10 rounded-full border-none bg-white/10 text-white text-2xl cursor-pointer flex items-center justify-center transition-colors hover:bg-white/20"
        >
          ×
        </button>

        {/* Content */}
        <h2 className="text-4xl mb-8 bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent font-bold">
          {activeObject.title}
        </h2>

        <p className="text-xl leading-relaxed text-gray-300 mb-10">
          {activeObject.content}
        </p>

        {/* Additional content sections */}
        <div className="mt-10">
          <h3 className="text-2xl mb-5 text-white">Technologies Used</h3>
          <div className="flex gap-2.5 flex-wrap">
            {["React", "Three.js", "TypeScript", "GSAP"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-purple-500/20 rounded-2xl text-sm text-purple-500 border border-purple-500/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={closeObject}
          className="mt-10 px-8 py-3 text-base font-semibold bg-gradient-to-r from-purple-500 to-purple-800 text-white border-none rounded-full cursor-pointer transition-transform hover:scale-105"
        >
          Back to Room
        </button>

        {/* Hint */}
        <p className="mt-5 text-sm text-gray-600 text-center">
          Press ESC or click Back to return to FPS mode
        </p>
      </div>
    </div>
  );
}
